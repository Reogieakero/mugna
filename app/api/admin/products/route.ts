// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { ProductController } from "@/lib/controllers/admin/product.controller";
import { CreateProduct } from "@/lib/db/product.model";
import path from 'path'; 
import fs from 'fs/promises'; 

// Use nodejs runtime for file system access
export const runtime = 'nodejs'; 

// 1. GET (Fetch all products)
export async function GET() {
  try {
    const products = await ProductController.getAllProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. POST (Add a new product with File Upload)
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        // 1. Extract and validate fields
        const name = formData.get('name') as string;
        const description = (formData.get('description') as string) || '';
        const price = parseFloat(formData.get('price') as string);
        const stock = parseInt(formData.get('stock') as string);
        const category = (formData.get('category') as string) || '';
        const imageFile = formData.get('image') as File | null;
        
        if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
            return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
        }

        let imageUrl = '';
        
        // 2. FILE SAVING LOGIC: Saves file to /public/uploads
        if (imageFile && imageFile.size > 0) {
            
            const timestamp = Date.now();
            const originalFilename = imageFile.name;
            const filename = `${timestamp}-${originalFilename.replace(/[^a-z0-9.]/gi, '_')}`;
            
            // Resolve the path to the public/uploads directory
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const filePath = path.join(uploadDir, filename);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            
            // Save the file
            await fs.writeFile(filePath, buffer);

            // Set the public URL
            imageUrl = `/uploads/${filename}`; 
        }
        
        // 3. Save data to database
        const productData: CreateProduct = {
            name, description, price, stock, category, imageUrl, 
        };

        const newProduct = await ProductController.createProduct(productData);
        
        return NextResponse.json({ 
            message: "Product added successfully", 
            product: newProduct 
        }, { status: 201 });

    } catch (error) {
        console.error("API Error adding product with image:", error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to add product" },
          { status: 500 }
        );
    }
}