// app/admin/products/page.tsx
"use client";

import AdminLayout from "../components/AdminLayout";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/db/product.model"; 
import AddProductModal from "../components/AddProductModal"; 
import ProductCard from "../components/ProductCard"; 

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

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

  const handleAddProduct = () => setIsModalOpen(true); 
  const handleCloseModal = () => setIsModalOpen(false); 
  const handleProductAdded = () => { fetchProducts(); handleCloseModal(); };
  
  const handleEditProduct = (productId: number) => {
    alert(`Editing product ID: ${productId}. (Implement edit modal/form here)`);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm(`Are you sure you want to delete product ID: ${productId}?`)) return;
    try {
        const response = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
        if (response.status !== 204) {
            const data = await response.json();
            throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }
        alert(`Product ID ${productId} deleted successfully.`);
        fetchProducts(); 
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        alert(`Deletion failed: ${errorMessage}`);
    }
  };


  return (
    <AdminLayout>
        
      <div style={headerContainerStyle}>
        <h1 style={headerTitleStyle}>Product Management</h1>
        <button onClick={handleAddProduct} style={addButtonStyles}>
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
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div style={noProductsStyle}>
          <ShoppingBag size={48} color="#9ca3af" style={{ marginBottom: '1rem' }} />
          <p>No products found. Click Add New Produc to populate your inventory.</p>
        </div>
      )}

      <AddProductModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProductAdded={handleProductAdded}
      />
    </AdminLayout>
  );
}

// Inline Styles
const headerContainerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" };
const headerTitleStyle = { fontSize: "2rem", fontWeight: "700", color: "#1f2937" };
const addButtonStyles = {
    display: "flex", alignItems: "center", padding: "0.5rem 1rem", backgroundColor: "#10b981",
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