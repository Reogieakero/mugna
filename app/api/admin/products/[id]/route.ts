// app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { ProductController } from "@/lib/controllers/admin/product.controller";

interface Context {
    params: {
        id: string;
    };
}

// 1. PATCH/PUT (Update an existing product)
export async function PATCH(request: Request, context: Context) {
    const productId = parseInt(context.params.id);

    if (isNaN(productId)) {
        return NextResponse.json({ error: "Invalid product ID format." }, { status: 400 });
    }

    try {
        const updateData = await request.json();
        
        const updatedProduct = await ProductController.updateProduct({ 
            id: productId, 
            ...updateData 
        });

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
export async function DELETE(request: Request, context: Context) {
    const productId = parseInt(context.params.id);

    if (isNaN(productId)) {
        return NextResponse.json({ error: "Invalid product ID format." }, { status: 400 });
    }
    
    try {
        await ProductController.deleteProduct(productId);
        
        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error(`API Error deleting product ID ${productId}:`, error);
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Failed to delete product." },
          { status: 500 }
        );
    }
}