// /app/home/FeaturedProducts.tsx
"use client";

import Link from 'next/link';
import styles from "./HomePage.module.css";

// Sample data for the featured products section (kept here for simplicity)
const featuredProducts = [
  { id: 1, name: 'Hand-Carved Wooden Bowl', crafter: 'Maria Dela Cruz', price: '₱1,200', image: '/product-bowl.jpg' },
  { id: 2, name: 'Woven Abaca Basket', crafter: 'Lito Reyes', price: '₱850', image: '/product-basket.jpg' },
  { id: 3, name: 'Intricate Silver Pendant', crafter: 'The Jewelry Workshop', price: '₱3,500', image: '/product-pendant.jpg' },
  { id: 4, name: 'Modern Textile Art', crafter: 'Sining Collective', price: '₱2,400', image: '/product-textile.jpg' },
];

// Helper to stagger load elements (reusing the logic from the main page)
const getStaggerClass = (delay: number) =>
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

export default function FeaturedProducts() {
  return (
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
            {/* NOTE: Consider extracting this product link into a ProductCard component */}
            <div className={styles.productImagePlaceholder} style={{ backgroundImage: `url(${product.image})` }}>
              {/*  */} 
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
  );
}