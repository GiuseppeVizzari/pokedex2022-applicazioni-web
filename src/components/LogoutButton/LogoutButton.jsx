import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'reactstrap';

/**
 * Logout button component that triggers Auth0 logout
 * Automatically hides when user is not authenticated
 */
const LogoutButton = () => {
    const { logout, isAuthenticated, isLoading } = useAuth0();

    // Don't show if not logged in
    if (!isAuthenticated) {
        return null;
    }

    // Show loading state
    if (isLoading) {
        return (
            <Button color="secondary" disabled>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
            </Button>
        );
    }

    const handleLogout = () => {
        // Redirect back to the current page after logout
        logout({
            logoutParams: {
                returnTo: window.location.origin + window.location.pathname
            }
        });
    };

    return (
        <Button
            color="secondary"
            onClick={handleLogout}
            className="ms-2"
        >
            Log Out
        </Button>
    );
};

export default LogoutButton;
