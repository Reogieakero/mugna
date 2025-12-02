// app/admin/components/ProductCard.tsx
"use client";

import { Product } from "@/lib/db/product.model";
import { Edit, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image"; 

interface ProductCardProps {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  // Use the URL saved by the API, fall back to a placeholder path if empty
  const imageUrl = product.imageUrl || '/images/placeholder.jpg'; 
  const isImageValid = product.imageUrl && product.imageUrl !== '';

  return (
    <div style={cardStyle}>
      {/* Product Image Display */}
      <div style={imageWrapperStyle}>
        {isImageValid ? (
            <Image
                src={imageUrl} 
                alt={product.name}
                // Key change: Setting layout and objectFit properties
                fill 
                sizes="(max-width: 600px) 100vw, 300px" // Optimization hint for Next/Image
                style={{ objectFit: "cover", borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
            />
        ) : (
            <div style={placeholderImageStyle}>
                <ShoppingBag size={32} color="#9ca3af" />
                <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>Image Not Available</p>
            </div>
        )}
      </div>

      <div style={contentStyle}>
        <h3 style={titleStyle}>{product.name}</h3>
        <p style={categoryStyle}>{product.category || 'Uncategorized'}</p>
        
        <div style={detailsRowStyle}>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Price:</span>
            <span style={detailValueStyle}>${product.price.toFixed(2)}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Stock:</span>
            <span style={stockStyle(product.stock)}>{product.stock} in stock</span>
          </div>
        </div>
        
        <p style={descriptionStyle}>
          {product.description ? 
           `${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}` 
           : 'No description provided.'}
        </p>

        <div style={actionsStyle}>
          <button onClick={() => onEdit(product.id)} style={{ ...actionButtonStyle, backgroundColor: '#2563eb' }}>
            <Edit size={16} style={{ marginRight: '0.5rem' }} /> Edit
          </button>
          <button onClick={() => onDelete(product.id)} style={{ ...actionButtonStyle, backgroundColor: '#ef4444' }}>
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Polished Inline Styles for Card Format ---

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white', borderRadius: '0.75rem', 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
  overflow: 'hidden', 
  display: 'flex', flexDirection: 'column',
};

// Polished Image Wrapper: Uses padding-top to enforce a 3:2 aspect ratio (150/100 = 1.5)
const imageWrapperStyle: React.CSSProperties = {
    position: 'relative', 
    width: '100%', 
    paddingTop: '66.67%', // 3:2 Aspect Ratio (200px height / 300px width = 0.6667)
    backgroundColor: '#f3f4f6', 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
};

const placeholderImageStyle: React.CSSProperties = {
    position: 'absolute', 
    top: 0, bottom: 0, left: 0, right: 0,
    display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center', 
    color: '#9ca3af',
}

const contentStyle: React.CSSProperties = { padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' };
const titleStyle: React.CSSProperties = { fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: '#1f2937' };
const categoryStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' };
const detailsRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px dashed #e5e7eb', paddingBottom: '0.75rem' };
const detailItemStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const detailLabelStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' };
const detailValueStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: '700', color: '#1f2937' };
const stockStyle = (stock: number): React.CSSProperties => ({ fontSize: '1rem', fontWeight: '700', color: stock > 10 ? '#10b981' : stock > 0 ? '#f59e0b' : '#ef4444' });
const descriptionStyle: React.CSSProperties = { fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', flexGrow: 1 };
const actionsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginTop: 'auto' };
const actionButtonStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 0.8rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', color: 'white', fontSize: '0.875rem', width: '48%', transition: 'background-color 0.2s, opacity 0.2s' };