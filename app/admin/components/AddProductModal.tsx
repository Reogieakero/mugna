// app/admin/components/AddProductModal.tsx
"use client";

import { useState } from 'react';
import {
  X, Save, Upload, Package, Layers, Tag, AlignLeft, Image as ImageIcon, ChevronDown
} from 'lucide-react';
import { Product } from '@/lib/db/product.model';

// --- Configuration Data ---
const LEATHER_CATEGORIES = [
  'Bags',
  'Wallets',
  'Belts',
  'Jackets & Coats',
  'Accessories',
  'Footwear',
  'Other',
];

// --- Style Configuration (Black & White Palette) ---
const primaryColor = '#000000';    // Primary action color (similar to var(--foreground))
const secondaryColor = '#475569';  // Secondary text color (from login label)
const dangerColor = '#ef4444';     // Keeping standard red for errors/danger
const borderColor = '#e4e4e7';     // Light border color (from login separator)
const lightBg = '#f4f4f5';         // Lightest background (from login input BG)
const darkText = '#1f2937';        // Standard dark text
const lightText = '#ffffff';       // Modal/Form Background

const MODAL_RADIUS = '0.75rem';
const INPUT_RADIUS = '0.5rem';

/* --------------------------------------------------------
    ⭐ CUSTOM DROPDOWN ITEM COMPONENT & STYLES (for hover)
-------------------------------------------------------- */

const dropdownItemStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  cursor: 'pointer',
  borderBottom: `1px solid ${borderColor}`,
  color: darkText,
  fontSize: '0.9rem',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  userSelect: 'none',
};

const dropdownItemHoverStyle: React.CSSProperties = {
  backgroundColor: lightBg, // Light background on hover
  color: primaryColor,      // Black text on hover
};

interface DropdownItemProps {
  category: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function DropdownItem({ category, onClick }: DropdownItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Combine base style with hover style if hovered
  const currentStyle = {
    ...dropdownItemStyle,
    ...(isHovered ? dropdownItemHoverStyle : {}),
  };

  return (
    <div
      style={currentStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {category}
    </div>
  );
}


/* --------------------------------------------------------
    MAIN MODAL COMPONENT
-------------------------------------------------------- */

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product?: Product) => void;
}

const initialFormState = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: LEATHER_CATEGORIES[0],
};

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for custom dropdown visibility
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (type === 'number' || name === 'price' || name === 'stock')
              ? parseFloat(value) || 0
              : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
    } else {
        setImageFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name || formData.price <= 0 || formData.stock < 0) {
        setError('Please fill out required fields (Name, Price > 0, Stock >= 0).');
        setIsSubmitting(false);
        return;
      }

      const formToSend = new FormData();

      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        formToSend.append(key, typeof value === 'number' ? value.toString() : value);
      });

      if (imageFile) {
        formToSend.append('image', imageFile);
      }

      const response = await fetch("/api/admin/products", {
        method: 'POST',
        body: formToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add product on server.');
      }

      onProductAdded(data.product);
      setFormData(initialFormState);
      setImageFile(null);
      onClose();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during saving.";
      console.error("Product creation error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>

        <form onSubmit={handleSubmit} style={formStyle}>

          <div style={modalHeaderStyle}>
            <div style={modalTitleContainerStyle}>
                <h2 style={modalTitleStyle}>
                  <Package size={24} style={{ marginRight: '0.75rem' }} />
                  Add New Product
                </h2>
            </div>

            <div style={headerActionStyle}>
              <button type="button" onClick={onClose} disabled={isSubmitting} style={cancelButtonStyle}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
                <Save size={16} style={{ marginRight: '0.5rem' }} />
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>

              <button onClick={onClose} style={closeButtonStyle} title="Close" disabled={isSubmitting}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div style={formBodyStyle}>
            {error && <div style={errorStyle}>{error}</div>}

            {/* NAME */}
            <div style={formGroupStyle}>
              <label htmlFor="name" style={labelStyle}>
                <Tag size={14} style={{ marginRight: '0.4rem' }}/>
                Product Name <span style={requiredStarStyle}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="E.g., Premium Leather Satchel Bag"
              />
            </div>

            {/* DESCRIPTION */}
            <div style={formGroupStyle}>
              <label htmlFor="description" style={labelStyle}>
                <AlignLeft size={14} style={{ marginRight: '0.4rem' }}/>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                style={textareaStyle}
                placeholder="A brief description detailing features, material, and unique selling points."
              />
            </div>

            {/* PRICE + STOCK */}
            <div style={formRowStyle}>
              <div style={formRowItemStyle}>
                <label htmlFor="price" style={labelStyle}>
                  {/* UPDATED: Changed DollarSign icon to Peso sign (₱) */}
                  <span style={{ marginRight: '0.4rem', fontWeight: 'bold', fontSize: '1rem', color: darkText }}>₱</span>
                  Price <span style={requiredStarStyle}>*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price.toString()}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  style={inputStyle}
                  placeholder="0.00"
                />
              </div>
              <div style={formRowItemStyle}>
                <label htmlFor="stock" style={labelStyle}>
                  <Layers size={14} style={{ marginRight: '0.4rem' }}/>
                  Stock <span style={requiredStarStyle}>*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock.toString()}
                  onChange={handleChange}
                  min="0"
                  required
                  style={inputStyle}
                  placeholder="0"
                />
              </div>
            </div>

            {/* CUSTOM CATEGORY DROPDOWN */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <Tag size={14} style={{ marginRight: '0.4rem' }}/>
                Category
              </label>

              <div
                style={dropdownWrapperStyle}
                onClick={() => setIsCategoryOpen(prev => !prev)}
              >
                <span>{formData.category}</span>
                <ChevronDown size={18} />

                {isCategoryOpen && (
                  <div style={dropdownListStyle}>
                    {LEATHER_CATEGORIES.map((cat) => (
                      <DropdownItem 
                        key={cat}
                        category={cat}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents click from bubbling and re-toggling
                          setFormData(prev => ({ ...prev, category: cat }));
                          setIsCategoryOpen(false); // Closes the dropdown
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <p style={hintTextStyle}>Select the best fit for your leather product.</p>
            </div>

            {/* FILE INPUT */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <ImageIcon size={14} style={{ marginRight: '0.4rem' }}/>
                Product Image
              </label>
              <div style={fileInputWrapperStyle}>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} style={hiddenInputStyle}/>

                <label htmlFor="image" style={fileLabelStyle}>
                  <Upload size={18} style={{ marginRight: '0.75rem', color: primaryColor }} />
                  <span style={fileTextLabelStyle}>
                    {imageFile ? imageFile.name : 'Choose file or drag here'}
                  </span>
                  {imageFile && (
                    <span style={fileSizeStyle}>
                      ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </label>

                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  style={removeFileButtonStyle}
                  title="Remove image"
                  disabled={!imageFile}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
    STYLES 
------------------------------------------------------------------- */

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0, left: 0, right: 0, bottom: 0,
  // Grayscale equivalent of login's backdrop rgba(0, 0, 0, 0.75)
  backgroundColor: 'rgba(0, 0, 0, 0.75)', 
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: lightText, // #ffffff
  borderRadius: MODAL_RADIUS,
  width: '90%',
  maxWidth: '800px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Login shadow style
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const modalHeaderStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '1.5rem',
  backgroundColor: lightBg, // #f4f4f5
};

const modalTitleContainerStyle = { flexShrink: 0 };

const headerActionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginLeft: 'auto',
};

const formBodyStyle: React.CSSProperties = {
  padding: '2rem 1.5rem',
  maxHeight: 'calc(90vh - 80px)',
  overflowY: 'auto',
  flexGrow: 1,
  borderTop: `1px solid ${borderColor}`, // #e4e4e7
};

const modalTitleStyle = {
  margin: 0, fontSize: '1.25rem', fontWeight: '700', color: darkText,
  display: 'flex', alignItems: 'center',
};

const closeButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  color: secondaryColor, // #475569
  borderRadius: '0.375rem',
};

const formGroupStyle = { marginBottom: '1.5rem' };

const formRowStyle = { display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' };
const formRowItemStyle = { flex: 1 };

const labelStyle = {
  display: 'flex', alignItems: 'center',
  marginBottom: '0.5rem',
  fontWeight: '600',
  fontSize: '0.875rem',
  color: secondaryColor, // #475569
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const requiredStarStyle = { color: dangerColor, marginLeft: '0.25rem', fontWeight: '700' };

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: `1px solid ${borderColor}`, // #e4e4e7
  borderRadius: INPUT_RADIUS,
  fontSize: '1rem',
  color: darkText,
  backgroundColor: lightBg, // #f4f4f5
};

const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', minHeight: '80px' }; 

const baseButtonStyle = {
  display: 'flex', alignItems: 'center',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: '0.2s',
};

const cancelButtonStyle = { 
  ...baseButtonStyle, 
  backgroundColor: borderColor, // #e4e4e7 (light gray)
  color: darkText 
};
const submitButtonStyle = { 
  ...baseButtonStyle, 
  backgroundColor: primaryColor, // #000000 (black)
  color: lightText // #ffffff (white)
};

const errorStyle = {
  backgroundColor: '#fef2f2',
  color: dangerColor,
  padding: '1rem',
  borderRadius: '0.5rem',
  marginBottom: '1.5rem',
  border: `1px solid ${dangerColor}`,
};

const hiddenInputStyle = { display: 'none' };

const fileInputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  border: `2px dashed ${borderColor}`, // #e4e4e7
  borderRadius: INPUT_RADIUS,
  backgroundColor: lightBg, // #f4f4f5
};

const fileLabelStyle = {
  flexGrow: 1,
  padding: '1rem',
  cursor: 'pointer',
  color: secondaryColor, // #475569
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
};

const fileTextLabelStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginRight: '0.5rem',
};

const fileSizeStyle = { color: secondaryColor, fontSize: '0.8rem' };

const removeFileButtonStyle = {
  backgroundColor: dangerColor,
  color: lightText,
  border: 'none',
  borderRadius: `0 ${INPUT_RADIUS} ${INPUT_RADIUS} 0`,
  padding: '1rem',
  cursor: 'pointer',
};

const hintTextStyle = { marginTop: '0.5rem', fontSize: '0.75rem', color: secondaryColor };

const dropdownWrapperStyle: React.CSSProperties = {
  ...inputStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  position: 'relative',
  userSelect: 'none',
  backgroundColor: lightBg, // #f4f4f5
};

const dropdownListStyle: React.CSSProperties = {
  position: 'absolute',
  top: '110%',
  left: 0,
  width: '100%',
  backgroundColor: lightText, // #ffffff
  border: `1px solid ${borderColor}`, // #e4e4e7
  borderRadius: INPUT_RADIUS,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  zIndex: 20,
  animation: 'fadeIn 0.15s ease-out',
  maxHeight: '200px',
  overflowY: 'auto',
};