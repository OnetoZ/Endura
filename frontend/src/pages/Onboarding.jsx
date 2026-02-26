import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { authService } from '../services/api';

const Onboarding = () => {
    const { currentUser, loginWithToken } = useStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: currentUser?.username || '',
        phone: currentUser?.phone || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.username || !formData.phone) {
            setError('BOTH FIELDS ARE REQUIRED.');
            setIsLoading(false);
            return;
        }

        try {
            const updatedProfile = await authService.updateProfile({
                username: formData.username,
                phone: formData.phone,
            });
            loginWithToken(updatedProfile); // Re-sync local context
            navigate('/home');
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'FAILED TO UPDATE PROFILE');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden pt-20 bg-black">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/20 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/10 blur-[150px] rounded-full"></div>

            <div className="w-full max-w-xl relative">
                <div className="glass p-12 border-white/5 relative group">
                    <div className="absolute top-4 left-4 text-[8px] font-mono text-gray-600 tracking-widest uppercase">
                        Secure_Node // SYSTEM_ONBOARDING
                    </div>

                    <div className="text-center mb-10 reveal active">
                        <h2 className="text-4xl font-oswald font-bold uppercase tracking-tight mb-2 text-white">
                            Complete Profile
                        </h2>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">
                            SYNCHRONIZE REMAINING IDENTITY PARAMETERS
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">User Name</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-primary text-white outline-none transition-all text-sm tracking-widest"
                                placeholder="GHOST_UNIT_01"
                            />
                        </div>
                        <div>
                            <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Mobile Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-white/5 border border-white/10 px-6 py-4 focus:border-primary text-white outline-none transition-all text-sm tracking-widest"
                                placeholder="+91 XXXXXXXXXX"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : 'Complete Synchronization'}
                        </button>
                    </form>
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

export default Onboarding;
