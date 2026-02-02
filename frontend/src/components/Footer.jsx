import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Background shifted to a warm amber-tinted neutral
    <footer className="w-full bg-[#FFFBEB] border-t border-amber-200 pt-12 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          {/* Logo updated to deep amber */}
          <div className="text-xl font-black tracking-tighter text-amber-700 mb-4">
            MyNote
          </div>
          <p className="text-sm text-amber-900/70 leading-relaxed">
            The minimal space for your maximum thoughts. Join our community of
            thinkers and creators.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-4">
            Product
          </h3>
          <ul className="space-y-2 text-sm text-amber-800/80">
            <li>
              <Link to="/" className="hover:text-amber-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/explore"
                className="hover:text-amber-600 transition-colors"
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="hover:text-amber-600 transition-colors"
              >
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-4">
            Legal
          </h3>
          <ul className="space-y-2 text-sm text-amber-800/80">
            <li>
              <Link
                to="/privacyPolicy"
                className="hover:text-amber-600 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-amber-600 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/cookies"
                className="hover:text-amber-600 transition-colors"
              >
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter/Status */}
        <div>
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-4">
            Status
          </h3>
          <div className="flex items-center space-x-2 text-sm text-amber-800/80">
            {/* Pulse color updated to a gold/amber variant */}
            <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-amber-200 flex flex-col md:flex-row justify-between items-center text-xs text-amber-700/60">
        <p>&copy; {currentYear} MyNote Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-amber-900 transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-amber-900 transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-amber-900 transition-colors">
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
