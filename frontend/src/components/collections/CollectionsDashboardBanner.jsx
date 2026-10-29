import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowDown, ChevronRight } from 'lucide-react';

const VIEWS = [
  {
    id: 'campaign',
    title: 'LOOKBOOK',
    subtitle: 'Ambassador Campaign • Chapter 01',
    src: '/collection-dashboard.jpeg',
    alt: 'Endura Genesis Collection Editorial Campaign'
  },
  {
    id: 'artifacts',
    title: 'LINEUP',
    subtitle: 'Twin Garments & Holographic Cards',
    src: '/tshiirt%20collection%20cover.jpeg',
    alt: 'Endura Genesis Trinity Artifacts & Digital Twins'
  }
];

const COLLECTIONS = [
  {
    id: 'icarus',
    number: '01',
    name: 'ICARUS ASCENSION',
    faction: 'THE CROWNLESS ERA',
    vessel: 'Kael Vestan',
    artifact: 'Crownless Shard',
    mantra: 'Nothing above. Nothing beneath.',
    tier: 'RARE TIER // GENESIS 01',
    colorHex: '#F59E0B',
    accentText: 'text-amber-400',
    gradientText: 'from-amber-200 via-amber-400 to-amber-500',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderHover: 'border-amber-500/50',
    bgActive: 'bg-amber-500/[0.12]',
    // Position on Artifacts (Left shirt/card)
    coords: {
      artifacts: { x: '21%', y: '52%' }
    }
  },
  {
    id: 'bull',
    number: '02',
    name: 'COSMIC BULL',
    faction: 'THE FORGED',
    vessel: 'Draven Osk',
    artifact: 'Celestial Core',
    mantra: 'Built through impact. Forged through pressure.',
    tier: 'RARE TIER // GENESIS 02',
    colorHex: '#2DD4BF',
    accentText: 'text-teal-300',
    gradientText: 'from-teal-100 via-teal-300 to-teal-500',
    glowColor: 'rgba(45, 212, 191, 0.45)',
    borderHover: 'border-teal-400/50',
    bgActive: 'bg-teal-500/[0.12]',
    // Position on Artifacts (Center shirt/card)
    coords: {
      artifacts: { x: '50%', y: '48%' }
    }
  },
  {
    id: 'liminal',
    number: '03',
    name: 'LIMINAL TOUCH',
    faction: 'THE HOLLOW',
    vessel: 'Lyra Voss',
    artifact: 'Silence Codex',
    mantra: 'Between everything. And nothing.',
    tier: 'RARE TIER // GENESIS 03',
    colorHex: '#818CF8',
    accentText: 'text-indigo-400',
    gradientText: 'from-indigo-200 via-indigo-400 to-purple-400',
    glowColor: 'rgba(129, 140, 248, 0.45)',
    borderHover: 'border-indigo-400/50',
    bgActive: 'bg-indigo-500/[0.12]',
    // Position on Artifacts (Right shirt/card)
    coords: {
      artifacts: { x: '79%', y: '52%' }
    }
  }
];

const CollectionsDashboardBanner = () => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [selectedCollectionId, setSelectedCollectionId] = useState('icarus');
  const [hoveredCollectionId, setHoveredCollectionId] = useState(null);
  const [isHoveredOverBanner, setIsHoveredOverBanner] = useState(false);

  const currentView = VIEWS[activeViewIndex];
  const isLookbook = currentView.id === 'campaign';
  const isLineup = currentView.id === 'artifacts';

  // Active collection for Lineup
  const currentActiveId = hoveredCollectionId || selectedCollectionId;
  const activeData = COLLECTIONS.find((c) => c.id === currentActiveId) || COLLECTIONS[0];

  // Subtle auto-rotation between the two dashboard images when user is idle
  useEffect(() => {
    if (isHoveredOverBanner || hoveredCollectionId) return;

    const timer = setInterval(() => {
      setActiveViewIndex((prev) => (prev + 1) % VIEWS.length);
    }, 12000);

    return () => clearInterval(timer);
  }, [isHoveredOverBanner, hoveredCollectionId]);

  const handleScrollToGrid = (targetId) => {
    const target = document.getElementById(targetId || 'products-archive');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsHoveredOverBanner(true)}
      onMouseLeave={() => {
        setIsHoveredOverBanner(false);
        setHoveredCollectionId(null);
      }}
    >
      {/* Outer Luxury Frame Container - Covers Horizontal Full Ratio */}
      <div className="relative w-full max-w-[1920px] mx-auto px-0 sm:px-3 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-none sm:rounded-2xl md:rounded-3xl overflow-hidden border-y sm:border border-white/10 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.9)] group"
        >
          {/* Main Panoramic Image Canvas */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[18/9] lg:aspect-[21/9] min-h-[480px] max-h-[820px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentView.id}
                src={currentView.src}
                alt={currentView.alt}
                fetchpriority="high"
                decoding="async"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover object-[center_36%] transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
              />
            </AnimatePresence>

            {/* Subtle Film Grain Noise Texture */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.035] pointer-events-none mix-blend-overlay" />

            {/* Cinematic Gradient Vignettes for Depth & Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/25 to-transparent pointer-events-none" />
            {/* Soft dark gradient on left to make Lookbook typography pop */}
            {isLookbook && (
              <div className="absolute inset-y-0 left-0 w-full sm:w-2/3 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

            {/* Interactive Atmospheric Spotlight Aura based on hovered collection (Lineup only) */}
            <AnimatePresence>
              {isLineup && activeData && (
                <motion.div
                  key={activeData.id + currentView.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 pointer-events-none mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle at ${
                      activeData.coords[currentView.id]?.x || '50%'
                    } ${
                      activeData.coords[currentView.id]?.y || '50%'
                    }, ${activeData.glowColor} 0%, transparent 60%)`
                  }}
                />
              )}
            </AnimatePresence>

            {/* Top HUD Bar: Protocol Badges & Dual Perspective Switcher */}
            <div className="absolute top-0 inset-x-0 p-4 sm:p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 z-30 pointer-events-auto">
              {/* Left Protocol Tag */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/90 font-medium drop-shadow-md">
                  ENDURA 
                </span>
                <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-gray-300">
                  GENESIS DROP
                </span>
              </div>

              {/* Right View Switcher Pill Tabs (Switch between LOOKBOOK and LINEUP) */}
              <div className="flex items-center p-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md shadow-2xl z-30">
                {VIEWS.map((view, idx) => {
                  const isActive = activeViewIndex === idx;
                  return (
                    <button
                      key={view.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveViewIndex(idx);
                      }}
                      className={`relative px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none ${
                        isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeViewTabPill"
                          className="absolute inset-0 rounded-full bg-white/20 border border-white/30 shadow-inner"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{view.title}</span>
                      <span className="relative z-10 text-[9px] opacity-60">0{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* VIEW 01: LOOKBOOK (Simple, Clean, Bold Big Editorial Text) */}
            {/* ======================================================== */}
            {isLookbook && (
              <motion.div
                key="lookbook-hero-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-y-0 left-0 flex flex-col justify-end sm:justify-center p-6 sm:p-10 md:p-12 lg:p-16 z-20 pointer-events-auto max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
              >
                <div
                  onClick={() => handleScrollToGrid('products-archive')}
                  className="group/lookbook cursor-pointer text-left transition-all duration-500 w-fit"
                >
                  {/* 1. GENESIS EDITION Tag */}
                  <div className="flex items-center gap-2.5 mb-2 sm:mb-3">
                    <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#d4af37] animate-pulse" />
                    <span className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.3em] text-accent font-semibold drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] transition-all duration-500 group-hover/lookbook:tracking-[0.4em]">
                      GENESIS EDITION
                    </span>
                  </div>

                  {/* 2. An Experience beyond Clothing Subtitle */}
                  <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-serif italic text-gray-200/95 tracking-wide mb-2 sm:mb-4 transition-colors duration-500 group-hover/lookbook:text-white">
                    An Experience beyond Clothing
                  </p>

                  {/* 3 & 4. Bold Big Monumental Brand & Collections Text with Theme Matching Hover Animation */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.6rem] xl:text-[5.2rem] font-black font-heading uppercase tracking-tight leading-[0.92] text-white whitespace-nowrap transition-all duration-700 ease-out group-hover/lookbook:text-transparent group-hover/lookbook:bg-clip-text group-hover/lookbook:bg-gradient-to-r group-hover/lookbook:from-[#FFF5DB] group-hover/lookbook:via-[#D4AF37] group-hover/lookbook:via-[#C084FC] group-hover/lookbook:to-[#F59E0B] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] group-hover/lookbook:drop-shadow-[0_0_45px_rgba(212,175,55,0.7)]">
                      ENDURA
                    </h1>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.4rem] font-black font-heading uppercase tracking-tight leading-[0.92] text-white/95 whitespace-nowrap transition-all duration-700 ease-out group-hover/lookbook:text-transparent group-hover/lookbook:bg-clip-text group-hover/lookbook:bg-gradient-to-r group-hover/lookbook:from-[#C084FC] group-hover/lookbook:via-[#D4AF37] group-hover/lookbook:to-[#FFFFFF] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] group-hover/lookbook:drop-shadow-[0_0_45px_rgba(168,85,247,0.7)]">
                      COLLECTIONS
                    </h2>
                  </div>

                  {/* Interactive Explore Cue */}
                  <div className="mt-4 sm:mt-6 flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.25em] text-white/70 group-hover/lookbook:text-accent transition-colors duration-300">
                    <span className="w-6 h-px bg-accent/60 transition-all duration-300 group-hover/lookbook:w-12 group-hover/lookbook:bg-accent" />
                    <span>EXPLORE ARCHIVE</span>
                    <ArrowDown className="w-3.5 h-3.5 text-accent animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* VIEW 02: LINEUP (Interactive Collection Hotspots & Dock)   */}
            {/* ======================================================== */}
            {isLineup && (
              <>
                {/* Interactive Collection Hotspot Beacons on the Image */}
                {COLLECTIONS.map((col) => {
                  const pos = col.coords.artifacts || { x: '50%', y: '50%' };
                  const isCurrent = currentActiveId === col.id;

                  return (
                    <div
                      key={col.id}
                      style={{ left: pos.x, top: pos.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto transition-all duration-700 ease-out"
                      onMouseEnter={() => setHoveredCollectionId(col.id)}
                      onMouseLeave={() => setHoveredCollectionId(null)}
                    >
                      <button
                        onClick={() => handleScrollToGrid('products-archive')}
                        aria-label={`Inspect ${col.name}`}
                        className="relative group/hotspot flex items-center justify-center p-2 focus:outline-none cursor-pointer"
                      >
                        {/* Concentric Sonar Rings */}
                        <span
                          className="absolute w-8 h-8 rounded-full opacity-40 animate-ping transition-colors duration-500"
                          style={{ backgroundColor: col.colorHex }}
                        />
                        <span
                          className={`absolute w-6 h-6 rounded-full border transition-all duration-300 ${
                            isCurrent ? 'scale-125 opacity-100 shadow-[0_0_15px_currentColor]' : 'opacity-60 scale-100'
                          }`}
                          style={{ borderColor: col.colorHex, color: col.colorHex }}
                        />
                        {/* Center Core Dot */}
                        <span
                          className={`relative w-2.5 h-2.5 rounded-full transition-transform duration-300 shadow-[0_0_12px_currentColor] ${
                            isCurrent ? 'scale-150' : 'scale-100'
                          }`}
                          style={{ backgroundColor: col.colorHex, color: col.colorHex }}
                        />

                        {/* Floating Hotspot Tag on Image */}
                        <motion.div
                          animate={{
                            opacity: isCurrent ? 1 : 0.8,
                            y: isCurrent ? -3 : 0,
                            scale: isCurrent ? 1.05 : 1
                          }}
                          className={`absolute left-6 whitespace-nowrap hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md backdrop-blur-md border text-[10px] font-mono tracking-wider shadow-2xl pointer-events-none transition-all duration-300 ${
                            isCurrent
                              ? 'border-white/50 bg-black/90 shadow-[0_0_20px_rgba(0,0,0,0.9)]'
                              : 'border-white/15 bg-black/75'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.colorHex }} />
                          <span className={`font-semibold ${isCurrent ? col.accentText : 'text-white'}`}>{col.name}</span>
                          <span className="text-gray-400 text-[9px]">// {col.number}</span>
                        </motion.div>
                      </button>
                    </div>
                  );
                })}

                {/* Bottom HUD Dock: Mentions Collections with Mind-Blowing Text Hover Animations */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 md:p-8 z-30 pointer-events-auto">
                  <div className="max-w-5xl mx-auto">
                    {/* Floating Preview Capsule for the active/hovered collection */}
                    <div className="min-h-[50px] sm:min-h-[60px] flex items-end justify-center mb-3">
                      <AnimatePresence mode="wait">
                        {activeData && (
                          <motion.div
                            key={activeData.id}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="px-5 py-2.5 rounded-xl border border-white/20 bg-black/80 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.9)] flex items-center gap-4 text-left cursor-pointer transition-all hover:border-white/40 group/capsule"
                            onClick={() => handleScrollToGrid('products-archive')}
                          >
                            <div
                              className="w-2.5 h-8 rounded-full shadow-[0_0_12px_currentColor] transition-transform duration-300 group-hover/capsule:scale-y-110"
                              style={{ backgroundColor: activeData.colorHex, color: activeData.colorHex }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-gray-400">
                                  {activeData.tier}
                                </span>
                                <span className="text-gray-600">•</span>
                                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold ${activeData.accentText}`}>
                                  {activeData.faction}
                                </span>
                                <span className="hidden sm:inline-block text-gray-600">•</span>
                                <span className="hidden sm:inline-block text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                  Vessel: {activeData.vessel}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-200 italic font-serif">
                                "{activeData.mantra}"
                              </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/90 group-hover/capsule:text-white">
                              <span>INSPECT</span>
                              <ArrowDown className="w-3.5 h-3.5 text-white/80 animate-bounce" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* The 3 Collections Interactive Text Bar */}
                    <div className="p-2 sm:p-2.5 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {COLLECTIONS.map((col) => {
                        const isCurrent = currentActiveId === col.id;

                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => handleScrollToGrid('products-archive')}
                            onMouseEnter={() => setHoveredCollectionId(col.id)}
                            onMouseLeave={() => setHoveredCollectionId(null)}
                            className={`relative px-4 py-3.5 sm:py-4 rounded-xl text-left transition-all duration-300 group/col flex flex-col justify-center overflow-hidden border cursor-pointer ${
                              isCurrent
                                ? `${col.bgActive} ${col.borderHover} border-white/30`
                                : 'border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                            }`}
                          >
                            {/* Interactive Dynamic Glow Background Pill on Active/Hover */}
                            {isCurrent && (
                              <motion.div
                                layoutId="activeCollectionHoverPill"
                                className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/20 shadow-inner"
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                              />
                            )}

                            {/* Top micro metadata row */}
                            <div className="relative z-10 flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                    isCurrent ? 'scale-125 shadow-[0_0_8px_currentColor]' : 'opacity-60'
                                  }`}
                                  style={{ backgroundColor: col.colorHex, color: col.colorHex }}
                                />
                                <span className="transition-colors duration-300 group-hover/col:text-gray-300">
                                  COLLECTION // {col.number}
                                </span>
                              </span>
                              <span className={`transition-colors duration-300 font-medium ${isCurrent ? col.accentText : 'text-gray-500'}`}>
                                {col.vessel}
                              </span>
                            </div>

                            {/* Main Collection Title with High-Impact Text Hover Animation */}
                            <div className="relative z-10 overflow-hidden py-0.5">
                              <h3
                                className={`text-sm sm:text-base lg:text-lg font-heading uppercase font-bold drop-shadow-md transition-all duration-500 ease-out flex items-center justify-between ${
                                  isCurrent
                                    ? `tracking-[0.24em] text-transparent bg-clip-text bg-gradient-to-r ${col.gradientText}`
                                    : 'tracking-[0.14em] text-white/80 group-hover/col:text-white group-hover/col:tracking-[0.20em]'
                                }`}
                              >
                                <span>{col.name}</span>
                                <ChevronRight
                                  className={`w-4 h-4 transition-all duration-300 ${
                                    isCurrent ? `opacity-100 translate-x-0 ${col.accentText}` : 'opacity-0 -translate-x-2'
                                  }`}
                                />
                              </h3>
                            </div>

                            {/* Subtitle Lore Text with Fade & Color shift Animation */}
                            <div className="relative z-10 mt-1 flex items-center justify-between">
                              <span
                                className={`text-[10px] sm:text-xs font-mono tracking-[0.18em] uppercase font-medium transition-all duration-300 ${
                                  isCurrent ? col.accentText : 'text-gray-400 group-hover/col:text-gray-300'
                                }`}
                              >
                                {col.faction}
                              </span>
                              <span
                                className={`text-[9px] font-mono tracking-widest uppercase transition-all duration-300 ${
                                  isCurrent ? 'opacity-100 text-white font-semibold' : 'opacity-0 translate-y-1'
                                }`}
                              >
                                LOCATE ↓
                              </span>
                            </div>

                            {/* Neon Light Beam Underline on Hover/Active */}
                            <div
                              className={`absolute bottom-0 inset-x-2 h-[2px] rounded-full transition-all duration-500 origin-left ${
                                isCurrent ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                              }`}
                              style={{
                                backgroundColor: col.colorHex,
                                boxShadow: `0 0 16px ${col.colorHex}`
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Corner Tactical Brackets for Luxury Fashion Aesthetic */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white/30 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white/30 pointer-events-none" />
          </div>

          {/* High-tech Subtle Border Outline */}
          <div className="absolute inset-0 rounded-none sm:rounded-2xl md:rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionsDashboardBanner;
