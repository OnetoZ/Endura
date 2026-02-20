import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import CollectedPage from './pages/CollectedPage';
import Footer from './components/Footer';
import Collections from './pages/Collections';
import SmoothScroll from './components/SmoothScroll';

// These must be inside BrowserRouter to use useLocation,
// so they are defined here but rendered inside the Router tree.
function AppLayout() {
  const location = useLocation();

  const hideLayoutRoutes = ['/'];
  const showNavbar = !hideLayoutRoutes.includes(location.pathname);

  const showFooter = showNavbar;

  const topPad = showNavbar ? 'pt-20' : 'pt-0';

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
      {showNavbar && <Navbar />}
      <main key={location.pathname} className={`flex-grow ${topPad}`}>
        <Routes>
          <Route path="/" element={<IntroAnimation />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/collected" element={<CollectedPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl uppercase tracking-widest animate-pulse">
          Synchronizing...
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <SmoothScroll>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppLayout />
        </BrowserRouter>
      </SmoothScroll>
    </AppProvider>
  );
}
