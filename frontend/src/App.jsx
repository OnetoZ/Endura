
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/StoreContext';
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
import ScrollToTop from './components/ScrollToTop';
import IntroCinema from './components/IntroFrameSequence';

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
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop trigger={showIntro} />
          {showIntro ? (
            <IntroCinema onComplete={handleIntroComplete} />
          ) : (
            <div className="flex flex-col min-h-screen">
              <Navbar />

              {/* Main Content (Landing Page and beyond) */}
              <main className="flex-grow pt-20">
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
          )}
        </Router>
      </SmoothScroll>
    </AppProvider>
  );
};

export default App;
