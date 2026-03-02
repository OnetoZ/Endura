
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/5 py-24 px-6 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                <div className="col-span-2 relative flex flex-col items-start gap-6">
                    {/* Logo — large, behind text as watermark */}
                    <Link to="/home" className="absolute -top-12 -left-12 z-0 group">
                        <img
                            src="/logo.png"
                            alt="ENDURA"
                            className="h-44 w-auto object-contain opacity-90 transition-all duration-500 group-hover:opacity-100"
                            style={{ filter: 'brightness(0.85) saturate(1)' }}
                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.3) saturate(2) drop-shadow(0 0 20px #A855F7)'}
                            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(0.85) saturate(1)'}
                        />
                    </Link>
                    {/* Text content sits on top */}
                    <div className="relative z-10 flex flex-col gap-6 pt-24">
                        <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                            The intersection of high-end fashion and digital permanence. Building the infrastructure for the next generation of digital identity and physical luxury.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-3 bg-white/5 border border-white/10 rounded hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44c-.795 0-1.439-.645-1.439-1.44s.644-1.44 1.439-1.44z" /></svg>
                            </a>
                            <a href="#" className="p-3 bg-white/5 border border-white/10 rounded hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </a>
                            <a href="#" className="p-3 bg-white/5 border border-white/10 rounded hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.2736 18.2736 0 00-5.4877 0 11.7496 11.7496 0 00-.6172-1.2495.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.5152.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-primary">Dimensions</h4>
                    <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                        <li><Link to="/collections" className="hover:text-primary transition-all">All Inventory</Link></li>
                        <li><Link to="/collections" className="hover:text-primary transition-all">Digital Skins</Link></li>
                        <li><Link to="/vault" className="hover:text-primary transition-all">The Vault</Link></li>
                        <li><Link to="/auth" className="hover:text-primary transition-all">Operator Node</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-primary">Protocol</h4>
                    <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                        <li><a href="#" className="hover:text-primary transition-all">Privacy Encryption</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">Service Terms</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">Logistics</a></li>
                        <li><a href="#" className="hover:text-primary transition-all">System Status</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-black tracking-widest text-gray-600 uppercase">
                <p>© 2026 ENDURA_NETWORK_PROTOCOL // ALL_DATA_SECURED</p>
                <div className="flex space-x-8 mt-6 md:mt-0 font-bold">
                </div>
            </div>
        </footer>
    );
};

export default Footer;
