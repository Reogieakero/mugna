// app/admin/products/page.tsx
"use client";

import AdminLayout from "../components/AdminLayout";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/db/product.model";
import AddProductModal from "../components/AddProductModal"; 
import ProductCard from "../components/ProductCard"; 
// Assuming these imports exist from the previous steps:
import EditProductModal from "../components/EditProductModal"; 
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"; 

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Renamed for clarity

  // --- NEW STATE FOR EDITING ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/products");
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch products (HTTP ${response.status})`);
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Failed to fetch products:", errorMessage); 
      setError("Failed to load product data. Check console for details.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- ADD HANDLERS ---
  const handleOpenAddModal = () => setIsAddModalOpen(true); 
  const handleCloseAddModal = () => setIsAddModalOpen(false); 
  const handleProductAdded = () => { fetchProducts(); handleCloseAddModal(); };
  
  // --- EDIT HANDLERS (UPDATED) ---
  // 1. Opens the Edit Modal by setting the product object
  const handleEditProduct = (productToEdit: Product) => {
    setEditingProduct(productToEdit); 
  };
  
  // 2. Closes the Edit Modal
  const handleCloseEditModal = () => {
    setEditingProduct(null);
  };
  
  // 3. Updates the list with the single modified product (optimistic update)
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    handleCloseEditModal();
  };
  
  // --- DELETE HANDLER (Refined) ---
  const handleDeleteProduct = async (productId: number) => {
    // Note: The confirmation modal logic is now handled inside ProductCard
    try {
        const response = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
        
        if (response.status === 204) {
             // Filter the deleted product out of the state immediately (optimistic deletion)
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        } else {
            const data = await response.json();
            throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        alert(`Deletion failed: ${errorMessage}`);
    }
  };


  return (
    <AdminLayout>
        
      <div style={headerContainerStyle}>
        <h1 style={headerTitleStyle}>Product Management</h1>
        <button onClick={handleOpenAddModal} style={addButtonStyles}>
          <PlusCircle size={18} style={{ marginRight: "0.5rem" }} />
          Add New Product
        </button>
      </div>

      <p style={{ marginBottom: "2rem", color: "#4b5563" }}>
        View and manage products in a modern card layout.
      </p>

      {isLoading && <p>Loading products...</p>}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Renders the products in the CSS Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div style={productGridStyle}>
          {products.map((product) => (
            <ProductCard 
                key={product.id}
                product={product}
                // Pass the product object for editing instead of just the ID
                onEdit={() => handleEditProduct(product)} 
                onDelete={handleDeleteProduct}
                // Pass the update handler down to the modal via the card
                onProductUpdated={handleProductUpdated}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div style={noProductsStyle}>
          <ShoppingBag size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p>No products found. Click **Add New Product** to populate your inventory.</p>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onProductAdded={handleProductAdded}
      />
      
      {/* Edit Product Modal (Renders when editingProduct is not null) */}
      {editingProduct && (
          <EditProductModal
              product={editingProduct}
              isOpen={!!editingProduct} // Always true when editingProduct is set
              onClose={handleCloseEditModal}
              onProductUpdated={handleProductUpdated} // Use the specific update handler
          />
      )}

    </AdminLayout>
  );
}

// Inline Styles
const headerContainerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" };
const headerTitleStyle = { fontSize: "2rem", fontWeight: "700", color: "#1f2937" };
const addButtonStyles = {
    display: "flex", alignItems: "center", padding: "0.5rem 1rem", backgroundColor: "#1f2937",
    color: "white", border: "none", borderRadius: "0.375rem", cursor: "pointer", fontWeight: "600",
    transition: "background-color 0.2s",
};
const productGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '2rem', padding: '1.5rem 0',
}
const errorStyle = { color: "red", padding: "1rem", border: "1px solid red", borderRadius: "4px" };
const noProductsStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '4rem 2rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem',
    border: '1px dashed #d1d5db', color: '#6b7280', textAlign: 'center',
}