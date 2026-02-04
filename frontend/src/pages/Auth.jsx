
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Auth = () => {
    const [authType, setAuthType] = useState('user'); // 'user' or 'admin'
    const [step, setStep] = useState(1);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
        otp: ''
    });
    const [error, setError] = useState('');
    const { login } = useStore();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();
        // Simulation of user login/signup
        login(formData.email, 'user');
        navigate('/');
    };

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (formData.email === 'admin@endura.com' && formData.password === 'admin123') {
                setStep(2);
            } else {
                setError('ACCESS_DENIED: Invalid Credentials');
            }
        } else if (step === 2) {
            if (formData.phone.length >= 10) {
                setStep(3);
                // Simulate sending OTP
                console.log('OTP Sent to', formData.phone);
            } else {
                setError('PROTOCOL_ERROR: Invalid Phone Sequence');
            }
        } else if (step === 3) {
            if (formData.otp === '1234') {
                login(formData.email, 'admin');
                navigate('/admin');
            } else {
                setError('SYNC_FAILED: Invalid OTP');
            }
        }
    };

    const SocialButton = ({ icon, label, provider }) => (
        <button
            type="button"
            className="w-full py-4 border border-white/10 glass flex items-center justify-center gap-4 hover:bg-white/5 transition-all mb-4 group"
            onClick={() => {
                login(`${provider}_demo@endura.com`, 'user', `${label} User`);
                navigate('/');
            }}
        >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                Link with {label}
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
                        Operator_Login
                    </button>
                    <button
                        onClick={() => { setAuthType('admin'); setStep(1); }}
                        className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${authType === 'admin' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-white'}`}
                    >
                        Protocol_Access
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
                                <div>
                                    <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Operator ID (Email)</label>
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
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-primary outline-none transition-all text-sm tracking-widest"
                                        placeholder="••••••••"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit" className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all shadow-lg shadow-primary/20">
                                    {isLogin ? 'Synchronize' : 'Initialize Profile'}
                                </button>
                            </form>

                            <div className="mt-8 flex items-center justify-between">
                                <span className="h-px bg-white/10 flex-grow"></span>
                                <span className="px-6 text-[8px] text-gray-600 font-bold uppercase tracking-widest">or link node</span>
                                <span className="h-px bg-white/10 flex-grow"></span>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <SocialButton label="Google" provider="google" />
                                <SocialButton label="Apple" provider="apple" />
                            </div>

                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="w-full mt-6 text-[10px] text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest"
                            >
                                {isLogin ? 'Wait, I need a new node' : 'Back to synchronization'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleAdminSubmit} className="space-y-6">
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-accent mb-2">Master Card ID</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            className="w-full bg-white/5 border border-accent/20 px-6 py-4 focus:border-accent outline-none transition-all text-sm tracking-widest"
                                            placeholder="ADMIN@ENDURA.NET"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-accent mb-2">Passphrase</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            className="w-full bg-white/5 border border-accent/20 px-6 py-4 focus:border-accent outline-none transition-all text-sm tracking-widest"
                                            placeholder="••••••••"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all">
                                        Verify Clearance
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-accent mb-2">Synchronized Device Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="w-full bg-white/5 border border-accent/20 px-6 py-4 focus:border-accent outline-none transition-all text-sm tracking-widest"
                                            placeholder="+XX XXXXX-XXXX"
                                            onChange={handleInputChange}
                                        />
                                        <p className="mt-4 text-[8px] text-gray-500 uppercase tracking-widest text-center">Protocol will send a sync pulse to this device.</p>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all">
                                        Send Pulse
                                    </button>
                                    <button onClick={() => setStep(1)} type="button" className="w-full text-[8px] text-gray-600 hover:text-white uppercase tracking-widest font-bold">Cancel Encryption</button>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <div>
                                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-accent mb-2">Input Pulse Code</label>
                                        <input
                                            type="text"
                                            name="otp"
                                            required
                                            maxLength={4}
                                            className="w-full bg-white/5 border border-accent/20 px-6 py-4 focus:border-accent outline-none transition-all text-center text-4xl tracking-[1em] font-oswald"
                                            placeholder="0000"
                                            onChange={handleInputChange}
                                        />
                                        <p className="mt-4 text-[8px] text-gray-500 uppercase tracking-widest text-center">Sync code: 1234 (Demo Mode)</p>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-accent text-black font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all">
                                        Finalize Uplink
                                    </button>
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
