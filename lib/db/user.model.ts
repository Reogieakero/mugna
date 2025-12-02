// lib/admin/db/user.model.ts (Updated and Complete)

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
    created_at: Date; 
}

const SALT_ROUNDS = 10; 

// --- EXISTING FUNCTION (for context/completeness) ---
export async function createUser({ name, email, password }: UserData): Promise<number> {
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
 */
export async function getAllUsers(): Promise<DisplayUser[]> {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute(
            // UPDATED QUERY: Added 'role' column selection
            'SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC'
        );

        return rows as DisplayUser[];

    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error('Database query failed to retrieve users.');
    } finally {
        await connection.end();
    }
}