// /app/home/page.tsx
"use client";

import Link from 'next/link';
import styles from "./HomePage.module.css";
// Assuming you have a Header component from a file like 'components/Header.tsx'
// import Header from '../../components/Header'; 
import React from 'react';

// Sample data for the featured products section
const featuredProducts = [
  { id: 1, name: 'Hand-Carved Wooden Bowl', crafter: 'Maria Dela Cruz', price: '₱1,200', image: '/product-bowl.jpg' },
  { id: 2, name: 'Woven Abaca Basket', crafter: 'Lito Reyes', price: '₱850', image: '/product-basket.jpg' },
  { id: 3, name: 'Intricate Silver Pendant', crafter: 'The Jewelry Workshop', price: '₱3,500', image: '/product-pendant.jpg' },
  { id: 4, name: 'Modern Textile Art', crafter: 'Sining Collective', price: '₱2,400', image: '/product-textile.jpg' },
];

// Helper to stagger load elements (reusing the logic from the login page)
const getStaggerClass = (delay: number) =>
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      {/* <Header />  // Uncomment if you place Header in layout or directly here */}
      
      {/* 1. Hero Section - Reuses the Login Page Background Image */}
      <section 
        className={styles.heroSection}
        style={{
          // Reuse the same image path and styling as the login page
          backgroundImage: `url('/market-shop.jpg')`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className={styles.backgroundOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} ${getStaggerClass(200)}`}>
            Crafted with Passion. Shared with the World.
          </h1>
          <p className={`${styles.heroSubtitle} ${getStaggerClass(400)}`}>
            Discover unique, handcrafted items from the heart of the artisan community.
          </p>
          <div className={`${styles.heroActions} ${getStaggerClass(600)}`}>
            <Link href="/products" className={styles.primaryButton}>
              Explore Products
            </Link>
            <Link href="/crafters" className={styles.secondaryButton}>
              Meet the Crafters
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>✨ Featured Artifacts</h2>
        <p className={styles.sectionSubtitle}>Handpicked items showcasing the best of Mugna&apos;s artisans.</p>
        
        <div className={styles.productGrid}>
          {featuredProducts.map((product, index) => (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className={`${styles.productCard} ${getStaggerClass(800 + index * 100)}`}
            >
              {/* NOTE: Replace with actual Image component for optimization */}
              <div className={styles.productImagePlaceholder} style={{ backgroundImage: `url(${product.image})` }}>
                {/*  */} 
              </div>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productCrafter}>by **{product.crafter}**</p>
              <p className={styles.productPrice}>{product.price}</p>
            </Link>
          ))}
        </div>
        <div className={styles.allProductsLinkContainer}>
          <Link href="/products" className={styles.allProductsLink}>
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* 3. Crafter Call-to-Action */}
      <section className={styles.crafterCTA}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Are you a Crafter?</h2>
          <p className={styles.ctaSubtitle}>
            Join the Mugna community and sell your creations to a global audience.
          </p>
          <Link href="/signup" className={styles.ctaButton}>
            Start Selling Today
          </Link>
        </div>
      </section>
      
      {/* 4. Footer (You will likely use a separate Footer component) */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Mugna. All rights reserved.</p>
      </footer>
    </div>
  );
}