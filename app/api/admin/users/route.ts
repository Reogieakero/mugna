// app/api/admin/users/route.ts (New File - App Router API)

import { NextRequest, NextResponse } from "next/server";
import { getAllUsersController } from "@/lib/admin/controllers/user.controller"; 
// Adjust the path above based on your actual file structure

/**
 * Handles GET requests to /api/admin/users
 */
export async function GET(request: NextRequest) {
    // Forward the request handling to the dedicated controller function
    return getAllUsersController();
}