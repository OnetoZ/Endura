import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Activity, Database } from 'lucide-react';

const RecentHistory = ({ history }) => {
    return (
        <div className="max-w-4xl mx-auto px-6 pb-24 mt-20">
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                        <Activity className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-black uppercase tracking-[0.3em] text-white/90">
                            NEURAL LINK LOGS
                        </h2>
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">REAL-TIME ACCESS HISTORY</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-[10px] font-mono text-white/30 tracking-tight">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
                        <span>DB_SYNC: OK</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        <span>STORAGE: 98.4TB</span>
                    </div>
                </div>
            </div>

            <div className="relative border-l border-white/5 ml-3 space-y-6">
                <AnimatePresence mode='popLayout'>
                    {history.length === 0 ? (
                        <div className="pl-10 py-10">
                            <p className="text-xs font-mono text-white/10 uppercase tracking-[0.2em] italic">No neural links established. Start decryption to populate log files.</p>
                        </div>
                    ) : (
                        history.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-10 group"
                            >
                                {/* Timeline Node */}
                                <div className="absolute -left-[5px] top-6 w-[10px] h-[10px] rounded-full bg-black border border-white/20 group-hover:border-accent transition-all duration-300">
                                    <div className="absolute inset-[2px] rounded-full bg-white/10 group-hover:bg-accent animate-pulse" />
                                </div>

                                <div className="flex items-center gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 overflow-hidden relative">
                                    {/* Scan Line Detail */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/[0.02] to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-lg">
                                        <img
                                            src={entry.image}
                                            alt={entry.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-3 mb-1">
                                            <h4 className="font-heading font-black text-sm text-white/80 group-hover:text-white transition-colors tracking-widest uppercase truncate">
                                                {entry.name}
                                            </h4>
                                            <div className="h-[1px] flex-1 bg-white/5 hidden md:block" />
                                            <span className="text-[10px] font-mono text-accent drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">DECRYPT_SUCCESS</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-[9px] font-mono text-white/20 tracking-tighter uppercase truncate">STAMP // {entry.date}</p>
                                            <span className="text-[8px] font-mono text-white/10 group-hover:text-white/30 transition-colors">HASH: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecentHistory;
