// /app/home/page.tsx
"use client";

// Import all the new components
import Header from '../components/Header'; // Assuming you uncommented this
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import CrafterCTA from './CrafterCTA';
import Footer from '../components/Footer'; // Assuming you moved Footer to /components

import styles from "./HomePage.module.css";
import React from 'react';

// NOTE: The featuredProducts data and getStaggerClass helper are no longer needed here 

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      
      {/* 1. Header (Uncommented) */}
      <Header />
      
      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Featured Products Section */}
      <FeaturedProducts />

      {/* 4. Crafter Call-to-Action */}
      <CrafterCTA />
      
      {/* 5. Footer */}
      <Footer />
    </div>
  );
}