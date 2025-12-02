
import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db/user.model'; 

export async function GET() {
    try {
        const users = await getAllUsers();
        
        const formattedUsers = users.map(user => ({
            id: user.id.toString(), 
            name: user.full_name,
            email: user.email,
            createdAt: user.created_at.toISOString(),
        }));

        return NextResponse.json({ 
            success: true, 
            users: formattedUsers 
        }, { status: 200 });

    } catch (error) {
        console.error("API Error fetching users:", error);
        return NextResponse.json(
            { success: false, error: 'Failed to retrieve user data.' },
            { status: 500 }
        );
    }
}