import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import AuthButton from './AuthButton';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/services", text: "Our Services" },
    { to: "/pricing", text: "Pricing" },
    { to: "/about", text: "About Us" },
    { to: "/contact", text: "Contact Us" }
  ];

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center h-16">
            <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md">
              <img 
                src="/Thirdeye Logo Design.png" 
                alt="THIRDEYE" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                THIRDEYE
              </span>
            </div>
          </NavLink>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <motion.div 
                key={link.to}
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `relative px-4 py-2 text-sm font-medium transition-all ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.text}</span>
                      {isActive && (
                        <motion.span 
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg -z-0"
                          layoutId="navHighlight"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                      <motion.span 
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 -z-0"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: isActive ? 1 : 0,
                          opacity: isActive ? 1 : 0.7
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
            <motion.div 
              className="ml-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <AuthButton />
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <FontAwesomeIcon 
                icon={isOpen ? faXmark : faBars} 
                className="block h-6 w-6" 
                aria-hidden="true" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mobile-menu bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={(isActive) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
