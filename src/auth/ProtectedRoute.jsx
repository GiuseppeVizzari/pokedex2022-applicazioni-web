import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

/**
 * Component to protect routes that require authentication
 * Usage: <Route path="/protected" element={<ProtectedRoute component={YourComponent} />} />
 */
const ProtectedRoute = ({ component: Component }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                fontSize: '18px',
                color: '#666'
            }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ marginTop: '20px' }}>Checking authentication...</p>
            </div>
        );
    }

    // Redirect to home if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Render the protected component
    return <Component />;
};

export default ProtectedRoute;
