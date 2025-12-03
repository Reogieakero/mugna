// /app/api/home/featured/route.ts
import { NextResponse } from 'next/server';
import { dbGetProductsByPromotionType } from '@/lib/db/product.db';

export async function GET() {
    try {
        // Fetch products where promotion_type is 'Featured'
        const featuredProducts = await dbGetProductsByPromotionType('Featured');

        return NextResponse.json({ products: featuredProducts }, { status: 200 });
    } catch (error) {
        console.error("Error in featured products API:", error);
        // Respond with a 500 error if the database query fails
        return NextResponse.json(
            { error: 'Failed to retrieve featured products.' },
            { status: 500 }
        );
    }
}