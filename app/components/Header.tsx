// Header.tsx (Pro-Level FLOATING Dark Glassmorphism)

import Link from 'next/link';
import React, { useState } from 'react';
// Import professional icons from a popular library like lucide-react
import { User, ShoppingCart, Menu, X, ChevronDown, LogOut } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Crafters', 'href': '/crafters' },
    { name: 'Contact', href: '/contact' },
  ];

  // Placeholder for authentication status
  const isAuthenticated = true; 

  return (
    // OUTER CONTAINER: Handles fixed position, offset from top, and full width.
    <div className="fixed top-4 left-0 w-full z-50 pointer-events-none">
    
      {/* INNER HEADER: Handles the Glassmorphism effect, centering, rounded corners, and shadow. */}
      <header className="mugna-header max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
                         bg-black/40 backdrop-blur-2xl rounded-xl 
                         shadow-2xl ring-1 ring-white/10 transition-all duration-300 
                         pointer-events-auto">

        <div className="flex justify-between items-center h-16">

          {/* 1. Logo/Brand - Strong White Text */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white tracking-wide uppercase hover:text-white/80 transition duration-150">
              MUGNA
            </Link>
          </div>

          {/* 2. Main Navigation Links - White Text */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    // Light gray text, pure white on hover
                    className="text-sm font-medium text-white/80 hover:text-white transition duration-150 relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. User & Utility Icons (Right Side) - Pure White icons */}
          <div className="flex items-center space-x-4">
            
            {/* Shopping Cart Icon */}
            <Link href="/cart" className="text-white hover:text-white/70 transition duration-150 relative p-1">
              <ShoppingCart size={20} aria-label="Shopping Cart" />
            </Link>

            {/* User Profile/Account */}
            <div className="relative">
              <button 
                onClick={toggleUserDropdown}
                className="flex items-center space-x-1 text-white hover:text-white/70 transition duration-150 p-1"
                aria-expanded={isUserDropdownOpen}
              >
                <User size={20} aria-label="User Account" />
                <ChevronDown size={14} className={`hidden md:block transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {/* User Dropdown Menu (Lighter Glass effect) */}
              {isAuthenticated && isUserDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white/10 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl overflow-hidden z-20">
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-white/20 transition duration-100">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-white hover:bg-white/20 transition duration-100">
                      Orders
                    </Link>
                    <hr className="my-1 border-white/30" />
                    <button onClick={() => console.log('Logout')} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/50 transition duration-100">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden text-white hover:text-white/70 p-1 transition duration-150"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- Mobile Menu Drawer (Glassmorphism Style) --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/60 backdrop-blur-xl border-t border-white/30 py-3 shadow-lg transition-all duration-300 ease-in-out">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20"
                  onClick={toggleMobileMenu} 
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile-only User links */}
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20"
                  onClick={toggleMobileMenu}
                >
                  My Account
                </Link>
                <Link
                  href="/cart"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20"
                  onClick={toggleMobileMenu}
                >
                  My Cart
                </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;