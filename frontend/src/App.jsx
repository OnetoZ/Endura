import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { AppProvider } from './context/StoreContext';
import IntroAnimation from './pages/IntroAnimation';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CultPage from './pages/CultPage';
import Auth from './pages/Auth';
import AuthSuccess from './pages/AuthSuccess';
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
import ProtectedRoute from './components/ProtectedRoute';
import { useStore } from './context/StoreContext';
import Onboarding from './pages/Onboarding';

// These must be inside BrowserRouter to use useLocation,
// so they are defined here but rendered inside the Router tree.

// Resets scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, lenis]);
  return null;
}

function AppLayout() {
  const location = useLocation();
  const { currentUser } = useStore();
  const lenis = useLenis();

  // Only play intro on a fresh session (new tab). Reloads skip it.
  const [introDone, setIntroDone] = useState(() => {
    return sessionStorage.getItem('introDone') === '1';
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('introDone', '1');
    setIntroDone(true);
  };

  // Force scroll to top when intro finishes
  useEffect(() => {
    if (introDone) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Also refresh GSAP ScrollTriggers
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }
  }, [introDone, lenis]);

  const hideLayoutRoutes = ['/', '/onboarding'];
  // Show navbar/footer on root '/' ONLY if intro is done
  const isIntroPage = location.pathname === '/' && !introDone;
  const showNavbar = !hideLayoutRoutes.includes(location.pathname) || (location.pathname === '/' && introDone);
  const showFooter = showNavbar;

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
      <ScrollToTop />
      {showNavbar && <Navbar />}
      <main key={location.pathname} className="flex-grow">
        <Routes>
          <Route path="/" element={
            introDone ? <Home /> : <IntroAnimation onComplete={handleIntroComplete} />
          } />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/cult" element={<CultPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/vault" element={
            <ProtectedRoute>
              <Vault />
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/collected" element={<CollectedPage />} />
          <Route path="/auth" element={
            currentUser && !location.search.includes('admin2fa') && !location.search.includes('tempToken') && !location.search.includes('token')
              ? <Navigate to="/" replace />
              : <Auth />
          } />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/*" element={
            currentUser && currentUser.role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" replace />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
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
