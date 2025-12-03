// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { ProductController } from "@/lib/controllers/admin/product.controller"; 
// ⭐ NEW IMPORTS: For file handling
import path from 'path'; 
import fs from 'fs/promises'; 
// ⭐ END NEW IMPORTS

// Helper function to reliably extract the ID from the request URL
function getProductIdFromUrl(request: Request): number | null {
    try {
        const url = new URL(request.url);
        // The path will be something like: /api/admin/products/10
        const segments = url.pathname.split('/');
        const idSegment = segments[segments.length - 1]; 
        const productId = parseInt(idSegment);
        
        return isNaN(productId) ? null : productId;
    } catch (e) {
        console.error("Failed to parse product ID from URL:", e);
        return null;
    }
}


// 1. PUT (Update an existing product)
// Use 'unknown' for context to suppress the 'context is defined but never used' warning
export async function PUT(request: Request, context: unknown) { 
    const productId = getProductIdFromUrl(request); 

    if (productId === null) {
        return NextResponse.json({ error: "Invalid product ID format." }, { status: 400 });
    }

    try {
        const formData = await request.formData(); // Read the form data

        // --- Data Extraction and Conversion ---
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;
        
        // Convert numbers from string/FormDataEntryValue
        const price = +(formData.get('price') as string); 
        const stock = parseInt(formData.get('stock') as string);
        
        // ⭐ NEW: Extract promotionType and discount
        const promotionType = (formData.get('promotionType') as string) || 'None';
        const discount = parseFloat(formData.get('discount') as string) || 0;
        // ⭐ END NEW EXTRACTION
        
        // The client explicitly sends 'imageUrl' as 'null' string if the image was removed/replaced.
        const imageUrlData = formData.get('imageUrl') as string; 
        
        // Use 'let' for imageFile and imageUrl to allow reassignment later during upload logic
        const imageFile = formData.get('image') as File | null; 
        let imageUrl: string | null = imageUrlData === 'null' ? null : imageUrlData;

        // ⭐ NEW VALIDATION: Server-side validation for Flash Deals discount
        if (promotionType === 'Flash Deals' && (discount <= 0 || discount > 100)) {
            return NextResponse.json({ 
                error: "Flash Deals must have a discount percentage between 1 and 100." 
            }, { status: 400 });
        }
        // ⭐ END NEW VALIDATION

        // Basic validation check 
        if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
            return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
        }
        
        // ⭐ IMPLEMENTED: IMAGE UPLOAD LOGIC from POST endpoint
        if (imageFile && imageFile.size > 0) {
            
            const timestamp = Date.now();
            const originalFilename = imageFile.name;
            const ext = path.extname(originalFilename); 
            const baseName = originalFilename.slice(0, originalFilename.length - ext.length).replace(/[^a-z0-9]/gi, '_');

            const filename = `${baseName}-${timestamp}${ext}`;
            
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const filePath = path.join(uploadDir, filename);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            
            await fs.writeFile(filePath, buffer);

            // Set the new public URL, overwriting the old one
            imageUrl = `/uploads/${filename}`; 
        }
        // ⭐ END IMPLEMENTED IMAGE UPLOAD LOGIC

        const updateFields = {
            id: productId,
            name, 
            description, 
            price, 
            stock, 
            category,
            // Pass the final URL string (will be the new image URL, old URL, or '' if removed)
            imageUrl: imageUrl || '', 
            // ⭐ NEW: Include promotion fields
            promotionType,
            discount,
            // ⭐ END NEW FIELDS
        }
        
        const updatedProduct = await ProductController.updateProduct(updateFields);

        // Return 200 with the updated product JSON
        return NextResponse.json({ 
            message: `Product ID ${productId} updated successfully`, 
            product: updatedProduct 
        }, { status: 200 });

    } catch (error) {
        console.error(`API Error updating product ID ${productId}:`, error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update product." },
            { status: 500 }
        );
    }
}


// 2. DELETE (Delete a product)
export async function DELETE(request: Request, context: unknown) { 
    const productId = getProductIdFromUrl(request); 

    if (productId === null) {
        return NextResponse.json({ error: "Invalid product ID format." }, { status: 400 });
    }
    
    try {
        await ProductController.deleteProduct(productId);
        
        // The standard response for a successful DELETE with no content body
        return new NextResponse(null, { status: 204 }); 

    } catch (error) {
        console.error(`API Error deleting product ID ${productId}:`, error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete product." },
            { status: 500 }
        );
    }
}