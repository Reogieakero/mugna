// lib/controllers/admin/product.controller.ts
import { Product, CreateProduct, UpdateProduct } from "@/lib/db/product.model";
import { 
    dbGetAllProducts, 
    dbCreateProduct, 
    dbUpdateProduct, 
    dbDeleteProduct 
} from '@/lib/db/product.db'; 

export class ProductController {

  public static async getAllProducts(): Promise<Product[]> {
    try {
      return await dbGetAllProducts(); 
    } catch (error) {
      throw new Error("Failed to retrieve products.");
    }
  }

  public static async createProduct(productData: CreateProduct): Promise<Product> {
    try {
      return await dbCreateProduct(productData); 
    } catch (error) {
      throw new Error("Failed to add new product.");
    }
  }

  public static async updateProduct(updateData: UpdateProduct): Promise<Product> {
    try {
      return await dbUpdateProduct(updateData);
    } catch (error) {
      throw new Error(`Failed to update product ID ${updateData.id}.`);
    }
  }

  public static async deleteProduct(productId: number): Promise<void> {
    try {
      await dbDeleteProduct(productId);
    } catch (error) {
      throw new Error(`Failed to delete product ID ${productId}.`);
    }
  }
}