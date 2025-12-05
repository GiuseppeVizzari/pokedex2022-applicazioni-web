import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * User profile component that displays authenticated user information
 * Shows user avatar, name, and email
 */
const UserProfile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    // Show loading state
    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Loading...</span>
            </div>
        );
    }

    // Don't show if not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 10px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }}>
            {user.picture && (
                <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    style={{
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>
                    {user.name || user.email}
                </span>
                {user.name && user.email && (
                    <span style={{ fontSize: '12px', color: '#666' }}>
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
