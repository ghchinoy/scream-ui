# Releasing Workspace Packages

This document outlines the steps required to bump the version of the workspace libraries (`@ghchinoy/lit-audio-ui` and `@ghchinoy/lit-text-ui`) and publish them to the npm registry.

**Important:** These packages are versioned independently. You only need to release the package(s) that have changed.

## Prerequisites

1.  **Clean Working Directory:** Ensure you have no uncommitted changes.
    ```bash
    git status
    ```
2.  **Authentication:** Make sure you are logged into your npm account in your terminal.
    ```bash
    npm whoami
    # If not logged in, run: npm login
    ```

## Release Steps

### 1. Build and Verify
Before releasing, verify that the entire workspace builds successfully.
```bash
make build
# or npm run build
```

### 2. Bump the Version
Navigate to the specific library package directory and use `npm version` to bump the version. This will automatically update `package.json`.

For `lit-audio-ui`:
```bash
cd packages/lit-audio-ui
npm version patch  # Use 'patch', 'minor', or 'major' depending on the changes
```

For `lit-text-ui`:
```bash
cd packages/lit-text-ui
npm version patch  # Use 'patch', 'minor', or 'major' depending on the changes
```

### 3. Update the Root Lockfile
Since this is an npm workspace, you must update the root `package-lock.json` to reflect the newly bumped version(s).

```bash
cd ../..
npm install --ignore-scripts
```
*(Note: `--ignore-scripts` is recommended to avoid unnecessary re-builds during lockfile updates).*

### 4. Commit and Tag
Stage the version bump and lockfile changes, commit them, and tag the release. Because packages are versioned independently, it's best practice to prefix the tag with the package name to avoid collisions.

For example, if you bumped `lit-audio-ui` to v1.2.3:
```bash
git add packages/lit-audio-ui/package.json package-lock.json
git commit -m "chore(release): bump lit-audio-ui to v1.2.3"
git tag lit-audio-ui-v1.2.3
```

If you bumped `lit-text-ui` to v0.1.1:
```bash
git add packages/lit-text-ui/package.json package-lock.json
git commit -m "chore(release): bump lit-text-ui to v0.1.1"
git tag lit-text-ui-v0.1.1
```

*(Note: If you release both simultaneously, you can commit them together and push two tags.)*

### 5. Push to GitHub
Push the commit and the new tag(s) to the remote repository.

```bash
git push origin main
git push --tags
```

### 6. Publish to npm
Finally, navigate back to the specific library directory and publish the package. Since these are scoped packages (`@ghchinoy`), you must explicitly set the access to public.

For `lit-audio-ui`:
```bash
cd packages/lit-audio-ui
npm publish --access public
```

For `lit-text-ui`:
```bash
cd packages/lit-text-ui
npm publish --access public
```

---

## Troubleshooting

- **"You do not have permission to publish"**: Ensure you are logged into the correct npm account (`npm whoami`).
- **Missing built files**: Make sure you ran `make build` before publishing. The `package.json` relies on the `dist/` folder being present.
