// lib/db/product.model.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string; 
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type UpdateProduct = Partial<CreateProduct> & { id: number };