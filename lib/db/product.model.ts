// lib/db/product.model.ts

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string; 
    
    // ⭐ NEW FIELDS ADDED ⭐
    promotionType: string; // E.g., 'Flash Deals', 'Top Sellers', 'None'
    discount: number;      // Percentage discount (0-100), only relevant for certain promotion types

    createdAt: Date;
    updatedAt: Date;
}

export type CreateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type UpdateProduct = Partial<CreateProduct> & { id: number };