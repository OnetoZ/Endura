
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import IntroCinema from './components/IntroCinema/IntroCinema';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProductDetail from './pages/ProductDetail';
import DigitalVault from './pages/DigitalVault';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  const [showIntro, setShowIntro] = React.useState(true);

  React.useEffect(() => {
    // Check if intro was already seen in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  // Lock background scroll during cinematic intro
  React.useEffect(() => {
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

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');

    // Ensure landing on absolute top of homepage
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Secondary safety scroll for some browsers/SmoothScroll conflicts
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  return (
    <AppProvider>
      <SmoothScroll>
        <Router>
          <ScrollToTop trigger={showIntro} />
          {showIntro ? (
            <IntroCinema onComplete={handleIntroComplete} />
          ) : (
            <div className="flex flex-col min-h-screen">
              <Navbar />

              {/* Main Content (Landing Page and beyond) */}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/vault" element={<DigitalVault />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          )}
        </Router>
      </SmoothScroll>
    </AppProvider>
  );
};

export default App;
