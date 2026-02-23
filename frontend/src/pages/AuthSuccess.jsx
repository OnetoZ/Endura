import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { authService } from '../services/api';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useStore();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Store token temporarily to fetch profile
            localStorage.setItem('userInfo', JSON.stringify({ token }));

            authService.getProfile()
                .then(userData => {
                    loginWithToken(userData);
                    navigate('/home');
                })
                .catch(err => {
                    console.error('OAuth profile sync failed:', err);
                    localStorage.removeItem('userInfo');
                    navigate('/auth?error=sync_failed');
                });
        } else {
            navigate('/auth?error=no_token');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-oswald font-bold uppercase tracking-widest text-white">
                    Synchronizing Identity...
                </h2>
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2">
                    Establishing secure uplink Node
                </p>
            </div>
        </div>
    );
};

export default AuthSuccess;
