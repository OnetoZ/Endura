
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const DigitalVault = () => {
    const { vaultItems, unlockVaultItem } = useStore();
    const [selectedItem, setSelectedItem] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const [inputError, setInputError] = useState(false);
    const [unlocking, setUnlocking] = useState(false);

    const handleUnlock = (e) => {
        e.preventDefault();
        setUnlocking(true);
        setTimeout(() => {
            const success = unlockVaultItem(selectedItem.id, accessCode);
            if (success) {
                setSelectedItem(null);
                setAccessCode('');
                setInputError(false);
            } else {
                setInputError(true);
            }
            setUnlocking(false);
        }, 1500); // Cinematic delay
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10"></div>

            <div className="container mx-auto">
                <div className="text-center mb-20 reveal active">
                    <h1 className="text-5xl md:text-8xl font-oswald font-bold uppercase tracking-tighter mb-4">
                        The <span className="text-blue-500 text-shadow-glow">Vault</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.5em] animate-pulse">
                        Secure Storage // Encrypted Assets
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {vaultItems.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`relative group border ${item.locked ? 'border-white/5 bg-white/[0.02]' : 'border-blue-500/30 bg-blue-500/5'} transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
                            onClick={() => item.locked && setSelectedItem(item)}
                        >
                            {/* Status Indicator */}
                            <div className="absolute top-4 right-4 z-20">
                                {item.locked ? (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-black/50 border border-red-500/30 backdrop-blur-md">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">LOCKED</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-black/50 border border-blue-500/30 backdrop-blur-md">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">UNLOCKED</span>
                                    </div>
                                )}
                            </div>

                            {/* Image with Lock Overlay */}
                            <div className="aspect-[3/4] overflow-hidden relative">
                                <img
                                    src={item.image}
                                    className={`w-full h-full object-cover transition-all duration-700 ${item.locked ? 'grayscale blur-sm opacity-50' : 'grayscale-0 opacity-100'}`}
                                    alt={item.name}
                                />
                                {item.locked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-white/20 group-hover:text-white/40 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 11c0 .551-.449 1-1 1H7c-.551 0-1-.449-1-1v-8c0-.551.449-1 1-1h10c.551 0 1 .449 1 1v8z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className={`text-2xl font-oswald font-bold uppercase mb-2 ${item.locked ? 'text-gray-600' : 'text-white'}`}>
                                    {item.name}
                                </h3>
                                <p className="text-[10px] font-mono text-gray-500 uppercase">
                                    {item.locked ? 'Requires Access Code' : 'Asset Available for Download'}
                                </p>
                                {!item.locked && (
                                    <button className="mt-6 w-full py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                                        Download Asset Package
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Unlock Modal */}
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                        <div className="relative w-full max-w-md glass border-white/10 p-10 animate-in fade-in zoom-in duration-300">
                            <button
                                onClick={() => { setSelectedItem(null); setInputError(false); setAccessCode(''); }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-oswald font-bold uppercase mb-2 text-white">Security Check</h3>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">Enter Access Code to Unlock</p>
                                <p className="text-blue-500 text-[10px] font-mono mt-2">{selectedItem.name}</p>
                            </div>

                            <form onSubmit={handleUnlock} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        value={accessCode}
                                        onChange={(e) => { setAccessCode(e.target.value); setInputError(false); }}
                                        className={`w-full bg-black/50 border ${inputError ? 'border-red-500 text-red-500' : 'border-white/20 text-white focus:border-blue-500'} px-6 py-4 outline-none text-center text-xl tracking-[0.5em] font-mono transition-all`}
                                        placeholder="CODE"
                                        autoFocus
                                    />
                                    {inputError && (
                                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-3 animate-pulse">
                                            Access Denied: Invalid Code
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={unlocking}
                                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {unlocking ? 'Decrypting...' : 'Authenticate'}
                                </button>
                                <p className="text-[8px] text-gray-600 text-center uppercase tracking-widest mt-4">
                                    Hint: Try code "ENDURA2026"
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalVault;
