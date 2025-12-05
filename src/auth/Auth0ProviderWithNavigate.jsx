import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * Auth0Provider wrapper that works with HashRouter
 * For GitHub Pages deployment with nested base path
 */
export const Auth0ProviderWithNavigate = ({ children }) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

    // For HashRouter, Auth0 redirects to the base URL (without hash)
    // React Router will then handle the hash-based navigation
    const redirectUri = window.location.origin + window.location.pathname;

    // Show error if configuration is missing
    if (!domain || !clientId) {
        return (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                <h2>⚠️ Auth0 Configuration Error</h2>
                <p>Auth0 environment variables are missing. Please check your configuration:</p>
                <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
                    <li><strong>VITE_AUTH0_DOMAIN:</strong> {domain || '❌ MISSING'}</li>
                    <li><strong>VITE_AUTH0_CLIENT_ID:</strong> {clientId ? '✅ Set' : '❌ MISSING'}</li>
                </ul>
                <p>See <code>AUTH0_SETUP.md</code> for instructions on setting up Auth0.</p>
                <p>For local development, create a <code>.env</code> file in the project root.</p>
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
            useRefreshTokens={true}
            cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    );
};
