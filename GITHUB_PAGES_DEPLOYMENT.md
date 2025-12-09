# GitHub Pages Deployment Tutorial for React/Vite Apps

A comprehensive guide to deploying React applications built with Vite to GitHub Pages using automated CI/CD with GitHub Actions and the `gh-pages` npm package.

## Table of Contents

1. [Understanding GitHub Pages Deployment Methods](#understanding-github-pages-deployment-methods)
2. [The gh-pages Package Approach](#the-gh-pages-package-approach)
3. [GitHub Actions CI/CD Pipeline](#github-actions-cicd-pipeline)
4. [Environment Variables and Secrets](#environment-variables-and-secrets)
5. [Nested Base Paths](#nested-base-paths)
6. [HashRouter for SPAs](#hashrouter-for-spas)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Understanding GitHub Pages Deployment Methods

GitHub Pages can serve your site in two main ways:

### Method 1: Manual Branch Deployment (Basic)

**How it works:**
- You manually create a `gh-pages` branch
- You manually build your project (`npm run build`)
- You manually copy build files to the `gh-pages` branch
- You manually commit and push
- GitHub Pages serves from the `gh-pages` branch

**Pros:**
- Simple to understand
- No additional tools needed
- Direct control over what gets deployed

**Cons:**
- ❌ Manual and error-prone
- ❌ Easy to forget steps
- ❌ No automation
- ❌ Difficult to inject environment variables
- ❌ Build artifacts tracked in git (bloats repository)
- ❌ Can't easily roll back deployments

### Method 2: Automated Deployment with gh-pages + GitHub Actions (This Project)

**How it works:**
- Push code to `main` branch
- GitHub Actions automatically:
  1. Checks out your code
  2. Installs dependencies
  3. Injects environment variables from secrets
  4. Builds the project
  5. Uses `gh-pages` package to deploy to `gh-pages` branch
  6. GitHub Pages serves the updated site

**Pros:**
- ✅ Fully automated - just push to `main`
- ✅ Environment variables from GitHub Secrets
- ✅ No manual steps to forget
- ✅ Build artifacts NOT in main branch
- ✅ Easy rollback (revert commit and push)
- ✅ Consistent builds every time
- ✅ CI/CD best practices

**Cons:**
- Requires initial setup (one-time)
- Slightly more complex to understand initially

---

## The gh-pages Package Approach

### What is gh-pages?

`gh-pages` is an npm package that automates the deployment of build artifacts to a `gh-pages` branch.

**Installation:**
```bash
npm install --save-dev gh-pages
```

### How gh-pages Works

```mermaid
graph LR
    A[npm run deploy] --> B[Runs predeploy hook]
    B --> C[npm run build]
    C --> D[Creates dist/ folder]
    D --> E[gh-pages package]
    E --> F[Creates/updates gh-pages branch]
    F --> G[Pushes to GitHub]
    G --> H[GitHub Pages serves site]
```

**Step by step:**

1. **You run:** `npm run deploy`
2. **Package.json predeploy hook runs:** `npm run build`
3. **Vite builds:** Creates `dist/` folder with optimized assets
4. **gh-pages package:**
   - Creates or switches to `gh-pages` branch
   - Clears old content
   - Copies everything from `dist/` to root
   - Commits with message like "Updates"
   - Force-pushes to `origin/gh-pages`
5. **GitHub Pages:** Automatically detects changes and deploys

### Package.json Configuration

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

**Key points:**
- `predeploy`: Runs automatically before `deploy` (builds the app)
- `deploy`: Runs `gh-pages -d dist` (deploys the `dist` folder)
- `-d dist`: Tells gh-pages which directory to deploy

### Manual Deployment (Local)

You can deploy manually from your computer:

```bash
npm run deploy
```

**What happens:**
1. Builds your app locally
2. Pushes to `gh-pages` branch
3. Uses your local `.env` file for environment variables

**Limitations:**
- ❌ Requires your local environment to be set up
- ❌ Uses local `.env` (not GitHub Secrets)
- ❌ No audit trail of who deployed
- ❌ Can't deploy from CI/CD

---

## GitHub Actions CI/CD Pipeline

### Why Use GitHub Actions?

GitHub Actions provides a cloud-based CI/CD environment that:
- ✅ Runs automatically on code changes
- ✅ Has access to GitHub Secrets
- ✅ Provides consistent build environment
- ✅ Creates deployment history
- ✅ Can run tests before deploying
- ✅ Free for public repositories

### Workflow File Structure

Location: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # Trigger on push to main branch

permissions:
  contents: write  # Allow workflow to push to gh-pages

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      # Step 1: Get the code
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 2: Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'  # Cache npm dependencies

      # Step 3: Install dependencies
      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      # Step 4: Build with environment variables
      - name: Build with environment variables
        env:
          VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
          VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
        run: npm run build

      # Step 5: Deploy to GitHub Pages
      - name: Deploy to GitHub Pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
          npx gh-pages -d dist -u "github-actions-bot <support+actions@github.com>"
```

### Workflow Breakdown

#### Trigger Configuration

```yaml
on:
  push:
    branches:
      - main
```

**When the workflow runs:**
- Automatically on every push to `main` branch
- NOT on pull requests (unless configured)
- NOT on pushes to other branches

**To trigger manually:**
- Make an empty commit: `git commit --allow-empty -m "Trigger deployment"`
- Or use GitHub's "Re-run jobs" button in the Actions tab

#### Step 1: Checkout Code

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

**What it does:**
- Clones your repository to the GitHub Actions runner
- Uses the commit that triggered the workflow

#### Step 2: Setup Node.js

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

**What it does:**
- Installs Node.js version 20
- Configures npm caching to speed up future builds
- Caches `node_modules` based on `package-lock.json`

**Performance impact:**
- First run: ~2-3 minutes
- Subsequent runs with cache: ~30-60 seconds

#### Step 3: Install Dependencies

```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

**Why `npm ci` instead of `npm install`?**

| `npm install` | `npm ci` |
|---------------|----------|
| Uses `package.json` | Uses `package-lock.json` |
| Can update lock file | Never modifies lock file |
| Allows version ranges | Exact versions only |
| Slower | Faster |
| Development | CI/CD |

**Why `--legacy-peer-deps`?**
- Handles peer dependency conflicts (e.g., React 19.2.0 vs 19.2.1)
- Required when using packages not yet updated for latest React
- Matches local installation method

#### Step 4: Build with Environment Variables

```yaml
- name: Build with environment variables
  env:
    VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
    VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
  run: npm run build
```

**Critical for SPAs with dynamic configuration:**

1. **Environment variables are set** for this step only
2. **Vite reads them** during build via `import.meta.env.VITE_*`
3. **Values are embedded** into the JavaScript bundle
4. **Not accessible at runtime** - they're compile-time only

**Example in code:**
```javascript
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
// At build time, becomes:
const domain = "dev-xyz.auth0.com";
```

#### Step 5: Deploy to GitHub Pages

```yaml
- name: Deploy to GitHub Pages
  env:
    VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
    VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
    npm run deploy -- -u "github-actions-bot <support+actions@github.com>"
```

**Why `npx gh-pages` instead of `npm run deploy`?**

We use `npx gh-pages` directly here to avoid a **double build**:

1. **Step 4** runs `npm run build` (with env vars) to create the `dist/` folder.
2. If we ran `npm run deploy`, it would trigger the `predeploy` hook, which runs `npm run build` *again*.
3. The second build (inside deploy) would fail or produce an empty config if we didn't provide env vars again.

**By using `npx gh-pages -d dist`:**
- We skip the `predeploy` hook script
- We deploy the artifacts already built in Step 4
- We don't need to provide `VITE_` secrets again in this step
- The process is faster and cleaner

**Git configuration:**
```bash
git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
```

- Configures git to use the GitHub token for authentication
- Required to push to the repository from Actions
- `GITHUB_TOKEN` is automatically provided by GitHub Actions

**Deployment command:**
```bash
npx gh-pages -d dist -u "github-actions-bot <support+actions@github.com>"
```

- `npx gh-pages`: Runs the gh-pages tool directly
- `-d dist`: Deploys the `dist` folder created in the previous step
- `-u "..."`: Sets git user for the commit

---

## Environment Variables and Secrets

### Vite Environment Variables

Vite uses a prefix system for environment variables:

**In `.env` file:**
```bash
VITE_AUTH0_DOMAIN=dev-xyz.auth0.com
VITE_AUTH0_CLIENT_ID=abc123
```

**In code:**
```javascript
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
```

**Rules:**
- ✅ Must start with `VITE_` to be accessible in client code
- ✅ Embedded at build time (not runtime)
- ✅ Safe for public values (domain, client ID)
- ❌ Never use for actual secrets (API keys, passwords)

### GitHub Secrets

**Setting up secrets:**

1. Go to repository **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secrets with same names as in `.env`:
   - Name: `VITE_AUTH0_DOMAIN`
   - Name: `VITE_AUTH0_CLIENT_ID`

**Using secrets in workflow:**
```yaml
env:
  VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
```

**Security features:**
- 🔒 Encrypted at rest
- 🔒 Masked in logs (shown as ***)
- 🔒 Only accessible to authorized workflows
- 🔒 Can't be read after creation (only updated)

### Local vs CI/CD Environment Variables

| Environment | Source | When Used |
|-------------|--------|-----------|
| **Local Dev** | `.env` file | `npm start` |
| **Local Build** | `.env` file | `npm run build` |
| **Local Deploy** | `.env` file | `npm run deploy` |
| **CI/CD** | GitHub Secrets | GitHub Actions workflow |

---

## Nested Base Paths

### The Problem

When deploying to GitHub Pages at a repository path (not root domain):

- ❌ Wrong: `https://username.github.io/` (root)
- ✅ Correct: `https://username.github.io/repo-name/` (nested)

All asset URLs need to include the base path.

### Vite Configuration

**vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: "/pokedex2022-applicazioni-web",  // ← Repository name
  plugins: [react()],
})
```

**What this does:**

- **Assets:** `/assets/logo.png` → `/pokedex2022-applicazioni-web/assets/logo.png`
- **Scripts:** `/main.js` → `/pokedex2022-applicazioni-web/main.js`
- **Styles:** `/style.css` → `/pokedex2022-applicazioni-web/style.css`

### Auth0 Redirect URIs

With a base path, Auth0 redirect must include it:

```javascript
const redirectUri = window.location.origin + window.location.pathname;
// Returns: http://localhost:5173/pokedex2022-applicazioni-web
// Or: https://username.github.io/pokedex2022-applicazioni-web
```

**Auth0 Dashboard configuration:**

**Allowed Callback URLs:**
```
http://localhost:5173/pokedex2022-applicazioni-web,
https://giuseppevizzari.github.io/pokedex2022-applicazioni-web
```

⚠️ **Common mistake:** Forgetting the base path in callback URLs!

---

## HashRouter for SPAs

### Why HashRouter for GitHub Pages?

GitHub Pages is static hosting with no server-side routing. This causes issues with BrowserRouter:

**Problem with BrowserRouter:**
1. User visits: `https://user.github.io/app/about`
2. GitHub Pages looks for file: `/app/about/index.html`
3. File doesn't exist → 404 error

**HashRouter solution:**
1. User visits: `https://user.github.io/app/#/about`
2. GitHub Pages serves: `/app/index.html` (always exists)
3. React Router reads `#/about` from URL hash
4. Renders correct component ✅

### HashRouter Setup

**main.jsx:**
```javascript
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </HashRouter>
  </StrictMode>
)
```

**App.jsx:**
```javascript
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
```

**Generated URLs:**
- Home: `https://user.github.io/app/#/`
- About: `https://user.github.io/app/#/about`

### HashRouter with Auth0

Auth0 redirects to the base URL without hash:
- **After login:** `https://user.github.io/app/`
- **HashRouter preserves:** Previous route in session storage
- **Result:** User returns to where they were

**Auth0Provider configuration:**
```javascript
<Auth0Provider
  domain={domain}
  clientId={clientId}
  authorizationParams={{
    redirect_uri: window.location.origin + window.location.pathname
  }}
>
```

---

## Troubleshooting

### Deployment Fails: "Permission denied"

**Error:**
```
Error: Permission denied to github-actions[bot]
```

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Save

### Deployment Succeeds but Site Shows 404

**Causes:**
1. **GitHub Pages not enabled**
   - Go to **Settings** → **Pages**
   - Source: Deploy from branch `gh-pages`
   
2. **Wrong base path in vite.config.js**
   ```javascript
   base: "/repo-name"  // Must match actual repo name
   ```

3. **Custom domain configured incorrectly**
   - Remove custom domain if not using one

### Environment Variables Not Working

**Symptoms:**
- Local works, production shows "MISSING"
- Auth0 configuration error on deployed site

**Checklist:**
- [ ] GitHub Secrets are set (not Variables)
- [ ] Secret names match exactly (case-sensitive)
- [ ] Secrets are in deploy step AND build step
- [ ] Deployment ran AFTER setting secrets
- [ ] Variables start with `VITE_` prefix

**Verify in Actions log:**
```yaml
# This WON'T show the actual values (they're masked)
# But you can see the build succeeded
Run npm run build
vite v5.0.0 building for production...
✓ 150 modules transformed.
dist/index.html                0.45 kB
dist/assets/index-abc123.js  150.00 kB
✓ built in 2.34s
```

### Asset Paths Broken (404 for CSS/JS)

**Symptoms:**
- Page loads but no styling
- Console shows 404 for `/assets/...`

**Solution:**
Check `vite.config.js` base path matches repository:
```javascript
export default defineConfig({
  base: "/correct-repo-name",  // ← Fix this
})
```

### "npm ci" Fails with Peer Dependency Error

**Error:**
```
ERESOLVE could not resolve
peer react@"^19.2.1" from @auth0/auth0-react
```

**Solution:**
Add `--legacy-peer-deps` flag:
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

### Deployment Runs but Uses Old Code

**Causes:**
1. **Browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   
2. **GitHub Pages CDN cache**
   - Wait 1-2 minutes
   - Check Actions tab for completion time

3. **Deploying to wrong branch**
   - Settings → Pages → Source should be `gh-pages`

---

## Best Practices

### 1. Separate Build and Deploy Steps

✅ **Good:**
```yaml
- name: Build
  env: { VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }} }
  run: npm run build

- name: Deploy
  env: { VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }} }
  run: npm run deploy
```

**Why:** Ensures environment variables are available for both builds (the explicit build step AND the predeploy hook).

### 2. Use npm ci in CI/CD

✅ **CI/CD:** `npm ci --legacy-peer-deps`
✅ **Local:** `npm install`

**Why:** `npm ci` is faster and more reliable in automated environments.

### 3. Version Your Workflows

```yaml
- uses: actions/checkout@v4  # ✅ Pin major version
- uses: actions/checkout@main  # ❌ Unpredictable
```

### 4. Cache Dependencies

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    cache: 'npm'  # ✅ Cache node_modules
```

**Impact:** Reduces build time by 50-70%.

### 5. Use Meaningful Commit Messages

```bash
# ❌ Bad
git commit -m "fix"

# ✅ Good
git commit -m "Fix Auth0 callback URL for production"
```

**Why:** Actions tab shows commit messages - helps identify what each deployment contains.

### 6. Test Locally Before Pushing

```bash
# Build and preview locally
npm run build
npm run serve
```

**Why:** Catches issues before they reach production.

### 7. Monitor Deployment Status

- Watch Actions tab after pushing
- Don't assume deployment succeeded
- Check for yellow warning icons

### 8. Keep Dependencies Updated

```bash
npm outdated
npm update
```

**Security:** Regularly update dependencies to patch vulnerabilities.

---

## Comparison Summary

| Feature | Manual Branch | gh-pages + Actions |
|---------|---------------|-------------------|
| **Automation** | Manual | Automatic |
| **Effort** | High | Low (one-time setup) |
| **Env Variables** | Difficult | GitHub Secrets ✅ |
| **Consistency** | Varies | Always consistent ✅ |
| **Rollback** | Difficult | Easy (revert commit) ✅ |
| **Build Artifacts in Git** | Yes ❌ | No ✅ |
| **CI/CD Best Practices** | No | Yes ✅ |
| **Learning Curve** | Low | Medium |
| **Maintenance** | Ongoing | Minimal ✅ |

---

## Quick Reference

### Deploy Checklist

- [ ] Set `base` in `vite.config.js`
- [ ] Use HashRouter in React app
- [ ] Install gh-pages: `npm install --save-dev gh-pages`
- [ ] Add deploy scripts to `package.json`
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Set GitHub Secrets
- [ ] Enable GitHub Pages (Settings → Pages → gh-pages branch)
- [ ] Push to main branch
- [ ] Monitor Actions tab
- [ ] Test deployed site

### Useful Commands

```bash
# Deploy manually
npm run deploy

# Build locally
npm run build

# Preview build
npm run serve

# Check deployment status
git log gh-pages -1

# Force redeploy (empty commit)
git commit --allow-empty -m "Redeploy"
git push origin main
```

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [gh-pages Package](https://www.npmjs.com/package/gh-pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Summary

The **gh-pages package + GitHub Actions** approach provides:

✅ **Automation** - One push deploys everything
✅ **Reliability** - Consistent builds every time  
✅ **Security** - Secrets managed properly
✅ **Maintainability** - Easy to update and rollback
✅ **Best Practices** - Modern CI/CD workflow

While it requires more initial setup than manual deployment, the long-term benefits in reliability, security, and developer experience make it the preferred approach for modern web applications.
