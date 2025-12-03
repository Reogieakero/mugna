// /app/home/ProductCard.tsx - FINAL UPDATE
import Link from 'next/link';
import Image from 'next/image';
import styles from "./ProductCard.module.css"; 
import { ShoppingCart } from 'lucide-react'; 
import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  // REMOVED: crafter: string; 
  price: number;
  imageUrl: string;
  staggerClass?: string;
  promotionType?: string; 
  discount?: number;
  onClick?: (e: React.MouseEvent) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', { 
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0, 
  }).format(price);
};

export default function ProductCard({
  id,
  name,
  // REMOVED: crafter,
  price,
  imageUrl,
  staggerClass = "",
  promotionType,
  discount = 0,
  onClick,
}: ProductCardProps) {
    
  const showDiscountBadge = promotionType === 'Featured' && discount > 0;
    
  return (
    <Link 
      href={`/products/${id}`}
      className={`${styles.productCard} ${staggerClass}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault(); 
          onClick(e);
        }
      }}
    >
      <div className={styles.productImageContainer}>
        {showDiscountBadge && (
            <div className={styles.discountBadge}>
                {discount}% OFF
            </div>
        )}

        <div className={styles.featuredTagRight}>
            FEATURED CRAFTS
        </div>

        <Image
          src={imageUrl}
          alt={name}
          width={400} 
          height={250} 
          className={styles.productImage}
          priority={false}
        />
      </div>
      <div className={styles.productInfo}>
        
        {/* NOTE: If you need to show the Category here, ensure 'category' is passed in props */}
        <p className={styles.productCategory}>HANDICRAFTS</p>
        
        <h3 className={styles.productName}>{name}</h3>
        
        <p className={styles.productPrice}>{formatPrice(price)}</p>

        <div className={styles.productActions}>
            <button 
                className={styles.buyCraftButton}
                onClick={(e) => { e.preventDefault(); console.log('Buy Craft clicked for product', id); }}
            >
                BUY CRAFT 
            </button>
            <button 
                className={styles.quickCartButton}
                onClick={(e) => { e.preventDefault(); console.log('Quick Cart clicked for product', id); }}
            >
                {/* Lucide ShoppingCart Icon */}
                <ShoppingCart size={22} className={styles.cartIcon} />
            </button>
        </div>
      </div>
    </Link>
  );
}