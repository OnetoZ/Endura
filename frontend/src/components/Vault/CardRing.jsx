import React, { useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, forwardRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const tierColor = (tier) => {
  if (tier === 'Bronze') return '#8a6e45';
  if (tier === 'Gold') return '#d4af37';
  if (tier === 'Diamond') return '#b0e0e6';
  if (tier === 'Endura') return '#7c3aed';
  return '#d4af37';
};

const CardRing = forwardRef(({ cards = [], onSelect }, ref) => {
  const containerRef = useRef(null);
  const ringRef = useRef(null);
  const rotationRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const hoveredIndexRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cardRefs = useRef({});

  const radius = 520;
  const spacing = useMemo(() => 360 / Math.max(cards.length, 1), [cards.length]);

  useImperativeHandle(ref, () => ({
    flipCard: (id) => {
      const el = cardRefs.current[id];
      if (!el) return;
      const glow = el.querySelector('[data-glow]');
      const face = el.querySelector('[data-face]');
      const back = el.querySelector('[data-back]');
      gsap.set(back, { rotateY: -180, opacity: 0 });
      const tl = gsap.timeline();
      tl.to(el, { z: 70, duration: 0.3, ease: 'power2.out' })
        .to([face, back], { rotateY: '+=180', duration: 0.7, ease: 'power3.inOut' }, 0)
        .to(back, { opacity: 1, duration: 0.3 }, 0.35)
        .to(glow, { opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1], duration: 0.8, ease: 'sine.inOut' }, 0.3)
        .to(el, { z: 0, duration: 0.3, ease: 'power2.out' }, 0.8);
    }
  }));

  useLayoutEffect(() => {
    if (!ringRef.current) return;
    gsap.set(ringRef.current, { rotateY: rotationRef.current });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      const delta = e.deltaY * 0.04;
      rotationRef.current += delta;
      gsap.to(ringRef.current, { rotateY: rotationRef.current, duration: 0.8, ease: 'power3.out' });
    };
    const onPointerDown = (e) => {
      draggingRef.current = true;
      dragStartXRef.current = e.clientX;
    };
    const onPointerMove = (e) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      dragStartXRef.current = e.clientX;
      rotationRef.current += dx * -0.15;
      gsap.to(ringRef.current, { rotateY: rotationRef.current, duration: 0.5, ease: 'power2.out' });
    };
    const onPointerUp = () => {
      draggingRef.current = false;
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[80vh] md:h-[88vh] overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px]" />
      <div className="absolute inset-0 flex items-center justify-center perspective-[1800px]">
        <div
          ref={ringRef}
          className="relative transform-gpu preserve-3d"
          style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}
        >
          {cards.map((c, i) => {
            const angle = i * spacing;
            const color = tierColor(c.tier);
            const dimmed = hoveredIndex !== null && hoveredIndex !== i;
            return (
              <motion.div
                key={c.id}
                ref={(el) => {
                  if (el) cardRefs.current[c.id] = el;
                }}
                onMouseEnter={() => {
                  hoveredIndexRef.current = i;
                  setHoveredIndex(i);
                  gsap.to(cardRefs.current[c.id], { z: 30, duration: 0.4, ease: 'power2.out' });
                }}
                onMouseLeave={() => {
                  hoveredIndexRef.current = null;
                  setHoveredIndex(null);
                  gsap.to(cardRefs.current[c.id], { z: 0, duration: 0.4, ease: 'power2.out' });
                }}
                onClick={() => onSelect && onSelect(c)}
                className="absolute preserve-3d cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  width: 260,
                  height: 340,
                  filter: dimmed ? 'brightness(0.5)' : 'none',
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.06 }}
              >
                <div data-glow className="absolute inset-0 rounded-[1.5rem] opacity-0" style={{ background: color, filter: 'blur(30px)' }} />
                <div className="absolute inset-0 rounded-[1.5rem] border border-white/10 overflow-hidden bg-[#0a0a0a]">
                  <div data-face className="absolute inset-0 preserve-3d">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-[0.5em] text-white/30 uppercase">{c.tier}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      </div>
                      <div className="text-center">
                        <span className={`text-2xl font-heading font-black tracking-tight ${c.locked ? 'text-white/20' : 'text-white'}`}>{c.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-2 ${c.locked ? 'opacity-80' : 'opacity-100'}`}>
                          {c.locked ? <Lock className="w-4 h-4 text-white/40" /> : null}
                          <span className={`text-[9px] font-mono tracking-widest uppercase ${c.locked ? 'text-white/30' : 'text-accent'}`}>{c.locked ? 'Locked' : 'Unlocked'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-back className="absolute inset-0 preserve-3d">
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-mono tracking-[0.5em] text-accent uppercase">Skin Unlocked</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default CardRing;
