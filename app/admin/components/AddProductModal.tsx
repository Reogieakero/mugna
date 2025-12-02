// app/admin/components/AddProductModal.tsx
"use client";

import { useState } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { Product } from '@/lib/db/product.model';

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
  category: '',
};

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      
      // Use FormData to correctly send files and text fields
      const formToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        formToSend.append(key, typeof value === 'number' ? value.toString() : value);
      });
      
      if (imageFile) {
        formToSend.append('image', imageFile); // 'image' must match the key used in the API route
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
        
        <div style={modalHeaderStyle}>
          <h2 style={modalTitleStyle}>Add New Product</h2>
          <button onClick={onClose} style={closeButtonStyle} title="Close" disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={errorStyle}>{error}</div>}

          <div style={formBodyStyle}>
            <div style={formGroupStyle}>
              <label htmlFor="name" style={labelStyle}>Product Name *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="E.g., Leather Satchel Bag"/>
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="description" style={labelStyle}>Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="A brief description of the product features and material."/>
            </div>

            <div style={formRowStyle}>
              <div style={{ ...formGroupStyle, flex: 1, marginRight: '1.5rem' }}>
                <label htmlFor="price" style={labelStyle}>Price *</label>
                <input type="number" id="price" name="price" value={formData.price.toString()} onChange={handleChange} min="0.01" step="0.01" required style={inputStyle} placeholder="0.00"/>
              </div>
              <div style={{ ...formGroupStyle, flex: 1 }}>
                <label htmlFor="stock" style={labelStyle}>Stock *</label>
                <input type="number" id="stock" name="stock" value={formData.stock.toString()} onChange={handleChange} min="0" required style={inputStyle} placeholder="0"/>
              </div>
            </div>

            <div style={formGroupStyle}>
                <label htmlFor="category" style={labelStyle}>Category</label>
                <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} style={inputStyle} placeholder="E.g., Bags, Apparel, Jewelry"/>
            </div>

            {/* FILE INPUT FIELD */}
            <div style={formGroupStyle}>
              <label htmlFor="image" style={labelStyle}>Product Image</label>
              <div style={fileInputWrapperStyle}>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} style={hiddenInputStyle}/>
                <label htmlFor="image" style={fileLabelStyle}>
                  <Upload size={18} style={{ marginRight: '0.5rem' }} />
                  {imageFile ? `File: ${imageFile.name}` : 'Click to upload image'}
                </label>
                {imageFile && (
                    <button type="button" onClick={() => setImageFile(null)} style={removeFileButtonStyle} title="Remove image">
                        <X size={16} />
                    </button>
                )}
              </div>
            </div>
          </div>
          
          <div style={modalFooterStyle}>
            <button type="button" onClick={onClose} disabled={isSubmitting} style={{ ...cancelButtonStyle, marginRight: '1rem' }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} style={submitButtonStyle}>
              <Save size={16} style={{ marginRight: '0.5rem' }} />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Inline Styles --- (as previously provided)
const modalOverlayStyle = { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(30, 41, 59, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)', transition: 'opacity 0.2s ease-in-out', };
const modalContentStyle = { backgroundColor: '#ffffff', borderRadius: '0.75rem', width: '90%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const, transform: 'scale(1)', };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem', };
const modalTitleStyle = { margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' };
const closeButtonStyle = { backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#9ca3af', transition: 'color 0.2s', };
const formBodyStyle = { padding: '1.5rem' };
const formGroupStyle = { marginBottom: '1.25rem' };
const formRowStyle = { display: 'flex', marginBottom: '1.25rem' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.875rem', color: '#374151', };
const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' as const, fontSize: '1rem', color: '#1f2937', transition: 'border-color 0.2s, box-shadow 0.2s', };
const modalFooterStyle = { padding: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f9fafb', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem', };
const baseButtonStyle = { display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', transition: 'background-color 0.2s, opacity 0.2s', };
const cancelButtonStyle = { ...baseButtonStyle, backgroundColor: '#e5e7eb', color: '#374151' };
const submitButtonStyle = { ...baseButtonStyle, backgroundColor: '#10b981', color: 'white' };
const errorStyle = { backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontWeight: '500', border: '1px solid #fca5a5' }
const hiddenInputStyle = { display: 'none' } as const;
const fileInputWrapperStyle = { display: 'flex', alignItems: 'center', border: '1px dashed #9ca3af', borderRadius: '0.5rem', padding: '0.5rem', backgroundColor: '#f9fafb', };
const fileLabelStyle = { flexGrow: 1, padding: '0.5rem 1rem', cursor: 'pointer', color: '#4b5563', fontWeight: '500', display: 'flex', alignItems: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, };
const removeFileButtonStyle = { backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.375rem', padding: '0.5rem', cursor: 'pointer', marginLeft: '0.5rem', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s', };