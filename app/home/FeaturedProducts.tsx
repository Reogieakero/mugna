// /app/home/FeaturedProducts.tsx - FINAL UPDATE
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from "./HomePage.module.css";
import ProductCard from './ProductCard'; 
import ProductDetailsModal from '../components/ProductDetailsModal'; 

// Define the Product interface
interface Product {
  id: number;
  name: string;
  description: string; 
  price: number; 
  stock: number;
  category: string;
  imageUrl: string;
  promotionType: string;
  discount: number;
}

// Define the incoming API Product structure 
interface APIProduct {
  id: number;
  name: string;
  description?: string;
  price: number; 
  stock: number;
  category: string;
  imageUrl: string;
  promotionType: string;
  discount: number;
}

// Helper to stagger load elements
const getStaggerClass = (delay: number) =>
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };


  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/home/featured');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const incomingProducts = data.products as APIProduct[];

        const productsWithCleanData: Product[] = incomingProducts.map((product) => ({
          ...product,
          description: product.description || 'This is a beautifully crafted artifact, available for purchase now.' 
        }));

        setFeaturedProducts(productsWithCleanData);
      } catch (e) {
        console.error("Failed to fetch featured products:", e);
        setError('Failed to load featured products.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Featured Artifacts</h2>
        <p className={styles.sectionSubtitle}>Loading handpicked items...</p>
        <div className={styles.productGrid}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`${styles.productCard} ${getStaggerClass(800 + index * 100)}`}>
              <div className={styles.productImageContainer} style={{backgroundColor: '#e5e7eb'}}></div>
              <div className={styles.productInfo}>
                <div style={{height: '1.25rem', backgroundColor: '#d1d5db', marginBottom: '0.5rem', borderRadius: '4px'}}></div>
                <div style={{height: '0.9rem', width: '60%', backgroundColor: '#e5e7eb', marginBottom: '1rem', borderRadius: '4px'}}></div>
                <div style={{height: '1.1rem', width: '40%', backgroundColor: '#d1d5db', borderRadius: '4px'}}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <section className={styles.featuredSection}><p className={styles.sectionSubtitle} style={{ color: 'red' }}>{error}</p></section>;
  }

  if (featuredProducts.length === 0) {
    return (
      <section className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Featured Artifacts</h2>
        <p className={styles.sectionSubtitle}>No featured products available at the moment.</p>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Featured Artifacts</h2>
      <p className={styles.sectionSubtitle}>Handpicked items showcasing the best of Mugna&apos;s artisans.</p>
      
      <div className={styles.productGrid}>
        {featuredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            {...product}
            // REMOVED: Temporary crafter assignment
            staggerClass={getStaggerClass(800 + index * 100)}
            onClick={() => handleCardClick(product)}
          />
        ))}
      </div>

      <div className={styles.allProductsLinkContainer}>
        <Link href="/products" className={styles.allProductsButton}>
          View All Products
        </Link>
      </div>

      {selectedProduct && (
        <ProductDetailsModal
          // The selectedProduct type now matches the ProductDetails interface
          product={selectedProduct} 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}