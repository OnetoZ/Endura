import React from 'react';
import { motion } from 'framer-motion';

const VaultHero = () => {
  return (
    <section className="relative w-full h-[65vh] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Immersive Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Deep Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black opacity-60" />

        {/* Soft Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />

        {/* Faint Vault Door Silhouette */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M100 0 L100 200 M0 100 L200 100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <path d="M30 30 L170 170 M30 170 L170 30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>

        {/* Animated Light Streaks */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"
          />
          <motion.div
            animate={{
              x: ['100%', '-100%'],
              opacity: [0, 0.2, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"
          />
        </div>
      </div>

      {/* Cinematic Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-8xl font-heading font-black tracking-[0.2em] uppercase mb-4 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/80 to-white/30 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Your Digital Vault
            </span>
            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center"
        >
          <p className="text-lg md:text-xl font-body text-white/50 tracking-[0.3em] uppercase flex items-center gap-3 md:gap-6">
            Secure <span className="text-accent text-xs">●</span>
            Private <span className="text-accent text-xs">●</span>
            Owned by You
          </p>
        </motion.div>
      </div>

      {/* Bottom Ambient Glow Transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};

export default VaultHero;
