// app/admin/components/EditProductModal.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  X, Save, Upload, Package, Layers, Tag, AlignLeft, Image as ImageIcon, ChevronDown
} from 'lucide-react';
import { Product } from '@/lib/db/product.model'; // Assuming this interface is defined

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

// --- Style Configuration ---
const primaryColor = '#000000';
const secondaryColor = '#475569';
const dangerColor = '#ef4444';
const borderColor = '#e4e4e7';
const lightBg = '#f4f4f5';
const darkText = '#1f2937';
const lightText = '#ffffff';

const MODAL_RADIUS = '0.75rem';
const INPUT_RADIUS = '0.5rem';

/* --------------------------------------------------------
    ⭐ CUSTOM DROPDOWN ITEM COMPONENT & STYLES
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
  backgroundColor: lightBg,
  color: primaryColor,
};

interface DropdownItemProps {
  category: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function DropdownItem({ category, onClick }: DropdownItemProps) {
  const [isHovered, setIsHovered] = useState(false);

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
    MAIN MODAL COMPONENT (Adapted for Edit)
-------------------------------------------------------- */

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product; // Existing product data is required
  onProductUpdated: (product: Product) => void;
}

// Helper to sanitize the product for form state
const getInitialFormState = (product: Product) => ({
  id: product.id,
  name: product.name || '',
  description: product.description || '',
  price: product.price || 0,
  stock: product.stock || 0,
  category: product.category || LEATHER_CATEGORIES[0],
  imageUrl: product.imageUrl || null, // Keep existing image URL
});

type FormDataType = ReturnType<typeof getInitialFormState>;

// Type for server response
interface ServerResponse {
  product?: Product;
  error?: string;
}

export default function EditProductModal({ isOpen, onClose, product, onProductUpdated }: EditProductModalProps) {
  const [formData, setFormData] = useState<FormDataType>(() => getInitialFormState(product));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  
  useEffect(() => {
      if (product) {
          setFormData(getInitialFormState(product));
          setImageFile(null);
          setError(null);
      }
  }, [product]);

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
        setFormData(prev => ({ ...prev, imageUrl: null })); 
    } else {
        setImageFile(null);
    }
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setFormData(getInitialFormState(product)); 
  }

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
        if (key !== 'id' && key !== 'imageUrl') { 
            const value = formData[key as keyof FormDataType];

            if (value !== null && value !== undefined) {
                let stringValue: string;
                if (typeof value === 'number') stringValue = value.toString();
                else if (typeof value === 'string') stringValue = value;
                else stringValue = '';
                if (stringValue) formToSend.append(key, stringValue); 
            }
        }
      });

      if (!imageFile) {
          formToSend.append('imageUrl', formData.imageUrl || 'null');
      } else {
          formToSend.append('image', imageFile); 
          formToSend.append('imageUrl', 'null');
      } 

      const response = await fetch(`/api/admin/products/${product.id}`, { 
        method: 'PUT',
        body: formToSend,
      });

      let updatedProductData: Product | undefined;
      let data: ServerResponse = {};

      if (response.status === 204) {
          updatedProductData = { 
              ...formData, 
              price: Number(formData.price), 
              stock: Number(formData.stock),
              imageUrl: formData.imageUrl || product.imageUrl,
          } as Product; 
      } else if (response.ok && response.status !== 204) {
          data = await response.json() as ServerResponse;
          updatedProductData = data.product;
      } else {
          try {
            data = await response.json() as ServerResponse;
          } catch {
            data.error = `HTTP Error ${response.status}: Failed to read error response.`;
          }
          throw new Error(data.error || `Failed to update product (HTTP ${response.status}).`);
      }
      
      if (!updatedProductData) {
        throw new Error("Product data not received after successful update.");
      }

      onProductUpdated(updatedProductData); 
      onClose();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during saving.";
      console.error("Product update error:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImageDisplay = imageFile ? imageFile.name : formData.imageUrl ? 'Image exists (Click to replace)' : 'Choose file or drag here';

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={modalHeaderStyle}>
            <div style={modalTitleContainerStyle}>
              <h2 style={modalTitleStyle}>
                <Package size={24} style={{ marginRight: '0.75rem' }} />
                Edit Product: {product.name}
              </h2>
            </div>

            <div style={headerActionStyle}>
              <button type="button" onClick={onClose} disabled={isSubmitting} style={cancelButtonStyle}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
                <Save size={16} style={{ marginRight: '0.5rem' }} />
                {isSubmitting ? 'Updating...' : 'Save Changes'}
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
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, category: cat }));
                          setIsCategoryOpen(false);
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
                    {currentImageDisplay}
                  </span>
                  {(imageFile || formData.imageUrl) && (
                    <span style={fileSizeStyle}>
                      ({imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Existing'})
                    </span>
                  )}
                </label>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={removeFileButtonStyle}
                  title="Remove image"
                  disabled={!imageFile && !formData.imageUrl}
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
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)',
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: lightText,
  borderRadius: MODAL_RADIUS,
  width: '90%',
  maxWidth: '800px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
  backgroundColor: lightBg,
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
  borderTop: `1px solid ${borderColor}`,
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
  color: secondaryColor,
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
  color: secondaryColor,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const requiredStarStyle = { color: dangerColor, marginLeft: '0.25rem', fontWeight: '700' };

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  border: `1px solid ${borderColor}`,
  borderRadius: INPUT_RADIUS,
  fontSize: '1rem',
  color: darkText,
  backgroundColor: lightBg,
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
  backgroundColor: borderColor,
  color: darkText
};
const submitButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: primaryColor,
  color: lightText
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
  border: `2px dashed ${borderColor}`,
  borderRadius: INPUT_RADIUS,
  backgroundColor: lightBg,
};

const fileLabelStyle = {
  flexGrow: 1,
  padding: '1rem',
  cursor: 'pointer',
  color: secondaryColor,
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
  backgroundColor: lightBg,
};

const dropdownListStyle: React.CSSProperties = {
  position: 'absolute',
  top: '110%',
  left: 0,
  width: '100%',
  backgroundColor: lightText,
  border: `1px solid ${borderColor}`,
  borderRadius: INPUT_RADIUS,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  zIndex: 20,
  animation: 'fadeIn 0.15s ease-out',
  maxHeight: '200px',
  overflowY: 'auto',
};
