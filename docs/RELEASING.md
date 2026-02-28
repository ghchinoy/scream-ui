# Releasing `@ghchinoy/lit-audio-ui`

This document outlines the steps required to bump the version of the `lit-audio-ui` library and publish it to the npm registry.

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
```

### 2. Bump the Version
Navigate to the library package directory and use `npm version` to bump the version. This will automatically update `package.json`.

```bash
cd packages/lit-audio-ui
npm version patch  # Use 'patch', 'minor', or 'major' depending on the changes
```

### 3. Update the Root Lockfile
Since this is an npm workspace, you must update the root `package-lock.json` to reflect the newly bumped version.

```bash
cd ../..
npm install --ignore-scripts
```
*(Note: `--ignore-scripts` is recommended to avoid unnecessary re-builds during lockfile updates).*

### 4. Commit and Tag
Stage the version bump and lockfile changes, commit them, and tag the release.

```bash
git add packages/lit-audio-ui/package.json package-lock.json
git commit -m "chore(release): bump lit-audio-ui to $(cat packages/lit-audio-ui/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')"
git tag v$(cat packages/lit-audio-ui/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')
```

### 5. Push to GitHub
Push the commit and the new tag to the remote repository.

```bash
git push origin main
git push --tags
```

### 6. Publish to npm
Finally, navigate back to the library directory and publish the package. Since this is a scoped package (`@ghchinoy`), you must explicitly set the access to public.

```bash
cd packages/lit-audio-ui
npm publish --access public
```

---

## Troubleshooting

- **"You do not have permission to publish"**: Ensure you are logged into the correct npm account (`npm whoami`).
- **Missing built files**: Make sure you ran `make build` before publishing. The `package.json` relies on the `dist/` folder being present.
