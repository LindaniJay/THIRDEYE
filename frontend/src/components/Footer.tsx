import React from "react";
import { Link } from "react-router-dom";

// Simple SVG Icons
const SocialIcon = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
    {children}
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative bg-cover bg-center text-gray-300 w-full" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black/80"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-xs">
          <div>
            <h3 className="font-bold text-white mb-1">THIRDEYE</h3>
            <p className="mb-4">Quality services you can trust.</p>
            <div className="relative overflow-hidden rounded-lg p-1 text-center">
              <Link 
                to="/vehicle-inspection" 
                className="relative z-10 inline-block w-full bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-500/90 hover:to-blue-600/90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg backdrop-blur-sm border border-white/20 hover:border-blue-400/50"
              >
                Vehicle Inspection
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-1">Contact Us</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <SocialIcon className="text-blue-400">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </SocialIcon>
                123 Main St, Durban
              </li>
              <li className="flex items-center gap-2">
                <SocialIcon className="text-blue-400">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </SocialIcon>
                +27 69 215 1207
              </li>
              <li className="flex items-center gap-2">
                <SocialIcon className="text-blue-400">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </SocialIcon>
                Lindanijonase@gmail.com
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-1">Follow Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500"
                aria-label="Facebook"
              >
                <SocialIcon>
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </SocialIcon>
              </a>
              <a 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400"
                aria-label="Twitter"
              >
                <SocialIcon>
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </SocialIcon>
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500"
                aria-label="Instagram"
              >
                <SocialIcon>
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.19.15 4.77 1.7 4.92 4.91.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.2-1.73 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.19-.15-4.77-1.7-4.92-4.91-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.93 2.35 7.12 2.2 8.4 2.14 8.78 2.13 12 2.13M12 0C8.74 0 8.33.01 7.05.06c-4.27.2-6.78 2.7-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.2 4.28 2.71 6.78 6.98 6.98 1.28.05 1.69.06 4.95.06s3.67-.01 4.95-.06c4.28-.2 6.78-2.7 6.98-6.98.05-1.28.06-1.69.06-4.95s-.01-3.67-.06-4.95c-.2-4.28-2.7-6.78-6.98-6.98C15.67.01 15.26 0 12 0z"/>
                  <path d="M12 5.84c-3.4 0-6.16 2.76-6.16 6.16s2.76 6.16 6.16 6.16 6.16-2.76 6.16-6.16S15.4 5.84 12 5.84zm0 10.16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                  <circle cx="16.5" cy="7.5" r="1.5"/>
                </SocialIcon>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <p>© {new Date().getFullYear()} THIRDEYE. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
