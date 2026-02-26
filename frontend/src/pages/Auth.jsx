
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
    const [authType, setAuthType] = useState('user');
    const [step, setStep] = useState(1);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [tempToken, setTempToken] = useState('');        // holds JWT from Google callback
    const [timeLeft, setTimeLeft] = useState(0);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', phone: '', otp: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    // On mount: detect redirect back from Google OAuth with admin 2FA params
    useEffect(() => {
        const admin2fa = searchParams.get('admin2fa');
        const token = searchParams.get('tempToken');
        const email = searchParams.get('email');
        const errorCode = searchParams.get('error');
        const expected = searchParams.get('expected');

        if (admin2fa === '1' && token && email) {
            // Google OAuth succeeded — show 2FA input
            setAuthType('admin');
            setStep(2);
            setTempToken(token);
            setFormData(prev => ({ ...prev, email }));
            setTimeLeft(600); // 10 min (matches tempToken expiry)
            startTimer(600);
        } else if (errorCode === 'EMAIL_MISMATCH') {
            // Wrong Google account was selected
            setAuthType('admin');
            setStep(1);
            const hint = expected ? decodeURIComponent(expected) : 'your admin email';
            setError(`WRONG_ACCOUNT: Please sign in with ${hint}`);
            window.history.replaceState({}, '', '/auth');
        } else if (errorCode === 'NOT_ADMIN') {
            setAuthType('admin');
            setStep(1);
            setError('ACCESS_DENIED: That Google account does not have admin privileges');
            window.history.replaceState({}, '', '/auth');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (!formData.username) throw new Error('Username is required for initialization');
                await register(formData.username, formData.email, formData.password, formData.phone);
            }
            navigate('/home');
        } catch (err) {
            setError(err.toString().toUpperCase());
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (step === 1) {
            // Step 1: verify the email is an admin, then hand off to Google OAuth
            try {
                const response = await fetch(`${API}/auth/admin-check`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email })
                });
                const data = await response.json();

                if (response.ok && data.verified) {
                    // Redirect to Google OAuth — login_hint skips the account picker
                    const hint = encodeURIComponent(formData.email);
                    window.location.href = `http://localhost:5001/api/auth/google?login_hint=${hint}`;
                } else {
                    setError(data.message || 'ACCESS_DENIED: You are not an admin');
                    setIsLoading(false);
                }
            } catch (err) {
                setError('LOGIN_ERROR: ' + err.message);
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

    // Timer for 2FA code expiry
    const startTimer = (seconds = 120) => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setError('CODE_EXPIRED: Please resend the code');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
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

    const SocialButton = ({ label, provider, color }) => (
        <button
            type="button"
            className="w-full py-4 border border-white/10 glass flex items-center justify-center gap-4 hover:bg-white/5 transition-all mb-4 group"
            onClick={() => {
                window.location.href = `http://localhost:5001/api/auth/google`;
            }}
        >
            {provider === 'google' && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            )}
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                Initialize with {label}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden pt-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/20 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/10 blur-[150px] rounded-full"></div>

            <div className="w-full max-w-xl relative">
                <div className="flex mb-12 border-b border-white/10">
                    <button
                        onClick={() => { setAuthType('user'); setStep(1); }}
                        className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${authType === 'user' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        Endura_User_Login
                    </button>
                    <button
                        onClick={() => { setAuthType('admin'); setStep(1); }}
                        className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${authType === 'admin' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-white'}`}
                    >
                        Endura_Admin_Login
                    </button>
                </div>

                <div className="glass p-12 border-white/5 relative group">
                    <div className="absolute top-4 left-4 text-[8px] font-mono text-gray-600 tracking-widest uppercase">
                        Secure_Node // {authType.toUpperCase()}_AUTH
                    </div>

                    <div className="text-center mb-10 reveal active">
                        <h2 className="text-4xl font-oswald font-bold uppercase tracking-tight mb-2">
                            {authType === 'user' ? (isLogin ? 'Initiate Profile' : 'Create Operator') : 'Level 4 Clearance'}
                        </h2>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            {authType === 'user' ? 'Synchronize your identity' : 'Restricted to system masters'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    {authType === 'user' ? (
                        <div>
                            <form onSubmit={handleUserSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">User Name</label>
                                        <input
                                            type="text"
                                            name="username"
                                            required
                                            className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-primary outline-none transition-all text-sm tracking-widest"
                                            placeholder="GHOST_UNIT_01"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                                {!isLogin && (
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-primary outline-none transition-all text-sm tracking-widest"
                                            placeholder="+91 XXXXXXXXXX"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">User ID (Email)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-primary outline-none transition-all text-sm tracking-widest"
                                        placeholder="SYNC_MAIL@ENDURA.IO"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Security Key</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            className="w-full bg-white/5 border border-white/10 px-6 py-4 pr-12 focus:border-primary outline-none transition-all text-sm tracking-widest"
                                            placeholder="••••••••"
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Processing...' : (isLogin ? 'Synchronize' : 'Initialize Profile')}
                                </button>
                            </form>

                            <div className="mt-8 flex items-center justify-between">
                                <span className="h-px bg-white/10 flex-grow"></span>
                                <span className="px-6 text-[8px] text-gray-600 font-bold uppercase tracking-widest">or </span>
                                <span className="h-px bg-white/10 flex-grow"></span>
                            </div>

                            <div className="mt-8">
                                <SocialButton label="Google" provider="google" />
                            </div>

                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="w-full mt-6 text-[10px] text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest"
                            >
                                {isLogin ? 'Create New Account' : 'Back to Login'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleAdminSubmit} className="space-y-6">
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="block text-8px font-black uppercase tracking-wide-3em text-accent mb-2">Admin Email ID</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full bg-white-5 border border-accent-20 px-6 py-4 focus-border-accent outline-none transition-all text-sm tracking-widest"
                                            placeholder="Enter Admin Email"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all">
                                        Verify Admin Access
                                    </button>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div className="text-center mb-6">
                                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-2">2FA Verification Required</p>
                                        <p className="text-[8px] text-gray-400">A 6-digit code has been sent to your email</p>
                                        {timeLeft > 0 && (
                                            <div className="mt-4">
                                                <p className="text-[12px] text-white font-mono">
                                                    Code expires in: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                                </p>
                                                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                                    <div
                                                        className="bg-accent h-2 rounded-full transition-all duration-1000"
                                                        style={{ width: `${(timeLeft / 600) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        {timeLeft === 0 && (
                                            <p className="text-[10px] text-red-400 mt-4">Code expired. Please try again.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-accent mb-2">2FA Code</label>
                                        <input
                                            type="text"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value)}
                                            maxLength={6}
                                            className="w-full bg-white/5 border border-accent/20 px-6 py-4 focus:border-accent outline-none transition-all text-center text-2xl tracking-[1em] font-mono"
                                            placeholder="000000"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || timeLeft === 0}
                                        className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify & Login with Google'}
                                    </button>
                                    <div className="mt-4 flex flex-col items-center gap-3">
                                        {/* Resend Code */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={handleResendCode}
                                                disabled={resendCooldown > 0 || isLoading}
                                                className={`text-[9px] font-black uppercase tracking-widest transition-all border px-4 py-2 ${resendCooldown > 0 || isLoading
                                                    ? 'border-white/10 text-gray-600 cursor-not-allowed'
                                                    : 'border-accent/40 text-accent hover:bg-accent/10'
                                                    }`}
                                            >
                                                {resendCooldown > 0
                                                    ? `Resend in ${resendCooldown}s`
                                                    : isLoading ? 'Sending...' : '↺ Resend Code'}
                                            </button>
                                            {resendSuccess && (
                                                <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest animate-pulse">
                                                    ✓ Sent!
                                                </span>
                                            )}
                                        </div>
                                        {/* Back to Login */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep(1);
                                                setTempToken('');
                                                setTimeLeft(0);
                                                setResendCooldown(0);
                                                setResendSuccess(false);
                                                window.history.replaceState({}, '', '/auth');
                                            }}
                                            className="text-[8px] text-gray-500 hover:text-accent transition-colors uppercase tracking-widest"
                                        >
                                            Back to Login
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    )}
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
