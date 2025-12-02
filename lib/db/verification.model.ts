// lib/db/verification.model.ts

import mysql, { 
    Connection, 
    ConnectionOptions, 
    FieldPacket // FIX: Imports the type for the result metadata (replaces 'any')
} from 'mysql2/promise'; 

// FIX: Imports dbConfig from the adjacent file in the same directory
import { dbConfig } from './db.config'; 


// Define the shape of the data retrieved from the verification_codes table
interface VerificationRecord {
  id: number;
  expires_at: Date;
  is_used: boolean;
}

// ----------------------------------------------------------------------
// Function to save the code (Used by emailservice.ts)
// ----------------------------------------------------------------------

/**
 * Saves a new verification code to the database with a 10-minute expiration.
 */
export async function saveVerificationCode(userId: number, code: string): Promise<void> {
  const connection: Connection = await mysql.createConnection(dbConfig);
  
  // Calculate expiration date (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); 

  try {
    // Assuming the verification_codes table exists
    await connection.execute(
      'INSERT INTO verification_codes (user_id, code, expires_at) VALUES (?, ?, ?)',
      [userId, code, expiresAt]
    );
  } catch (error) {
    console.error('Error saving verification code:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// ----------------------------------------------------------------------
// Function to validate and use the code 
// ----------------------------------------------------------------------

/**
 * Validates a verification code, updates verification_codes, and sets users.is_verified.
 */
export async function validateAndUseCode(userId: number, code: string): Promise<boolean> {
  const connection: Connection = await mysql.createConnection(dbConfig);
  
  try {
    // 1. SELECT the most recent, matching code
    // FIX: Using FieldPacket[] for the metadata type replaces 'any' and resolves the red line.
    const [rows] = await connection.execute(
      'SELECT id, expires_at, is_used FROM verification_codes WHERE user_id = ? AND code = ? ORDER BY expires_at DESC LIMIT 1', 
      [userId, code]
    ) as [VerificationRecord[], FieldPacket[]]; 

    if (rows.length === 0) {
      console.log(`Verification failed: No code found for user ${userId} with code ${code}`);
      return false; // Code not found (Invalid)
    }

    const verificationRecord = rows[0];
    const now = new Date();

    // 2. CHECK EXPIRATION
    if (new Date(verificationRecord.expires_at).getTime() < now.getTime()) {
      console.log(`Verification failed: Code expired at ${verificationRecord.expires_at}`);
      return false; // Code has expired
    }

    // 3. CHECK USAGE
    if (verificationRecord.is_used) {
      console.log(`Verification failed: Code ${verificationRecord.id} already used.`);
      return false; // Code already used
    }

    // --- 4. EXECUTE UPDATES (Code is Valid and Unused) ---
    
    await connection.beginTransaction();

    // A. Mark the verification code as used
    await connection.execute(
      'UPDATE verification_codes SET is_used = TRUE WHERE id = ?', 
      [verificationRecord.id]
    );

    // B. Mark the user's email as verified in the users table (Assuming you added 'is_verified')
    await connection.execute(
      'UPDATE users SET is_verified = TRUE WHERE id = ?', 
      [userId]
    );

    await connection.commit(); 
    
    return true; // Success!
    
  } catch (error) {
    await connection.rollback(); 
    console.error('Error during code validation and usage:', error);
    return false;
  } finally {
    await connection.end();
  }
}