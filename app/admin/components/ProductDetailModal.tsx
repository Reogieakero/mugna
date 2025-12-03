// app/admin/components/ProductDetailModal.tsx
import React from 'react';
import { Product } from "@/lib/db/product.model";
import { X, ShoppingBag, Edit, Award, Percent } from "lucide-react";
import Image from "next/image";

interface ProductDetailModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (id: number) => void;
}

// ⭐ NEW STYLE HELPER: Maps promotion type to color scheme (Copied from ProductCard)
const getPromotionTagStyles = (type: string) => {
    switch (type) {
        case 'Flash Deals':
            return { backgroundColor: '#ef4444', color: '#ffffff' }; // Red
        case 'Top Sellers':
            return { backgroundColor: '#f59e0b', color: '#1f2937' }; // Amber/Orange
        case 'Featured':
            return { backgroundColor: '#10b981', color: '#ffffff' }; // Green
        case 'New Arrival':
            return { backgroundColor: '#3b82f6', color: '#ffffff' }; // Blue
        case 'Clearance':
            return { backgroundColor: '#6b7280', color: '#ffffff' }; // Gray
        default:
            return { backgroundColor: 'transparent', color: 'transparent' };
    }
}

// ⭐ NEW STYLE: For the promotion tag (Adapted from ProductCard for modal)
const promotionTagStyle = (type: string): React.CSSProperties => ({
    position: 'absolute',
    top: '1rem', // Slightly larger margin for the modal
    right: '1rem',
    padding: '0.4rem 0.8rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem', // Slightly larger font size for the modal
    fontWeight: '700',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...getPromotionTagStyles(type),
});

export default function ProductDetailModal({ product, isOpen, onClose, onEdit }: ProductDetailModalProps) {
    if (!isOpen) return null;

    const imageUrl = product.imageUrl || '/images/placeholder.jpg'; 
    const isImageValid = product.imageUrl && product.imageUrl !== '';

    // Helper function to render image or placeholder (Copied from ProductCard)
    const renderProductImage = (style: React.CSSProperties, size: number) => (
        isImageValid ? (
            <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes={size.toString() + "px"}
                style={{ objectFit: "cover", ...style }}
            />
        ) : (
            <div style={{ ...placeholderImageStyle, ...style, position: 'absolute' }}>
                <ShoppingBag size={size / 10} color="#9ca3af" />
                <p style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>Image Not Available</p>
            </div>
        )
    );

    // Prevent clicking inside the modal from closing it
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div style={modalBackdropStyle} onClick={onClose}>
            <div style={modalContainerStyle} onClick={handleContentClick}>
                
                {/* Modal Header */}
                <div style={modalHeaderStyle}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{product.name}</h2>
                    <button style={modalCloseButtonStyle} onClick={onClose} title="Close">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Modal Body (Scrollable Content) */}
                <div style={modalBodyStyle}>
                    
                    {/* Image Section */}
                    <div style={modalImageWrapperStyle}>
                        {renderProductImage({ borderRadius: '0.5rem' }, 500)}
                        
                        {/* ⭐ NEW: PROMOTION TAG - Top Right Corner ⭐ */}
                        {product.promotionType && product.promotionType !== 'None' && (
                            <div style={promotionTagStyle(product.promotionType)}>
                                {product.promotionType}
                                {/* Conditional discount display for Flash Deals */}
                                {product.promotionType === 'Flash Deals' && product.discount > 0 && 
                                    <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                                        (-{product.discount}%)
                                    </span>
                                }
                            </div>
                        )}
                        {/* ⭐ END NEW PROMOTION TAG ⭐ */}

                    </div>

                    {/* Product Attributes Row */}
                    <div style={attributesRowStyle}>
                        <p style={attributeItemStyle}> 
                            <span style={attributeLabelStyle}>Category:</span> 
                            <span style={attributeValueStyle}>{product.category || 'N/A'}</span>
                        </p>
                        
                        {/* ⭐ NEW: Promotion Attribute Display ⭐ */}
                        <p style={attributeItemStyle}>
                            <span style={attributeLabelStyle}><Award size={14} style={{marginRight: '0.3rem'}} /> Promotion:</span> 
                            <span style={attributeValueStyle}>{product.promotionType || 'None'}</span>
                        </p>
                        
                        {/* ⭐ NEW: Discount Attribute Display (Conditional) ⭐ */}
                        {product.promotionType === 'Flash Deals' && product.discount > 0 && (
                            <p style={attributeItemStyle}>
                                <span style={attributeLabelStyle}><Percent size={14} style={{marginRight: '0.3rem'}} /> Discount:</span> 
                                <span style={{ ...attributeValueStyle, color: '#ef4444' }}>{product.discount}% OFF</span>
                            </p>
                        )}
                    </div>
                    
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', borderTop: '1px dashed #e5e7eb', paddingTop: '1rem' }}>
                        Full Description
                    </h3>

                    {/* Description Area */}
                    <p style={{ color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {product.description || 'No detailed description provided.'}
                    </p>
                </div>

                {/* Modal Footer (Sticky Price and Stock) */}
                <div style={modalFooterStyle}>
                    <div style={detailItemStyle}>
                        <span style={detailLabelStyle}>Current Price:</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                            ₱{product.price.toFixed(2)}
                        </span>
                    </div>
                    <div style={detailItemStyle}>
                        <span style={detailLabelStyle}>Available Stock:</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', ...stockStyle(product.stock) }}>
                            {product.stock}
                        </span>
                    </div>
                    {/* UPDATED: Icon-only Edit button */}
                    <button
                        onClick={() => { onEdit(product.id); onClose(); }} 
                        style={modalEditIconStyle}
                        title="Edit Product"
                    >
                        <Edit size={20} /> 
                    </button>
                </div>
            </div>
        </div>
    );
}


/* ============================== */
/*     MODAL STYLES (modalEditIconStyle is NEW)               */
/* ============================== */

// Reusable styles for price/stock display
const detailItemStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const detailLabelStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' };
const placeholderImageStyle: React.CSSProperties = {
    position: 'absolute', 
    top: 0, bottom: 0, left: 0, right: 0,
    display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center', 
    color: '#9ca3af',
};
const stockStyle = (stock: number): React.CSSProperties => ({ color: stock > 10 ? '#10b981' : stock > 0 ? '#f59e0b' : '#ef4444' });


// Modal backdrop (the dark overlay)
const modalBackdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

// Modal container - uses flex column layout for Header/Body/Footer
const modalContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    width: '90%',
    maxWidth: '600px',
    height: 'auto',
    maxHeight: '90vh',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
};

// Modal Header
const modalHeaderStyle: React.CSSProperties = {
    padding: '1.25rem 2rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
};

// Close button (inside header)
const modalCloseButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '0.5rem',
    borderRadius: '50%',
    transition: 'color 0.15s',
};

// Modal Body (Scrollable Content)
const modalBodyStyle: React.CSSProperties = {
    padding: '1.5rem 2rem',
    overflowY: 'auto',
    flexGrow: 1,
};

// Modal image (larger)
const modalImageWrapperStyle: React.CSSProperties = {
    position: 'relative', 
    width: '100%', 
    paddingTop: '60%', 
    backgroundColor: '#f3f4f6', 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderRadius: '0.5rem',
    overflow: 'hidden',
};

// Modal Footer (Sticky Price and Stock)
const modalFooterStyle: React.CSSProperties = {
    padding: '1.25rem 2rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    gap: '1rem',
};

// NEW: Style for the Icon-Only Edit Button in the Modal Footer
const modalEditIconStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#2563eb', // Blue icon color
    border: 'none',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    transition: 'background-color 0.2s',
    // '&:hover': { backgroundColor: '#e0f2fe' } 
};

// ⭐ NEW: Style for product attributes row
const attributesRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '1.5rem',
};

const attributeItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const attributeLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
    marginRight: '0.5rem',
    display: 'flex',
    alignItems: 'center',
};

const attributeValueStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
};