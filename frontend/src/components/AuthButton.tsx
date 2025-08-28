import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, signOut, loading } = useAuth();

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        className="px-4 py-2 text-white/70"
      >
        Loading...
      </motion.div>
    );
  }

  if (currentUser) {
    return (
      <motion.div 
        className="relative group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.button
          onClick={() => signOut()}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          whileHover={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <motion.span 
            className="flex items-center space-x-2"
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <UserCircleIcon className="w-5 h-5" />
            <span>Sign Out</span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 ml-1" />
            </motion.span>
          </motion.span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0.95, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ 
          scale: 1.05,
          background: [
            'linear-gradient(to right, #3b82f6, #2563eb)',
            'linear-gradient(to right, #2563eb, #1d4ed8)',
            'linear-gradient(to right, #1d4ed8, #2563eb)'
          ],
          transition: { 
            scale: { type: 'spring', stiffness: 400, damping: 10 },
            background: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
          }
        }}
        whileTap={{ scale: 0.98 }}
        className="rounded-lg"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-full px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2"
        >
          <motion.span 
            className="flex items-center"
            whileHover={{ x: 2 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <span>Get Started</span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="ml-1"
            >
              →
            </motion.span>
          </motion.span>
        </button>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AuthModal onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
