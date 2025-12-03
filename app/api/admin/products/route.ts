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
        
        // ⭐ NEW: Extract promotionType and discount
        const promotionType = (formData.get('promotionType') as string) || 'None';
        // Note: The value from formData is a string, convert it to a number. 
        // We use parseFloat as the frontend sends '0' if the field is hidden.
        const discount = parseFloat(formData.get('discount') as string) || 0;
        // ⭐ END NEW EXTRACTION

        if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
            return NextResponse.json({ error: "Missing or invalid product fields (Name, Price, Stock)." }, { status: 400 });
        }
        
        // ⭐ NEW: Server-side validation for Flash Deals discount
        if (promotionType === 'Flash Deals' && (discount <= 0 || discount > 100)) {
            return NextResponse.json({ 
                error: "Flash Deals must have a discount percentage between 1 and 100." 
            }, { status: 400 });
        }
        // ⭐ END NEW VALIDATION

        let imageUrl = '';
        
        // 2. FILE SAVING LOGIC: Saves file to /public/uploads
        if (imageFile && imageFile.size > 0) {
            
            const timestamp = Date.now();
            const originalFilename = imageFile.name;
            // Use path.extname to safely get the extension
            const ext = path.extname(originalFilename); 
            // Sanitize and create a safe filename
            const baseName = originalFilename.slice(0, originalFilename.length - ext.length).replace(/[^a-z0-9]/gi, '_');

            const filename = `${baseName}-${timestamp}${ext}`;
            
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
            name, 
            description, 
            price, 
            stock, 
            category, 
            imageUrl, 
            // ⭐ NEW: Pass the new fields to the controller ⭐
            promotionType,
            discount,
            // ⭐ END NEW FIELDS
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