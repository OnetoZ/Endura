
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <h2 className="text-2xl font-oswald tracking-tighter mb-4">ENDURA<span className="text-blue-500">.</span></h2>
                    <p className="text-gray-500 max-w-sm">
                        Forging the future of apparel and digital identity. High-performance gear for the modern nomad.
                    </p>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Store</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-white transition">All Products</a></li>
                        <li><a href="#" className="hover:text-white transition">Digital Assets</a></li>
                        <li><a href="#" className="hover:text-white transition">Loyalty Program</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition">Shipping Info</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                <p>© 2024 RCTROS ENDURA. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white">Instagram</a>
                    <a href="#" className="hover:text-white">Twitter</a>
                    <a href="#" className="hover:text-white">Discord</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
