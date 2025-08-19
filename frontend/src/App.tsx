import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import LiveChat from './components/LiveChat';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const OurServicesPage = lazy(() => import('./pages/OurServicesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const VehicleInspectionPage = lazy(() => import('./pages/VehicleInspectionPage'));

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


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <main className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicle-inspection" element={<VehicleInspectionPage />} />
              <Route path="/services" element={<OurServicesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
            </Routes>
          )}
        </main>
      </Suspense>
      <Footer />
      <LiveChat />
    </div>
  );
}

export default App;
