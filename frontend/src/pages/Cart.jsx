
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, currentUser, updateCartQuantity, removeFromCart, placeOrder } = useStore();
    const [useCredits, setUseCredits] = useState(false);
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const maxRedeemable = currentUser ? Math.min(currentUser.credits, subtotal * 0.5) : 0;
    const creditsToUse = useCredits ? maxRedeemable : 0;
    const total = subtotal - creditsToUse;

    if (cart.length === 0) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-4xl font-oswald font-bold mb-4">GEAR BAG EMPTY</h2>
                <p className="text-gray-500 mb-8 max-w-sm">You haven't equipped any items yet. Visit the catalog to prepare for your mission.</p>
                <Link to="/shop" className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-blue-500 hover:text-white transition">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-5xl font-oswald font-bold uppercase tracking-tight mb-12 text-center md:text-left">Your Equipment</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-8">
                    {cart.map(item => (
                        <div key={item.id} className="flex space-x-6 border-b border-white/5 pb-8">
                            <div className="w-24 h-32 md:w-32 md:h-40 bg-[#111] flex-shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-bold uppercase tracking-tight text-lg">{item.name}</h3>
                                    <p className="font-light">₹{item.price * item.quantity}</p>
                                </div>
                                <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{item.category}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => updateCartQuantity(item.id, -1)}
                                            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartQuantity(item.id, 1)}
                                            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs text-red-500 uppercase tracking-widest font-bold hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:sticky lg:top-32 h-fit space-y-8">
                    <div className="glass p-8 space-y-6">
                        <h3 className="text-xl font-oswald font-bold uppercase tracking-widest mb-6">Order Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span className="text-green-500 uppercase font-bold text-xs">Calculated at Checkout</span>
                            </div>

                            {currentUser && currentUser.credits > 0 && (
                                <div className="py-4 border-y border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs uppercase tracking-widest font-bold text-blue-400">Apply Credits</label>
                                        <input
                                            type="checkbox"
                                            checked={useCredits}
                                            onChange={() => setUseCredits(!useCredits)}
                                            className="w-5 h-5 accent-blue-500"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        Redeem your loyalty points. Max redemption: {maxRedeemable} credits.
                                    </p>
                                    {useCredits && (
                                        <div className="flex justify-between mt-2 text-blue-500 font-bold">
                                            <span>Credit Discount</span>
                                            <span>-₹{creditsToUse}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between text-2xl font-bold pt-4">
                                <span>Total</span>
                                <span className="text-blue-500">₹{total}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!currentUser) {
                                    navigate('/auth');
                                } else {
                                    placeOrder(creditsToUse);
                                    alert("Order Synced Successfully!");
                                    navigate('/');
                                }
                            }}
                            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition"
                        >
                            {currentUser ? 'Execute Purchase' : 'Login to Checkout'}
                        </button>

                        <p className="text-[10px] text-center text-gray-600 uppercase tracking-[0.2em]">
                            Secure Transaction • Encrypted Channel
                        </p>
                    </div>

                    {currentUser && (
                        <div className="glass p-6 text-center border-blue-500/20">
                            <p className="text-xs uppercase tracking-widest mb-2 text-gray-400">Net Reward</p>
                            <p className="text-xl font-bold text-blue-400">+{Math.floor(total * 0.1)} CREDITS</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
