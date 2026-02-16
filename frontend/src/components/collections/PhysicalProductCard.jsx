import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

/**
 * PhysicalProductCard Component
 * Implements a premium fashion-first motion design with:
 * - 3D Tilt: Responds to mouse move for tactile depth
 * - Parallax Image: Subtle lift on hover
 * - Staggered Entry: Cards flow in with refined easing
 * - Luxury Transitions: Gold accent reveal and CTA fade-in
 */
const PhysicalProductCard = ({ product }) => {
    const { addToCart } = useStore();
    const [isHovered, setIsHovered] = useState(false);

    // Tilt Animation
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, rotateY: -10, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`relative aspect-[4/5] w-full bg-[#111111] overflow-hidden rounded-sm transition-all duration-700 ${isHovered ? 'shadow-[0_40px_80px_rgba(0,0,0,0.9)] scale-[1.02]' : 'shadow-2xl'}`}
            >
                {/* Corner Brackets */}
                <div className="corner-bracket bracket-tl"></div>
                <div className="corner-bracket bracket-tr"></div>
                <div className="corner-bracket bracket-bl"></div>
                <div className="corner-bracket bracket-br"></div>

                {/* Scanning Beam */}
                <div className="scanner-line"></div>

                {/* Product Image with Parallax & Glitch Overlay */}
                <motion.div
                    style={{
                        transform: isHovered ? "translateZ(60px) scale(1.1)" : "translateZ(0px) scale(1)",
                        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }}
                    className="w-full h-full relative"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-1000 grayscale-[0.4] group-hover:grayscale-0 group-hover:contrast-[1.1]"
                    />
                    {/* Subtle Overlay Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
                </motion.div>

                {/* Subcategory Badge */}
                <div className="absolute top-6 left-6 z-10 overflow-hidden">
                    <motion.span
                        animate={{ y: isHovered ? 0 : 0 }}
                        className="block text-[9px] font-black tracking-[0.4em] text-[#d4af37] uppercase px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-[#d4af37]/30"
                    >
                        {product.subcategory}
                    </motion.span>
                </div>

                {/* Accent Line (Bottom) */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#d4af37] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"></div>

                {/* Overlay with CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-[#050505]/40 backdrop-blur-[3px] flex flex-col items-center justify-center p-8 z-20"
                    style={{ transform: "translateZ(100px)" }}
                >
                    <div className="flex flex-col gap-4 w-full max-w-[180px]">
                        <Link
                            to={`/product/${product.id}`}
                            className="w-full py-4 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-[0.3em] text-center hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            Access Intel
                        </Link>
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full py-4 border border-white/10 bg-black/40 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
                        >
                            Sync to Cart
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Product Meta Data */}
            <div className="mt-8 flex justify-between items-start px-2 meta-reveal">
                <div className="flex flex-col gap-2">
                    <p className="text-[9px] text-[#d4af37]/60 font-black uppercase tracking-[0.5em]">{product.category}</p>
                    <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-tight group-hover:text-[#d4af37] transition-colors duration-500">
                        {product.name}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></div>
                        <p className="text-2xl font-bold text-white tracking-tighter">₹{product.price}</p>
                    </div>
                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">Batch_001 // LTD_EDTN</p>
                </div>
            </div>
        </motion.div>
    );
};

export default PhysicalProductCard;
