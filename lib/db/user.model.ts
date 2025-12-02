// lib/admin/db/user.model.ts (Updated)

import mysql, { ResultSetHeader, FieldPacket } from 'mysql2/promise'; 
import bcrypt from 'bcryptjs';
import { dbConfig } from './db.config'; // Your database configuration

// Re-defining the existing UserData interface for context
interface UserData {
  name: string;
  email: string;
  password: string; 
}

// Interface for the data we FETCH from the DB (the data we want to display)
export interface DisplayUser {
    id: number;
    full_name: string;
    email: string;
    created_at: Date; // Assuming your table has a created_at column
}

const SALT_ROUNDS = 10; 

// --- EXISTING FUNCTION (for context/completeness) ---
export async function createUser({ name, email, password }: UserData): Promise<number> {
    // ... (Your existing createUser implementation)
    // ...
    // Note: If your table column is 'full_name' as in your INSERT, ensure it's consistent
    // in the fetching function below.
    // ...
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [existingUsers] = await connection.execute(
            'SELECT email FROM users WHERE email = ?',
            [email]
        );

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            throw new Error('User with this email already exists.');
        }

        const [result] = await connection.execute(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword] 
        ) as [ResultSetHeader, FieldPacket[]]; 
        
        return result.insertId;

    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}
// ---------------------------------------------------


/**
 * NEW FUNCTION: Fetches all users from the database for the admin dashboard.
 * Selects only non-sensitive data.
 */
export async function getAllUsers(): Promise<DisplayUser[]> {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute(
            // NOTE: Change 'created_at' to your actual column name if different (e.g., 'createdAt', 'join_date')
            'SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC'
        );

        // TypeScript assertion to treat the result as an array of DisplayUser objects
        return rows as DisplayUser[];

    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error('Database query failed to retrieve users.');
    } finally {
        await connection.end();
    }
}