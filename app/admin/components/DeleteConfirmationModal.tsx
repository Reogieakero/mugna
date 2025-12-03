// app/admin/components/DeleteConfirmationModal.tsx
import React from 'react';

interface DeleteConfirmationModalProps {
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  productName,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  // Prevent closing when clicking inside the modal
  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div style={confirmOverlayStyle} onClick={onClose}>
      <div style={confirmModalStyle} onClick={handleModalClick}>
        <h3 style={confirmHeaderStyle}>Delete Product: {productName}</h3>
        <p style={confirmBodyStyle}>
          You are about to permanently delete this product. This action cannot be undone.
          Please confirm you wish to proceed with the removal of: {productName}.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            style={confirmCancelButtonStyle}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={confirmDeleteButtonStyle}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== */
/* STYLES (Moved from ProductCard.tsx) */
/* ============================== */

const confirmOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const confirmModalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
};

const confirmHeaderStyle: React.CSSProperties = { 
  marginBottom: '1rem', 
  fontSize: '1.25rem',
  fontWeight: 700, 
  color: '#b91c1c', 
  borderBottom: '1px solid #fee2e2', 
  paddingBottom: '0.5rem'
};

const confirmBodyStyle: React.CSSProperties = { 
  marginBottom: '1.5rem', 
  lineHeight: '1.5',
  color: '#4b5563', 
};

const confirmCancelButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid #d1d5db',
  backgroundColor: 'white',
  cursor: 'pointer',
  color: '#374151',
  transition: 'background-color 0.15s',
};

const confirmDeleteButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: '#ef4444',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
};