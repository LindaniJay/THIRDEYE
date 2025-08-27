import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, signOut, loading } = useAuth();

  if (loading) {
    return (
      <button className="px-4 py-2 text-white/70 animate-pulse">
        Loading...
      </button>
    );
  }

  if (currentUser) {
    return (
      <div className="relative group">
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <UserCircleIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors"
      >
        Sign In
      </button>
      {isOpen && <AuthModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
