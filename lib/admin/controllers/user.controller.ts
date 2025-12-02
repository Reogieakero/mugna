// ./lib/admin/controllers/user.controller.ts

import { NextRequest, NextResponse } from "next/server";
// FIX: Corrected the relative path from '../db/user.model' to '../../db/user.model'
import { getAllUsers } from "../../db/user.model";

/**
 * Controller function to handle fetching all users.
 */
export async function getAllUsersController() {
    // You would typically add authentication/authorization checks here
    // e.g., if (session.user.role !== 'admin') return NextResponse.json(...)

    try {
        // Call the model function to get the data
        const users = await getAllUsers();
        
        // Return a successful JSON response
        return NextResponse.json({ 
            message: "Users retrieved successfully",
            users: users 
        }, { status: 200 });
    } catch (error: unknown) {
        // Handle database or internal errors safely with 'unknown' type
        let errorMessage = "An unknown error occurred.";

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error("Controller Error (getAllUsersController):", errorMessage);
        
        return NextResponse.json({ 
            error: "Failed to fetch users due to a server error." 
        }, { status: 500 });
    }
}