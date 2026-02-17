import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { AppProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import IntroFrameSequence from './components/IntroFrameSequence';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Vault from './pages/Vault';
import Footer from './components/Footer';
import Collections from './pages/Collections';
import SmoothScroll from './components/SmoothScroll';
import ScrollToTop from './components/ScrollToTop';
import IntroCinema from './components/IntroFrameSequence';

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const navRef = useRef(null);
  const landingRef = useRef(null);
  const transitionDone = useRef(false);

  useEffect(() => {
    // Check if intro was already seen in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  // Lock background scroll during cinematic intro
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showIntro]);

  const handleReveal = () => {
    if (transitionDone.current) return;
    transitionDone.current = true;

    // Release scroll lock
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    const tl = gsap.timeline();

    // Fade out frame container
    tl.to(".intro-frame-section", {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        setShowIntro(false);
        sessionStorage.setItem('hasSeenIntro', 'true');
        window.scrollTo(0, 0);
      }
    });

    // Fade in landing section
    tl.to(landingRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out"
    }, "-=0.6");

    // Fade in navbar
    tl.to(navRef.current, {
      opacity: 1,
      pointerEvents: "auto",
      duration: 1
    }, "-=1");
  };

  return (
    <AppProvider>
      <SmoothScroll>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop trigger={showIntro} />


              {/* Main Content (Landing Page and beyond) */}
              <main className="flex-grow pt-20">

          <div className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
            {/* Navbar is always in the DOM but hidden during intro */}
            <Navbar
              ref={navRef}
              style={showIntro ? { opacity: 0, pointerEvents: 'none' } : {}}
            />

            {/* Frame Intro Segment */}
            {showIntro && (
              <IntroFrameSequence onComplete={handleReveal} />
            )}

            {/* Landing Content Segment */}
            <div
              ref={landingRef}
              className="landing-section flex-grow flex flex-col"
              style={showIntro ? { opacity: 0, transform: 'translateY(80px)' } : { opacity: 1, transform: 'translateY(0)' }}
            >
              <main className="flex-grow">

                <Routes>
                  <Route path="/intro" element={<IntroFrameSequence onComplete={handleIntroComplete} />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/vault" element={<Vault />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </SmoothScroll>
    </AppProvider>
  );
};

export default App;
