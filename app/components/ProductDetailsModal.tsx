// /app/components/ProductDetailsModal.tsx - FINAL UPDATE
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ProductDetailsModal.module.css';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  }).format(price);
};

interface ProductDetails {
  id: number;
  name: string;
  // REMOVED: crafter: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string; // Added to replace crafter in the header
}

interface ProductDetailsModalProps {
  product: ProductDetails;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) {
    return null;
  }

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of product ${product.id} to cart.`);
    onClose(); 
  };

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close product details">
          <X size={24} />
        </button>

        <div className={styles.modalBody}>
          <div className={styles.imageSection}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={450}
              className={styles.productImage}
              priority={false}
            />
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.infoContainer}>
              {/* UPDATED: Displaying Category instead of Crafter */}
              <p className={styles.productCategory}>{product.category.toUpperCase()}</p> 
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productPrice}>{formatPrice(product.price)}</p>

              <hr className={styles.divider} />

              <div className={styles.description}>
                <h3>Product Description</h3>
                <p>{product.description}</p>
              </div>

            </div>

            <div className={styles.modalActions}>
              <div className={styles.quantitySelector}>
                <button
                  className={styles.quantityButton}
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className={styles.quantityDisplay}>{quantity}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() => updateQuantity(1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button className={styles.addToCartButton} onClick={handleAddToCart}>
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}