// /lib/db/user.model.ts (Updated and Complete)

import mysql, { ResultSetHeader, FieldPacket } from 'mysql2/promise'; 
import bcrypt from 'bcryptjs';
import { dbConfig } from './db.config'; // Your database configuration

// --- INTERFACES ---

// Interface for data passed to createUser
interface UserData {
    name: string;
    email: string;
    password: string; 
}

// Interface for the data we FETCH for display/login success
export interface DisplayUser {
    id: number;
    full_name: string;
    email: string;
    created_at: Date; 
}

// Interface for the data we FETCH for authentication (includes hash and verification status)
interface AuthenticatedUser extends DisplayUser {
    password_hash: string; // Crucial for comparison
    is_verified: boolean;  // Crucial for login check
}

const SALT_ROUNDS = 10; 

// --- DATABASE FUNCTIONS ---

/**
 * Creates a new user in the database.
 */
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

        // NOTE: Assuming your table has columns: id, full_name, email, password_hash, is_verified
        const [result] = await connection.execute(
            'INSERT INTO users (full_name, email, password_hash, is_verified) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 0] // Set is_verified to 0 (false) initially
        ) as [ResultSetHeader, FieldPacket[]]; 
        
        return result.insertId;

    } catch (error) {
        throw error;
    } finally {
        await connection.end();
    }
}


/**
 * Authenticates a user by email and password.
 * @param email The user's email address.
 * @param password The plain-text password submitted by the user.
 * @returns The user object (excluding the hash) if credentials are valid, otherwise null.
 */
export async function findUserByEmailAndPassword(email: string, password: string): Promise<(DisplayUser & { isVerified: boolean }) | null> {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        // 1. Fetch the user (including the stored password hash and verification status)
        const [rows] = await connection.execute(
            'SELECT id, full_name, email, password_hash, is_verified FROM users WHERE email = ?',
            [email]
        );

        const users = rows as AuthenticatedUser[];
        const user = users[0];

        if (!user) {
            return null; // User not found
        }

        // 2. Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return null; // Password does not match
        }

        // 3. Successful match - Return the user data (Note: isVerified is camelCase for Next.js)
        return {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            created_at: user.created_at, 
            isVerified: user.is_verified,
        };

    } catch (error) {
        console.error("Error authenticating user:", error);
        // Throw an error to ensure the calling API route handles it with a 500 status
        throw new Error('Database authentication failed.');
    } finally {
        await connection.end();
    }
}


/**
 * Fetches all users from the database for the admin dashboard.
 */
export async function getAllUsers(): Promise<DisplayUser[]> {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        const [rows] = await connection.execute(
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