
import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "../../db/user.model";

export async function getAllUsersController() {

    try {
        const users = await getAllUsers();
        
        return NextResponse.json({ 
            message: "Users retrieved successfully",
            users: users 
        }, { status: 200 });
    } catch (error: unknown) {
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