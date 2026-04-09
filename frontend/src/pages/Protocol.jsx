import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Protocol = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="min-h-screen bg-black text-gray-300 pt-32 pb-24 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white mb-16 text-center">Protocol</h1>
                
                <div className="space-y-24">
                    {/* Terms */}
                    <section id="terms" className="scroll-mt-32 border-l border-white/10 pl-6 md:pl-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-6">Terms</h2>
                        <h3 className="text-lg font-semibold text-white mb-4">Terms & Conditions</h3>
                        <div className="space-y-4 text-sm leading-relaxed text-gray-400">
                            <p>By accessing or purchasing from ENDURA, you agree to be legally bound by our terms. These terms govern your use of our website, products, and services.</p>
                            <p>All users must be at least 18 years of age or accessing the platform under supervision. You agree to provide accurate information and not misuse the platform in any manner, including fraudulent activity, unauthorized access, or violation of intellectual property rights.</p>
                            <p>All products are subject to availability. We reserve the right to cancel or refuse any order due to stock issues, pricing errors, or suspicious activity. Once an order is placed and processed, it cannot be cancelled.</p>
                            <p>Product images are for representation only — slight variations may occur. Prices, policies, and product details may be updated at any time without prior notice.</p>
                            <p>ENDURA is not liable for delays, losses, or damages caused by third-party logistics or events beyond our control (force majeure).</p>
                            <p>By continuing to use our platform, you acknowledge that you have read, understood, and agreed to these terms as a binding agreement.</p>
                        </div>
                    </section>

                    {/* Exchange Policy */}
                    <section id="exchange" className="scroll-mt-32 border-l border-white/10 pl-6 md:pl-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-6">Exchange Policy</h2>
                        <div className="space-y-4 text-sm leading-relaxed text-gray-400">
                            <p>At ENDURA, every piece is released in strictly limited quantities. Once an order is placed, it is considered final.</p>
                            <p>We do not offer returns. Exchanges are only accepted under specific conditions:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Size mismatch (subject to availability)</li>
                            </ul>
                            <p>All exchange requests must be raised within 48 hours of delivery. The item must be unworn, unused, and in original condition with tags and packaging intact.</p>
                            <p>Products that show signs of wear, washing, or damage not caused during transit will not be eligible for exchange.</p>
                            <p>In case the requested size is unavailable, a store credit may be issued at our discretion.</p>
                            <p>ENDURA reserves the right to approve or reject any exchange request after quality inspection. All decisions are final.</p>
                        </div>
                    </section>

                    {/* Privacy Policy */}
                    <section id="privacy" className="scroll-mt-32 border-l border-white/10 pl-6 md:pl-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-6">Privacy Policy</h2>
                        <div className="space-y-4 text-sm leading-relaxed text-gray-400">
                            <p>At ENDURA, your privacy is respected and protected. We collect only the information necessary to process your orders and enhance your experience.</p>
                            <p>This may include your name, contact details, shipping address, and payment information. All transactions are processed through secure, encrypted payment gateways — we do not store your card or sensitive payment data.</p>
                            <p>Your information is used strictly for order fulfillment, communication, and service improvement. We do not sell, rent, or share your personal data with third parties, except with trusted partners involved in payment processing and delivery.</p>
                            <p>By using our website, you consent to the collection and use of your information in accordance with this policy.</p>
                            <p>We may update this policy from time to time. Continued use of the platform signifies your acceptance of any changes.</p>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section id="faq" className="scroll-mt-32 border-l border-white/10 pl-6 md:pl-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-8">FAQ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-white font-bold mb-2">Drops</h4>
                                <p className="text-sm text-gray-400">Every release is limited.<br/>No restocks. No second chances.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Sizing</h4>
                                <p className="text-sm text-gray-400">Designed for a precise fit.<br/>Refer to our size guide before ordering.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Pre-orders</h4>
                                <p className="text-sm text-gray-400">Crafted on demand.<br/>Shipped when production is complete.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Product</h4>
                                <p className="text-sm text-gray-400">Each piece may carry slight variations —<br/>a mark of individuality, not defect.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Care</h4>
                                <p className="text-sm text-gray-400">Preserve the garment.<br/>Cold wash. Air dry. No direct heat on prints.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Orders</h4>
                                <p className="text-sm text-gray-400">Once placed, they cannot be cancelled or altered.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Exchanges</h4>
                                <p className="text-sm text-gray-400">Approved only for size or defect — within 48 hours.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Shipping</h4>
                                <p className="text-sm text-gray-400">Handled through trusted partners.<br/>Timelines are estimated, not guaranteed.</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2">Support</h4>
                                <p className="text-sm text-gray-400 text-primary">help.endura@gmail.com</p>
                            </div>
                        </div>
                    </section>

                    {/* Care */}
                    <section id="care" className="scroll-mt-32 border-l border-white/10 pl-6 md:pl-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-6">Care</h2>
                        <div className="space-y-6 text-sm leading-relaxed text-gray-400">
                            <p className="font-bold text-white uppercase tracking-wider">Built with detail. Handle with precision.</p>
                            <p>This piece features embroidery and puff print —<br/>treat it with care to preserve its structure and finish.</p>
                            <div className="bg-white/5 p-6 rounded border border-white/10">
                                <ul className="space-y-2">
                                    <li>• Cold wash only. Turn inside out.</li>
                                    <li>• Do not bleach. Do not tumble dry.</li>
                                    <li>• Air dry in shade.</li>
                                </ul>
                            </div>
                            <p>Do not iron directly on prints or embroidery.<br/>Avoid harsh friction or folding over prints.</p>
                            <p className="italic">Respect the fabric.<br/>Preserve the texture. Maintain the form.</p>
                            <p className="font-bold text-white">Not made for careless wear.</p>
                        </div>
                    </section>

                    {/* About Us */}
                    <section id="about" className="scroll-mt-32 border-l border-white/10 pl-6 md:pl-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-6">About Us</h2>
                        <div className="space-y-6 text-sm leading-relaxed text-gray-400">
                            <p className="text-xl text-white font-bold uppercase tracking-widest">ENDURA is not built for everyone.</p>
                            <p>We operate on intention —<br/>limited releases, controlled quantities, no repetition.</p>
                            <p>Every piece is designed to hold weight,<br/>not just in fabric, but in presence.</p>
                            <p>We don’t follow trends.<br/>We create drops that define moments.</p>
                            <div className="pt-4 space-y-1 font-bold text-white/50 uppercase tracking-widest">
                                <p>No mass production.</p>
                                <p>No restocks.</p>
                                <p>No compromises.</p>
                            </div>
                            <p className="pt-8 text-2xl font-black text-white uppercase tracking-[0.3em]">This is ENDURA.</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Protocol;
