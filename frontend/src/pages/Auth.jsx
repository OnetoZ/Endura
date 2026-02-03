
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useStore();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would be a real API call
        const role = email.includes('admin') ? 'admin' : 'user';
        login(email, role);
        navigate('/');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="glass p-12 w-full max-w-md">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-oswald font-bold uppercase mb-2">
                        {isLogin ? 'Command Center Access' : 'Create Operator Profile'}
                    </h2>
                    <p className="text-gray-500 text-sm">Synchronize your identity with Endura Network.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Operator ID (Email)</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 px-4 py-4 focus:border-blue-500 outline-none transition"
                            placeholder="operator@endura.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Security Key (Password)</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 px-4 py-4 focus:border-blue-500 outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition"
                    >
                        {isLogin ? 'Initiate Login' : 'Register Operator'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs">
                    <p className="text-gray-500 mb-2">
                        {isLogin ? "Don't have an ID?" : "Already registered?"}
                    </p>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline font-bold uppercase tracking-widest"
                    >
                        {isLogin ? 'Create Profile' : 'Access System'}
                    </button>
                </div>

                {isLogin && (
                    <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded text-[10px] text-gray-500">
                        <p className="font-bold uppercase mb-1">Demo Hint:</p>
                        <p>Use "admin@endura.com" to access admin dashboard.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
