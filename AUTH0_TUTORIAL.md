# Auth0 Authentication Tutorial for React Apps on GitHub Pages

A comprehensive guide to implementing Auth0 authentication in a React Single Page Application (SPA) deployed on GitHub Pages, with special attention to secret management and deployment considerations.

## Table of Contents

1. [Understanding Auth0 and SPAs](#understanding-auth0-and-spas)
2. [Why Auth0 for GitHub Pages?](#why-auth0-for-github-pages)
3. [Secret Management in SPAs](#secret-management-in-spas)
4. [Implementation Guide](#implementation-guide)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Understanding Auth0 and SPAs

### What is Auth0?

Auth0 is an authentication and authorization platform that handles user authentication, allowing you to:
- Add login/logout functionality without building it from scratch
- Support multiple authentication providers (Google, GitHub, email/password, etc.)
- Manage user sessions and tokens securely
- Implement security best practices automatically

### How SPAs Work with Auth0

Single Page Applications run entirely in the browser, which affects how authentication works:

```mermaid
sequenceDiagram
    participant User
    participant React App
    participant Auth0
    participant API (Optional)
    
    User->>React App: Clicks "Login"
    React App->>Auth0: Redirects to Auth0 login page
    User->>Auth0: Enters credentials
    Auth0->>Auth0: Validates credentials
    Auth0->>React App: Redirects back with auth code
    React App->>Auth0: Exchanges code for tokens
    Auth0->>React App: Returns access token & ID token
    React App->>React App: Stores tokens, updates UI
    React App->>API (Optional): Makes authenticated requests
```

**Key Concepts:**

1. **Authorization Code Flow with PKCE**: The most secure flow for SPAs
   - PKCE (Proof Key for Code Exchange) prevents authorization code interception
   - No client secret needed (unlike traditional OAuth)

2. **Tokens**:
   - **ID Token**: Contains user profile information (name, email, etc.)
   - **Access Token**: Used for API authorization
   - **Refresh Token**: (Optional) Used to get new access tokens without re-login

3. **Public Client**: SPAs are "public clients" - their code runs in the browser and can be inspected

---

## Why Auth0 for GitHub Pages?

### Advantages

✅ **No Backend Required**: Auth0 handles all authentication logic
✅ **Static Hosting Compatible**: Works perfectly with GitHub Pages
✅ **Free Tier**: Generous free tier for small projects (up to 7,000 monthly active users)
✅ **Production Ready**: Enterprise-grade security out of the box

### Challenges with GitHub Pages

⚠️ **No Server-Side Rendering**: Can't use server-side authentication
⚠️ **No Environment Variables at Runtime**: Must inject at build time
⚠️ **Hash Routing**: GitHub Pages works best with HashRouter due to lack of server configuration
⚠️ **Nested Paths**: Apps deployed to subpaths require careful callback URL configuration

---

## Secret Management in SPAs

### What's Safe to Expose?

> [!IMPORTANT]
> **Understanding Public vs Secret Credentials**

In Auth0 SPAs, some credentials are **meant to be public**:

| Credential | Safe to Expose? | Why? |
|------------|----------------|------|
| **Domain** | ✅ Yes | Used for API endpoints, not sensitive |
| **Client ID** | ✅ Yes | Identifies your app, designed to be public |
| **Client Secret** | ❌ NO | Only for server-side apps, NEVER use in SPAs |

**Why is this safe?**

Even though anyone can see your Domain and Client ID:
- Auth0 validates requests against your configured callback URLs
- PKCE flow prevents token interception
- Only your whitelisted domains can successfully complete authentication
- User data is protected by Auth0's secure infrastructure

### Environment Variables in Vite

Vite uses the `VITE_` prefix for environment variables that should be exposed to the client:

**.env (Local Development)**
```bash
# These will be bundled into your app
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here

# Regular env vars (NOT prefixed with VITE_) are NOT accessible in client code
# Only use VITE_ prefix for non-sensitive values
```

**Accessing in Code**
```javascript
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
```

> [!WARNING]
> **Never Store Sensitive Data**
> - API keys for external services
> - Database credentials
> - Client secrets
> - Private encryption keys
> 
> These should NEVER be in a SPA - use a backend API instead!

### GitHub Secrets for Deployment

While Domain and Client ID are safe to expose, we still use GitHub Secrets for deployment to:
- Keep credentials out of version control
- Make it easy to rotate credentials
- Support multiple environments (dev, staging, prod)

**Setting Up GitHub Secrets:**

1. Go to your repository: **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
npm install @auth0/auth0-react
```

### Step 2: Configure Environment Variables

Create `.env` file in your project root:

```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
```

Update `.env.example` for other developers:

```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
```

Add to `.gitignore`:

```
# Environment variables
.env
.env.local
```

### Step 3: Create Auth0 Provider Wrapper

For React Router integration, create a wrapper that handles navigation:

**src/auth/Auth0ProviderWithNavigate.jsx**
```jsx
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  
  // Get the redirect URI based on environment
  const redirectUri = window.location.origin + window.location.pathname;

  const onRedirectCallback = (appState) => {
    // Navigate to the return URL or home after authentication
    navigate(appState?.returnTo || '/');
  };

  if (!domain || !clientId) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Configuration Error</h2>
        <p>Auth0 configuration is missing. Please check your environment variables:</p>
        <ul>
          <li>VITE_AUTH0_DOMAIN: {domain || 'MISSING'}</li>
          <li>VITE_AUTH0_CLIENT_ID: {clientId ? 'Set' : 'MISSING'}</li>
        </ul>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};
```

**Key Configuration Options:**

- `redirect_uri`: Where Auth0 redirects after login (your app URL)
- `useRefreshTokens`: Enables automatic token renewal
- `cacheLocation="localstorage"`: Persists auth state across page refreshes

### Step 4: Wrap Your App

**src/main.jsx**
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './auth/Auth0ProviderWithNavigate';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './views/App/App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
```

> [!NOTE]
> **HashRouter vs BrowserRouter with Auth0**
> 
> While your app might use HashRouter, the Auth0Provider wrapper should ideally be outside the router context. If you must use HashRouter, the callback handling becomes slightly more complex but still works.

### Step 5: Create Authentication Components

**Login Button**
```jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'reactstrap';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return null; // Don't show if already logged in
  }

  return (
    <Button 
      color="primary" 
      onClick={() => loginWithRedirect()}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
```

**Logout Button**
```jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'reactstrap';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button 
      color="secondary" 
      onClick={() => logout({ 
        logoutParams: { 
          returnTo: window.location.origin + window.location.pathname 
        } 
      })}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
```

**User Profile**
```jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {user.picture && (
        <img 
          src={user.picture} 
          alt={user.name} 
          style={{ borderRadius: '50%', width: '32px', height: '32px' }}
        />
      )}
      <span>Welcome, {user.name}!</span>
    </div>
  );
};

export default UserProfile;
```

### Step 6: Protected Routes (Optional)

If you want to restrict access to certain pages:

**src/auth/ProtectedRoute.jsx**
```jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
```

**Usage in routes:**
```jsx
import ProtectedRoute from './auth/ProtectedRoute';
import Pokedex from './views/Pokedex/Pokedex';

// In your Routes:
<Route 
  path="/pokedex" 
  element={<ProtectedRoute component={Pokedex} />} 
/>
```

---

## GitHub Pages Deployment

### Deployment Workflow with GitHub Actions

Create **.github/workflows/deploy.yml**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # or master, depending on your default branch

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build with environment variables
        env:
          VITE_AUTH0_DOMAIN: ${{ secrets.VITE_AUTH0_DOMAIN }}
          VITE_AUTH0_CLIENT_ID: ${{ secrets.VITE_AUTH0_CLIENT_ID }}
        run: npm run build

      - name: Deploy to GitHub Pages
        run: |
          git remote set-url origin https://git:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
          npm run deploy -- -u "github-actions-bot <support+actions@github.com>"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**How it works:**

1. Triggered on push to main branch
2. Checks out code and sets up Node.js
3. Installs dependencies
4. **Injects Auth0 credentials from GitHub Secrets during build**
5. Builds the production bundle (credentials are now embedded)
6. Deploys to `gh-pages` branch using the gh-pages package

### Manual Deployment

If you prefer manual deployment:

```bash
# 1. Set environment variables temporarily (macOS/Linux)
export VITE_AUTH0_DOMAIN=your-tenant.auth0.com
export VITE_AUTH0_CLIENT_ID=your_client_id

# 2. Build
npm run build

# 3. Deploy
npm run deploy
```

### Important Notes for GitHub Pages

> [!CAUTION]
> **Callback URL Configuration**
> 
> Your Auth0 callback URLs must match EXACTLY:
> - ✅ Correct: `https://giuseppevizzari.github.io/pokedex2022-applicazioni-web`
> - ❌ Wrong: `https://giuseppevizzari.github.io` (missing base path)
> - ❌ Wrong: `https://giuseppevizzari.github.io/pokedex2022-applicazioni-web/` (trailing slash)

---

## Best Practices

### 1. Environment Variable Management

```bash
# .env (gitignored, for local dev)
VITE_AUTH0_DOMAIN=dev-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=dev_client_id

# .env.example (committed to git, template for team)
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
```

### 2. Error Handling

Always handle authentication errors gracefully:

```jsx
const { error, isLoading } = useAuth0();

if (error) {
  return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h2>Authentication Error</h2>
      <p>{error.message}</p>
    </div>
  );
}
```

### 3. Loading States

Show loading indicators during authentication:

```jsx
const { isLoading, isAuthenticated, user } = useAuth0();

if (isLoading) {
  return <div>Authenticating...</div>;
}
```

### 4. Separate Environments

Consider using different Auth0 applications for development vs production:

```bash
# Development
VITE_AUTH0_DOMAIN=dev-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=dev_client_id

# Production (GitHub Secrets)
VITE_AUTH0_DOMAIN=prod-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=prod_client_id
```

### 5. Token Management

```jsx
const { getAccessTokenSilently } = useAuth0();

// When calling your API
const callApi = async () => {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch('https://your-api.com/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

---

## Troubleshooting

### "Callback URL mismatch" Error

**Problem**: Auth0 shows error after login attempt

**Solutions**:
1. Check Auth0 Dashboard → Applications → Your App → Allowed Callback URLs
2. Ensure URLs match exactly (including base path)
3. For GitHub Pages: `https://username.github.io/repo-name`
4. For local dev: `http://localhost:5173`
5. Wait a few seconds after changing settings in Auth0

### "Origin is not allowed" CORS Error

**Problem**: Browser console shows CORS error

**Solutions**:
1. Add your domain to Allowed Web Origins in Auth0
2. For GitHub Pages: `https://username.github.io`
3. For local dev: `http://localhost:5173`

### Environment Variables Not Working

**Problem**: `import.meta.env.VITE_AUTH0_DOMAIN` is undefined

**Solutions**:
1. Ensure variable starts with `VITE_` prefix
2. Restart dev server after creating `.env`
3. Check `.env` file is in project root (same level as `package.json`)
4. Verify no extra spaces in `.env` file:
   ```bash
   # Wrong
   VITE_AUTH0_DOMAIN = value
   
   # Correct
   VITE_AUTH0_DOMAIN=value
   ```

### GitHub Actions Build Failing

**Problem**: Build fails with "VITE_AUTH0_DOMAIN is undefined"

**Solutions**:
1. Check GitHub Secrets are set correctly
2. Verify secret names match exactly (case-sensitive)
3. Ensure workflow file has correct `env:` block in build step

### HashRouter Issues

**Problem**: Authentication works locally but not on GitHub Pages

**Solutions**:
1. Ensure callback URL doesn't include `/#/` hash part
2. Use `window.location.origin + window.location.pathname` for redirectUri
3. In Auth0, use base URL without hash: `https://user.github.io/repo`

---

## Summary

### Checklist for Auth0 + GitHub Pages

- [ ] Create Auth0 application (SPA type)
- [ ] Configure callback URLs with full GitHub Pages path
- [ ] Set up Allowed Web Origins and Logout URLs
- [ ] Create `.env` file locally with Auth0 credentials
- [ ] Add `VITE_` prefix to environment variables
- [ ] Install `@auth0/auth0-react` package
- [ ] Create Auth0Provider wrapper component
- [ ] Wrap app with Auth0Provider
- [ ] Create Login/Logout components
- [ ] Test locally with `npm start`
- [ ] Add GitHub Secrets for deployment
- [ ] Create GitHub Actions workflow (or deploy manually)
- [ ] Test authentication on GitHub Pages
- [ ] Verify token persistence across page refreshes

### Key Takeaways

1. **Domain and Client ID are safe to expose** in SPAs - they're designed to be public
2. **Never use Client Secret** in frontend code
3. **Use `VITE_` prefix** for environment variables in Vite
4. **GitHub Secrets** are for keeping credentials out of git, not for runtime security
5. **Callback URLs must match exactly**, including base path for GitHub Pages
6. **HashRouter works fine** with Auth0, just handle callbacks correctly
7. **PKCE flow** provides security without needing a backend

---

For more information:
- [Auth0 React SDK Docs](https://auth0.com/docs/quickstart/spa/react)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
