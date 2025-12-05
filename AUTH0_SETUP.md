# Auth0 Dashboard Setup Guide

This guide walks you through setting up Auth0 for your Pokedex React application deployed on GitHub Pages.

## Prerequisites

- An Auth0 account (sign up for free at [auth0.com](https://auth0.com))
- Your GitHub Pages URL: `https://giuseppevizzari.github.io/pokedex2022-applicazioni-web`

## Step 1: Create an Auth0 Application

1. **Log in to Auth0 Dashboard**
   - Go to [manage.auth0.com](https://manage.auth0.com)
   - Log in with your Auth0 account

2. **Create a New Application**
   - Click **Applications** → **Applications** in the left sidebar
   - Click **+ Create Application** button
   - Enter application name: `Pokedex App` (or any name you prefer)
   - Select **Single Page Web Applications**
   - Click **Create**

## Step 2: Configure Application Settings

After creating the application, you'll be taken to the application settings page.

### Basic Information

1. **Note your credentials** (you'll need these later):
   - **Domain**: `your-tenant.auth0.com` or `your-tenant.us.auth0.com`
   - **Client ID**: A long alphanumeric string
   
   > [!IMPORTANT]
   > **DO NOT use Client Secret** - it's not needed for Single Page Applications and should never be exposed in client-side code.

### Application URIs

Scroll down to the **Application URIs** section and configure the following:

2. **Allowed Callback URLs**
   
   These are the URLs Auth0 will redirect to after authentication:
   ```
   http://localhost:5173,
   https://giuseppevizzari.github.io/pokedex2022-applicazioni-web
   ```
   
   > [!NOTE]
   > - `http://localhost:5173` is for local development with Vite
   > - The GitHub Pages URL is for production
   > - Both URLs should be on separate lines or comma-separated

3. **Allowed Logout URLs**
   
   These are the URLs Auth0 will redirect to after logout:
   ```
   http://localhost:5173,
   https://giuseppevizzari.github.io/pokedex2022-applicazioni-web
   ```

4. **Allowed Web Origins**
   
   These origins are allowed to make authentication requests:
   ```
   http://localhost:5173,
   https://giuseppevizzari.github.io
   ```
   
   > [!NOTE]
   > For web origins, you can use just the domain without the full path

5. **Allowed Origins (CORS)**
   
   Same as Allowed Web Origins:
   ```
   http://localhost:5173,
   https://giuseppevizzari.github.io
   ```

### Advanced Settings (Optional)

6. **Refresh Token Rotation**
   - Scroll down to **Advanced Settings** → **Grant Types**
   - Ensure **Implicit**, **Authorization Code**, and **Refresh Token** are checked
   - This enables better security and token management

7. **Save Changes**
   - Scroll to the bottom and click **Save Changes**

## Step 3: Configure Allowed Logout Return URL

1. In the left sidebar, click **Authentication** → **Database**
2. Select your database connection (usually **Username-Password-Authentication**)
3. Verify that the connection is enabled for your application

## Step 4: Retrieve Credentials for Your App

You'll need these values for your application configuration:

### For Local Development (.env file)

```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
```

### For GitHub Secrets

You'll add these as repository secrets:

- **Secret Name**: `VITE_AUTH0_DOMAIN`
  - **Value**: `your-tenant.auth0.com`

- **Secret Name**: `VITE_AUTH0_CLIENT_ID`
  - **Value**: `your_client_id_here`

> [!TIP]
> To add GitHub secrets:
> 1. Go to your repository on GitHub
> 2. Click **Settings** → **Secrets and variables** → **Actions**
> 3. Click **New repository secret**
> 4. Add each secret with its name and value

## Step 5: Test Connection Settings

1. **Quick Test URL**
   
   Once you've deployed your app, you can test if Auth0 is configured correctly by attempting to log in. If you see:
   - ✅ Login redirects to Auth0 login page
   - ✅ After login, redirects back to your app
   - ❌ "Callback URL mismatch" error → Check your Allowed Callback URLs
   - ❌ "Origin not allowed" error → Check your Allowed Web Origins

## Common Issues and Solutions

### Issue: "Callback URL mismatch"

**Solution**: 
- Double-check that your Allowed Callback URLs exactly match your deployment URL
- For GitHub Pages: `https://giuseppevizzari.github.io/pokedex2022-applicazioni-web`
- Make sure there are no trailing slashes or typos

### Issue: "Origin is not allowed"

**Solution**:
- Add your GitHub Pages domain to Allowed Web Origins: `https://giuseppevizzari.github.io`
- Wait a few seconds for Auth0 to propagate the changes

### Issue: "Access token not valid"

**Solution**:
- Check that your Auth0 Domain is correct (it should include `.auth0.com` or `.us.auth0.com`)
- Verify you're using the Client ID, not the Client Secret

## Security Best Practices

> [!CAUTION]
> **Important Security Notes**
> - ✅ Domain and Client ID are safe to expose in your SPA
> - ❌ Never use or expose the Client Secret in your frontend code
> - ✅ Use HTTPS in production (GitHub Pages provides this automatically)
> - ✅ Keep your Auth0 tenant secure with strong admin passwords
> - ✅ Regularly review your Auth0 logs for suspicious activity

## Next Steps

After completing this setup:

1. ✅ Create a `.env` file locally with your credentials
2. ✅ Add secrets to your GitHub repository
3. ✅ Install the Auth0 SDK: `npm install @auth0/auth0-react`
4. ✅ Implement authentication in your React app (see AUTH0_TUTORIAL.md)
5. ✅ Test locally with `npm start`
6. ✅ Deploy to GitHub Pages and test production flow

## Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/quickstart/spa/react)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Auth0 Community Forum](https://community.auth0.com/)
