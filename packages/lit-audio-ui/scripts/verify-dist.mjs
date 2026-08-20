/**
 * Publish-time guard: fail hard if the built runtime output does not contain
 * expected markers. This prevents shipping a stale `dist/` (which is gitignored
 * and therefore easy to publish accidentally when the build silently fails).
 *
 * Add new assertions here whenever a fix must be guaranteed present in the
 * published artifact.
 */
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @type {{file: string, markers: string[]}[]} */
const checks = [
  {
    file: 'dist/components/providers/ui-audio-provider.js',
    // The autoplay fix: updated() must play on src-change when autoplay is set,
    // and the reactive property must be registered.
    markers: ['autoplay'],
  },
];

let failed = false;
for (const {file, markers} of checks) {
  const abs = join(pkgRoot, file);
  if (!existsSync(abs)) {
    console.error(`[verify-dist] MISSING build output: ${file}`);
    console.error('[verify-dist] Did the build run? Try `npm run build`.');
    failed = true;
    continue;
  }
  const contents = readFileSync(abs, 'utf8');
  for (const marker of markers) {
    if (!contents.includes(marker)) {
      console.error(
        `[verify-dist] STALE build: "${marker}" not found in ${file}`,
      );
      console.error(
        '[verify-dist] Refusing to publish a stale dist. Run a clean rebuild: ' +
          '`rm -rf node_modules package-lock.json && npm install && npm run build`',
      );
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('[verify-dist] OK: all expected markers present in built output.');
