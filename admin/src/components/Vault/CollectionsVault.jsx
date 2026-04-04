import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import UnlockPanel from './UI/UnlockPanel';

const CollectionsVault = () => {
  const { vaultItems } = useStore();
  const [items, setItems] = useState(vaultItems || []);
  const [selectedItem, setSelectedItem] = useState(null);
  const lockedRef = useRef(null);

  const unlockedItems = useMemo(() => items.filter(i => !i.locked), [items]);
  const lockedItems = useMemo(() => items.filter(i => i.locked), [items]);

  const handleUnlockConfirm = (id) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, locked: false } : i)));
    setSelectedItem(null);
  };

  const scrollToLocked = () => {
    if (lockedRef.current) {
      lockedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-black tracking-widest uppercase">
            Unlocked Collections
          </h2>
          <p className="text-sm font-body text-white/50 tracking-widest">
            Your collected digital artifacts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {unlockedItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-white/10 text-white p-2 rounded-lg">
                    <Unlock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-heading font-black tracking-widest uppercase">
                  {item.name}
                </h3>
                <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-1">
                  Archive Ref: {item.id}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={scrollToLocked}
            className="px-6 py-4 rounded-xl font-heading font-black tracking-[0.4em] text-[10px] bg-white/5 text-white/80 border border-white/10 hover:border-white/30 transition-all active:scale-95"
          >
            Add More Collectibles
          </button>
        </div>
      </section>

      <section ref={lockedRef} className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-black tracking-widest uppercase">
            Locked Collections
          </h2>
          <p className="text-sm font-body text-white/50 tracking-widest">
            Tap to unlock using your access code
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lockedItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/80 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-[3/4] overflow-hidden grayscale">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-5 rounded-full bg-black/80 border border-white/10">
                    <Lock className="w-8 h-8 text-white/40" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-heading font-black tracking-widest uppercase text-white/70">
                  {item.name}
                </h3>
                <div className="mt-4">
                  <button
                    className="w-full py-3 rounded-lg font-heading font-black tracking-[0.4em] text-[10px] bg-white/5 text-white/60 border border-white/10 hover:border-white/30 transition-all active:scale-95"
                  >
                    Tap to Unlock
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="fixed inset-0 flex items-center justify-center">
        {selectedItem && (
          <UnlockPanel
            item={selectedItem}
            onUnlock={(id) => handleUnlockConfirm(id)}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CollectionsVault;
