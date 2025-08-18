import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));

// Add smooth scroll behavior for the whole app
document.documentElement.style.scrollBehavior = 'smooth';

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Show loading indicator during route changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  const renderLoader = () => (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner className="h-16 w-16" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-dark text-neutral-light font-sans bg-gradient-to-br from-neutral-dark via-secondary to-neutral-dark">
      <ScrollToTop />
      <Navbar />
      
      <main className="relative container mx-auto px-4 py-8">
        <Suspense fallback={renderLoader()}>
          {loading ? (
            renderLoader()
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
            </Routes>
          )}
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
