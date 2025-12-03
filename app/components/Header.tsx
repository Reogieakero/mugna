// Header.tsx (A new component file - Sleek Black & White)

import Link from 'next/link';
import React from 'react';

// You might need icons. Assuming you're using react-icons or similar:
// import { User, ShoppingCart, Menu } from 'lucide-react'; // Example professional icons

const Header = () => {
  // Define navigation items
  const navItems = [
    { name: 'Products', href: '/products' },
    { name: 'Crafters', href: '/crafters' },
    { name: 'Contact', href: '/contact' },
    // Optionally add a 'Shop' or 'Cart' link here if applicable
  ];

  return (
    // Use a sticky/fixed header for better UX on scroll
    // Class names are suggestive, tailor them to your CSS framework (e.g., Tailwind)
    <header className="mugna-header sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* 1. Logo/Brand - Strong Black Text */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-extrabold text-black tracking-wider uppercase hover:text-gray-700 transition duration-150">
              MUGNA
            </Link>
          </div>

          {/* 2. Main Navigation Links - Centered, Subtle */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-black transition duration-150 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. User & Utility Icons (Right Side) */}
          <div className="flex items-center space-x-4">
            
            {/* Utility Icon Example: Shopping Cart */}
            <Link href="/cart" className="text-gray-700 hover:text-black transition duration-150 p-1 relative">
              {/* Replace with an actual icon component like <ShoppingCart size={20} /> */}
              <span className="text-xl">🛒</span> 
              {/* Optional: Badge for items in cart */}
              {/* <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">3</span> */}
            </Link>

            {/* User Profile/Avatar */}
            <Link href="/profile" className="text-gray-700 hover:text-black transition duration-150 p-1">
              {/* Replace with an actual icon component like <User size={20} /> */}
              <span className="text-xl">👤</span>
            </Link>

            {/* Mobile Menu Button (Visible on Small Screens) */}
            <button className="md:hidden text-gray-700 hover:text-black p-1">
              {/* Replace with an actual icon component like <Menu size={20} /> */}
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;