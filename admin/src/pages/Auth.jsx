
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/api';

const Auth = () => {
    const [authType, setAuthType] = useState('admin');
    const [step, setStep] = useState(1);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', phone: '', otp: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register, loginWithToken } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    if (!API) {
        console.error('❌ CRITICAL: VITE_API_URL is NOT defined in your .env file or Vite needs a restart.');
    }
    console.log('📡 [ENDURA_AUTH_V3] Current API Endpoint:', API);

    // On mount: detect redirect back from Google OAuth with admin 2FA params
    useEffect(() => {
        // --- 1. POPUP COMMUNICATION ---
        const isPopup = window.opener && window.opener !== window;
        const search = window.location.search;
        const hasAuthParams = search.includes('admin2fa') ||
            search.includes('tempToken') ||
            search.includes('token') ||
            search.includes('error');

        if (isPopup && hasAuthParams) {
            console.log('📡 [POPUP] Auth detected. Sending to parent...');
            try {
                // We use '*' only for the handshake/initial signal in local dev
                // but window.location.origin is generally safer.
                window.opener.postMessage({
                    type: 'OAUTH_RESPONSE',
                    search: search
                }, '*');

                console.log('✅ [POPUP] Message sent to parent. Closing in 800ms...');
                setTimeout(() => window.close(), 800);
            } catch (err) {
                console.error('❌ [POPUP] Failed to communicate with parent:', err);
                // Redirect as fallback if popup communication fails
                window.location.href = `/auth${search}`;
            }
            return;
        }

        // Parent window listener
        const handleOAuthMessage = (e) => {
            // In local dev, origins can be tricky (localhost vs 127.0.0.1)
            // We'll trust the message if it has our custom type
            if (e.data?.type === 'OAUTH_RESPONSE') {
                console.log('📩 [PARENT] Received OAuth response from popup:', e.data.search);
                const params = new URLSearchParams(e.data.search);
                processOAuthParams(params);
            } else if (e.data?.type === 'AUTH_FINAL_SUCCESS') {
                console.log('📩 [PARENT] Received final success signal');
                loginWithToken(e.data.userData);
                toast.dismiss('auth_wait');
                toast.success('IDENTITY_SYNCHRONIZED');
                if (e.data.userData.role === 'admin') navigate('/admin');
                else if (!e.data.userData.phone) navigate('/onboarding');
                else navigate('/home');
            } else if (e.data?.type === 'AUTH_FINAL_ERROR') {
                console.log('📩 [PARENT] Received final error signal');
                setError(`AUTH_FAILED: ${e.data.error.toUpperCase()}`);
                toast.dismiss('auth_wait');
                toast.error('AUTHENTICATION_FAILED');
            }
        };

        const processOAuthParams = (params) => {
            const admin2fa = params.get('admin2fa');
            const token = params.get('tempToken'); // Admin flow uses tempToken
            const email = params.get('email');
            const errorCode = params.get('error') || params.get('errorCode');
            const socialToken = params.get('token'); // Regular social login

            console.log('📡 [PARENT] Processing OAuth Params:', { admin2fa, hasToken: !!token, email, errorCode });

            if (errorCode) {
                const hint = params.get('expected');
                if (errorCode === 'EMAIL_MISMATCH' && hint) {
                    setError(`WRONG ACCOUNT: PLEASE USE ${hint.toUpperCase()}`);
                } else if (errorCode === 'NOT_ADMIN') {
                    setError('ACCESS_DENIED: UNAUTHORIZED ACCOUNT');
                } else {
                    setError(`AUTH_ERROR: ${errorCode.replace(/_/g, ' ')}`);
                }
                toast.dismiss('auth_wait');
                return;
            }

            if (admin2fa === '1' && token && email) {
                console.log('✅ [PARENT] Admin verified via Google, switching to 2FA...');
                toast.dismiss('auth_wait');
                setAuthType('admin');
                setStep(2);
                setTempToken(token);
                setFormData(prev => ({ ...prev, email }));

                // Use a larger timer for 2FA expiry
                setTimeLeft(600);
                startTimer(600);

                toast.success('ACCESS_CLEARED: ENTER 2FA CODE');

                // Cleanup URL in parent
                window.history.replaceState({}, '', '/auth');
            } else if (socialToken) {
                console.log('✅ [PARENT] Social login success, redirecting to sync...');
                toast.dismiss('auth_wait');
                localStorage.setItem('userInfo', JSON.stringify({ token: socialToken }));
                authService.getProfile()
                    .then(userData => {
                        const fullData = { ...userData, token: socialToken };
                        localStorage.setItem('userInfo', JSON.stringify(fullData));
                        loginWithToken(fullData);
                        toast.success('Admin Verified.');
                        navigate('/admin', { replace: true });
                    })
                    .catch(err => {
                        console.error('Profile fetch failed:', err);
                        setError('Verification failed');
                        window.history.replaceState({}, '', '/auth');
                    });
            }
        };

        window.addEventListener('message', handleOAuthMessage);

        // --- 2. LEGACY REDIRECT HANDLING (Fallback) ---
        // This block handles cases where the OAuth provider redirects directly to /auth
        // instead of closing the popup and messaging the parent.
        // This can happen if the popup was blocked or if the user navigated directly.
        const admin2fa = searchParams.get('admin2fa');
        const token = searchParams.get('tempToken');
        const email = searchParams.get('email');
        const errorCode = searchParams.get('error');
        const expected = searchParams.get('expected');
        const socialToken = searchParams.get('token'); // For regular social login

        if (errorCode) {
            console.log('🚨 [INIT] Error code detected in URL:', errorCode);
            const hint = expected ? decodeURIComponent(expected) : 'your admin email';
            if (errorCode === 'EMAIL_MISMATCH') {
                setError(`WRONG_ACCOUNT: Please sign in with ${hint}`);
            } else if (errorCode === 'NOT_ADMIN') {
                setAuthType('admin');
                setStep(1);
                setError('ACCESS_DENIED: That Google account does not have admin privileges');
            } else if (errorCode === 'oauth_failed') {
                setError('OAUTH_ERROR: Google authentication failed. Please try again.');
            } else {
                setError(`AUTH_ERROR: ${errorCode.replace(/_/g, ' ')}`);
            }
            window.history.replaceState({}, '', '/auth');
        } else if (admin2fa === '1' && token && email) {
            console.log('✅ [INIT] Admin auth params detected in URL, processing...');
            processOAuthParams(searchParams);
        } else if (socialToken) {
            console.log('✅ [INIT] Social token detected in URL, processing...');
            // Store temporarily so the auth service can use it
            localStorage.setItem('userInfo', JSON.stringify({ token: socialToken }));

            authService.getProfile()
                .then(userData => {
                    const fullData = { ...userData, token: socialToken };
                    localStorage.setItem('userInfo', JSON.stringify(fullData));
                    loginWithToken(fullData);
                    toast.success('Admin Verified.');
                    navigate('/admin', { replace: true });
                })
                .catch(err => {
                    console.error('Profile fetch failed:', err);
                    setError('Verification failed. Please try again.');
                    window.history.replaceState({}, '', '/auth');
                });
        }

        return () => window.removeEventListener('message', handleOAuthMessage);
    }, [searchParams]);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };


    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (step === 1) {
            setIsLoading(true);
            try {
                const response = await fetch(`${API}/auth/admin-check`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email })
                });
                const data = await response.json();

                if (response.ok && data.verified) {
                    const hint = encodeURIComponent(formData.email);
                    const origin = encodeURIComponent(window.location.origin);
                    const authUrl = `${API}/auth/google?login_hint=${hint}&source=admin&origin=${origin}`;

                    // Open Google OAuth in the same window
                    window.location.href = authUrl;
                } else {
                    setError('ACCESS_DENIED: ' + (data.message || 'Verification failed'));
                    toast.error('ACCESS DENIED');
                }
            } catch (err) {
                setError('NETWORK_ERROR: ' + err.message);
                toast.error('COULD NOT CONNECT TO UPLINK');
            } finally {
                setIsLoading(false);
            }
        } else if (step === 2) {
            // Step 2: verify 2FA code using the tempToken from Google callback
            try {
                const response = await fetch(`${API}/auth/admin-verify-2fa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tempToken, twoFactorCode })
                });
                const data = await response.json();

                if (response.ok && data.token) {
                    // Store session (same format as normal login)
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    loginWithToken(data);

                    toast.success('Admin Verified. System Synchronized.');
                    navigate('/admin');
                } else {
                    setError('INVALID_CODE: ' + (data.message || 'Verification failed'));
                    setIsLoading(false);
                }
            } catch (err) {
                setError('2FA_ERROR: ' + err.message);
                setIsLoading(false);
            }
        }
    };

    // Resend 2FA code using the tempToken (new flow)
    const handleResendCode = async () => {
        if (resendCooldown > 0 || !tempToken) return;
        setError('');
        setResendSuccess(false);
        setIsLoading(true);
        try {
            const response = await fetch(`${API}/auth/admin-resend-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempToken })
            });
            const data = await response.json();
            if (response.ok) {
                setTempToken(data.tempToken); // fresh token resets the 10-min window
                setTwoFactorCode('');
                setTimeLeft(600);
                startTimer(600);
                setResendSuccess(true);
                setResendCooldown(60);
                const cooldown = setInterval(() => {
                    setResendCooldown((prev) => {
                        if (prev <= 1) { clearInterval(cooldown); return 0; }
                        return prev - 1;
                    });
                }, 1000);
                setTimeout(() => setResendSuccess(false), 3000);
            } else {
                setError(data.message || 'Failed to resend code');
            }
        } catch (err) {
            setError('RESEND_ERROR: ' + err.message);
        }
        setIsLoading(false);
    };

    const SocialButton = ({ label, provider }) => {
        const handleSocialClick = (e) => {
            e.preventDefault();
            const origin = encodeURIComponent(window.location.origin);
            const authUrl = `${API}/auth/${provider}?source=admin&origin=${origin}`;
            window.location.href = authUrl;
        };

        return (
            <button
                type="button"
                onClick={handleSocialClick}
                className="w-full py-4 md:py-5 flex items-center justify-center gap-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {provider === 'google' ? (
                    <div className="p-2 bg-white rounded-sm flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-5 h-5 rounded-full bg-white/20" />
                )}
                <span className="relative z-10 text-[10px] font-black tracking-[0.3em] uppercase text-white group-hover:text-primary transition-colors">
                    Continue_with_{label}
                </span>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/20" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/20" />
            </button>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden pt-32">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/20 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/10 blur-[150px] rounded-full"></div>

            <div className="w-full max-w-xl relative">

                <div className="glass p-12 border-white/5 relative group">
                    <div className="absolute top-6 left-6 text-[8px] font-mono text-primary/60 tracking-widest uppercase">
                        Secure_Node // ENDURA_ADMIN_PORTAL
                    </div>

                    <div className="text-center mb-10 mt-2 reveal active">
                        <h2 className="text-4xl font-orbitron font-bold uppercase tracking-tight mb-2 text-gold">
                            Admin Login
                        </h2>
                        <p className="text-primary/50 text-[10px] uppercase tracking-[0.3em]">
                            Authorized Personnel Only
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="mt-2">
                        <form onSubmit={handleAdminSubmit} className="space-y-6">
                            <div className="relative group/input">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="ADMIN_IDENTIFIER"
                                    required
                                    className="w-full bg-white/5 border border-white/10 p-4 font-mono text-[10px] tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-700"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                                    <span className="text-[8px] font-mono text-white">ID_REQ</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-black font-black text-[10px] tracking-[0.3em] uppercase hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Initiate_Session'}
                            </button>
                            <p className="text-[8px] text-gray-600 font-mono uppercase tracking-[0.2em] text-center mt-6">
                                // Unauthorized access is strictly logged_
                            </p>
                        </form>
                    </div>
                </div>

                <div className="mt-12 p-6 glass border-primary/20 flex items-center justify-between group cursor-default overflow-hidden">
                    <div className="absolute inset-0 shimmer opacity-50 -z-10"></div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Security_Status</p>
                        <p className="text-[10px] text-white font-bold tracking-widest">RSA_2048 // ENCRYPTED_TUNNEL</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
