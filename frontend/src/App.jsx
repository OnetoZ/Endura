import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/StoreContext';
import IntroAnimation from './pages/IntroAnimation';
import Navbar from './components/Navbar';
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

// Component to handle conditional navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  const showNavbar = ['/home', '/collections', '/cart', '/vault', '/shop', '/dashboard'].includes(location.pathname) || location.pathname.startsWith('/product/');
  return showNavbar ? <Navbar /> : null;
};

// Component to handle conditional footer
const ConditionalFooter = () => {
  const location = useLocation();
  const showFooter = ['/home', '/collections', '/cart', '/vault', '/shop', '/dashboard'].includes(location.pathname) || location.pathname.startsWith('/product/');
  return showFooter ? <Footer /> : null;
};

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  console.log('App component initializing...');

  // Check if intro should be shown on app mount
  useEffect(() => {
    const animationCompleted = localStorage.getItem('endura_animation_completed');

    console.log('Animation completed flag:', animationCompleted);

    // Always show intro for now - remove this logic if you want to always show intro
    if (animationCompleted) {
      console.log('Animation completed before, but showing intro anyway');
    } else {
      console.log('First time, showing intro animation');
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AppProvider>
      <SmoothScroll>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
            <ConditionalNavbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<IntroAnimation />} />
                <Route path="/home" element={<Home />} />
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
            <ConditionalFooter />
          </div>
        </Router>
      </SmoothScroll>
    </AppProvider>
  );
};

export default App;
