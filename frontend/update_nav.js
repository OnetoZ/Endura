const fs = require('fs');
const file = '/Users/sandhanam/Documents/Projects/endura/Endura/frontend/src/components/Navbar.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove isMenuOpen
content = content.replace(/const \[isMenuOpen, setIsMenuOpen\] = useState\(false\);/, '');

// 2. Remove useEffect isMenuOpen
content = content.replace(/useEffect\(\(\) => \{\n\s*if \(isMenuOpen\).*?\n\s*\}, \[isMenuOpen\]\);/s, '// mobile drawer removed');

// 3. Wrap return in <>
content = content.replace(/return \(\n\s*<nav/, 'return (\n        <>\n            <nav');

// 4. Update login button back to top nav
content = content.replace(/<Link to="\/auth" className="hidden md:block relative group overflow-hidden">/, '<Link to="/auth" className="relative group overflow-hidden md:scale-100 scale-[0.8] origin-right">');
content = content.replace(/<div className="relative z-10 px-8 py-3 flex items-center gap-2">/, '<div className="relative z-10 px-6 md:px-8 py-2 md:py-3 flex items-center gap-1 md:gap-2">');
content = content.replace(/<span className="text-\[10px\] font-black uppercase tracking-\[0\.3em\] text-white">/, '<span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white">');

// 5. Delete 3 Dots and mobile Menu Drawer
const dotsRegex = /\{\/\* MOBILE MENU TOGGLE - 3 Dots \*\/}.*?\{\/\* MOBILE MENU DRAWER \*\/\}.*?Endura_Mobile_OS_v1\.0<\/p>\n.*?<\/div>\n.*?<\/div>\n.*?<\/div>\n.*?<\/div>/s;
content = content.replace(dotsRegex, '</div>\n                </div>');

// 6. Append bottom nav
const newEnd = `            \`}</style>
        </nav>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className={\`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 glass border-t border-white/10 transition-all duration-500 pb-safe \${visible ? 'translate-y-0' : 'translate-y-full'}\`}>
            <div className="flex justify-around items-center h-16 px-2">
                {[
                    { to: '/', label: 'HOME', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                    { to: '/cult', label: 'CULT', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { to: '/collections', label: 'GEAR', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                    ...(currentUser ? [{ to: '/vault', label: 'VAULT', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', accent: true }] : [])
                ].map((link, idx) => {
                    const isActive = location.pathname === link.to;
                    return (
                        <Link
                            key={idx}
                            to={link.to}
                            onClick={link.to === '/' ? handleLogoClick : undefined}
                            className="flex flex-col items-center justify-center w-full h-full gap-1 group"
                        >
                            <svg className={\`w-5 h-5 transition-all duration-300 \${isActive ? (link.accent ? 'text-accent' : 'text-primary') : 'text-white/40 group-hover:text-white/80'}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2" : "1.5"} d={link.icon} />
                            </svg>
                            <span className={\`text-[8px] font-black uppercase tracking-widest \${isActive ? (link.accent ? 'text-accent' : 'text-primary') : 'text-white/40 group-hover:text-white/80'}\`}>
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
        </>
    );
});`;
content = content.replace(/            `}<\/style>\n        <\/nav>\n    \);\n\}\);/s, newEnd);

fs.writeFileSync(file, content);
console.log('Update Complete');
