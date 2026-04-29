import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser, isLoading } = useStore();

    if (isLoading) {
        // Return null or a loading spinner while we check if the user is logged in
        return null; 
    }

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
