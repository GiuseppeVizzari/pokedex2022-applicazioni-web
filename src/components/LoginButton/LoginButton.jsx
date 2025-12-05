import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'reactstrap';

/**
 * Login button component that triggers Auth0 authentication
 * Automatically hides when user is already authenticated
 */
const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    // Don't show if already logged in
    if (isAuthenticated) {
        return null;
    }

    // Show loading state
    if (isLoading) {
        return (
            <Button color="primary" disabled>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
            </Button>
        );
    }

    return (
        <Button
            color="primary"
            onClick={() => loginWithRedirect()}
            className="ms-2"
        >
            Log In
        </Button>
    );
};

export default LoginButton;
