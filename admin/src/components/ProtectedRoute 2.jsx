import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProtectedRoute = ({ children }) => {
    const { currentUser } = useStore();

    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;
