// MUGNA/lib/db/user.model.ts

import mysql, { ResultSetHeader, FieldPacket } from 'mysql2/promise'; 
import bcrypt from 'bcryptjs';

// Configuration based on environment variables from .env.local
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Interface for input data
interface UserData {
  name: string;
  email: string;
  password: string; 
}

// Hashing configuration
const SALT_ROUNDS = 10; 

/**
 * Creates a new user in the database.
 * @returns {Promise<number>} The insertId of the new user record.
 */
export async function createUser({ name, email, password }: UserData): Promise<number> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // 1. Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error('User with this email already exists.');
    }

    // 2. Execute the INSERT query
    // Use type assertion [ResultSetHeader, FieldPacket[]] for type safety
    const [result] = await connection.execute(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword] 
    ) as [ResultSetHeader, FieldPacket[]]; 
    
    // 3. Return the ID of the new user
    return result.insertId;

  } catch (error) {
    throw error;
  } finally {
    // 4. Ensure the connection is closed
    await connection.end();
  }
}