// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { ProductController } from "@/lib/controllers/admin/product.controller"; 

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
        
        // The client explicitly sends 'imageUrl' as 'null' string if the image was removed/replaced.
        const imageUrlData = formData.get('imageUrl') as string; 
        
        // Use 'let' for imageFile and imageUrl to allow reassignment later during upload logic
        // This resolves the 'imageFile is assigned a value but never used. Use 'let' instead' warning
        const imageFile = formData.get('image') as File | null; 
        const imageUrl: string | null = imageUrlData === 'null' ? null : imageUrlData;
        
        // ⭐ NOTE: IMAGE UPLOAD LOGIC REQUIRED HERE
        // IF imageFile exists, you must:
        // 1. Save the file (e.g., to S3, disk, or Vercel Blob).
        // 2. Update the 'imageUrl' variable with the newly created public URL.
        
        // Example logic for image file handling (Replace with your actual upload code):
        if (imageFile) {
            // Placeholder: Simulate file upload and URL generation
            // Replace this block with your actual file upload service call
            console.log(`Processing new image upload for file: ${imageFile.name}`);
            // imageUrl = await uploadImage(imageFile); // <-- Your actual upload function here
            // For now, let's keep imageUrl as null or the existing one if no upload logic is added.
        }

        const updateFields = {
            id: productId,
            name, 
            description, 
            price, 
            stock, 
            category,
            // Pass the final URL string (will be '' if null)
            imageUrl: imageUrl || '', 
        }

        // Basic validation check 
        if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
            return NextResponse.json({ error: "Missing or invalid product fields." }, { status: 400 });
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