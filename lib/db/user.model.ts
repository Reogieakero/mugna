
import mysql, { ResultSetHeader, FieldPacket } from 'mysql2/promise'; 
import bcrypt from 'bcryptjs';
import { dbConfig } from './db.config';

interface UserData {
  name: string;
  email: string;
  password: string; 
}

const SALT_ROUNDS = 10; 


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