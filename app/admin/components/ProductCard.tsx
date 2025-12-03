// app/admin/components/ProductCard.tsx
"use client";

import { useState } from "react";
import { Product } from "@/lib/db/product.model";
import { Edit, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import ProductDetailModal from './ProductDetailModal';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Assuming this exists
import EditProductModal from './EditProductModal'; // <--- NEW IMPORT

interface ProductCardProps {
  product: Product;
  // NOTE: onEdit now needs to trigger the state in the parent component 
  // to load the correct product data into the EditModal if it were in the parent.
  // Since we are adding the EditModal here, onEdit simply opens the modal.
  onEdit: (product: Product) => void; // <--- The handler in the parent should update the product list
  onDelete: (id: number) => void;
  // New handler for when the product is successfully updated via the modal
  onProductUpdated: (updatedProduct: Product) => void; 
}

export default function ProductCard({ 
    product, 
    onEdit: onEditFromProps, // Renamed to avoid conflict
    onDelete,
    onProductUpdated,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // <--- NEW STATE
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const imageUrl = product.imageUrl || '/images/placeholder.jpg';
  const isImageValid = product.imageUrl && product.imageUrl !== '';
  
  const handleCardClick = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Edit Handlers
  const openEditModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  // Delete Handlers
  const openDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteConfirmOpen(true);
  };
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);
  const handleConfirmDelete = () => {
    onDelete(product.id);
    closeDeleteConfirm();
  };


  // Prevents the card click (modal open) when clicking action buttons
  const handleActionClick = (e: React.MouseEvent) => e.stopPropagation();

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

  // Handle successful update from the Edit Modal
  const handleProductUpdated = (updatedProduct: Product) => {
      onProductUpdated(updatedProduct); // Update the list in the parent
      closeEditModal(); // Close the modal
  }


  return (
    <>
      {/* Product Card */}
      <div 
        style={isHovered ? { ...cardStyle, ...cardHoverStyle, cursor: 'pointer' } : { ...cardStyle, cursor: 'pointer' }} 
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div style={imageWrapperStyle}>
          {renderProductImage({ borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }, 300)}
        </div>

        <div style={contentStyle}>
          {/* Title/Category & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={titleStyle}>{product.name}</h3>
              <p style={categoryStyle}>{product.category || 'Uncategorized'}</p>
            </div>
            
            <div style={actionsStyle} onClick={handleActionClick}>
              {/* EDIT ICON */}
              <button 
                onClick={openEditModal} // <--- UPDATED HANDLER
                style={editButtonStyle} 
                title="Edit"
              >
                <Edit size={18} />
              </button>

              {/* DELETE ICON */}
              <button 
                onClick={openDeleteConfirm} 
                style={deleteButtonStyle}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          {/* DETAILS and DESCRIPTION */}
          <div style={detailsRowStyle}>
            <div style={detailItemStyle}>
              <span style={detailLabelStyle}>Price:</span>
              <span style={detailValueStyle}>₱{product.price.toFixed(2)}</span>
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

        </div>
      </div>
      
      {/* Product Detail Modal */}
      <ProductDetailModal
          product={product}
          isOpen={isModalOpen}
          onClose={closeModal}
          // The onEdit function passed to the detail modal should also open the edit form
          onEdit={() => setIsEditModalOpen(true)} 
      />

      {/* Edit Product Modal */}
      {/* We pass the full product object to initialize the form */}
      <EditProductModal
          product={product}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onProductUpdated={handleProductUpdated}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
          productName={product.name}
          isOpen={isDeleteConfirmOpen}
          onClose={closeDeleteConfirm}
          onConfirm={handleConfirmDelete}
      />
    </>
  );
}

/* ============================== */
/* STYLES (Kept as provided)      */
/* ============================== */

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white', 
  borderRadius: '0.75rem', 
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
  overflow: 'hidden', 
  display: 'flex', 
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out', 
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#e5e7eb',
};

const cardHoverStyle: React.CSSProperties = {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    borderColor: '#d1d5db', 
};

const imageWrapperStyle: React.CSSProperties = {
  position: 'relative', 
  width: '100%', 
  paddingTop: '66.67%',
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
};

const contentStyle: React.CSSProperties = { padding: '1.25rem', display: 'flex', flexDirection: 'column' }; 
const titleStyle: React.CSSProperties = { fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem', color: '#1f2937' };
const categoryStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

const detailsRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px dashed #e5e7eb', paddingBottom: '0.75rem' };
const detailItemStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const detailLabelStyle: React.CSSProperties = { fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' };
const detailValueStyle: React.CSSProperties = { fontSize: '1rem', fontWeight: '700', color: '#1f2937' };
const stockStyle = (stock: number): React.CSSProperties => ({ fontSize: '1rem', fontWeight: '700', color: stock > 10 ? '#10b981' : stock > 0 ? '#f59e0b' : '#ef4444' });
const descriptionStyle: React.CSSProperties = { fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' };

const actionsStyle: React.CSSProperties = { 
  display: 'flex', 
  gap: '0.5rem',
  marginTop: '0', 
};

const iconButtonStyle: React.CSSProperties = { 
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px', 
  height: '32px', 
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  color: '#6b7280',
  transition: 'color 0.15s ease-in-out',
  padding: '0',
};

const editButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    color: '#2563eb',
};

const deleteButtonStyle: React.CSSProperties = {
    ...iconButtonStyle,
    color: '#ef4444',
};