import mysql, { 
    Connection, 
    ConnectionOptions, 
    FieldPacket // FIX: Imports the type for the result metadata (replaces 'any')
} from 'mysql2/promise'; 

// FIX: Imports dbConfig from the adjacent file in the same directory
import { dbConfig } from './db.config'; 


interface VerificationRecord {
  id: number;
  expires_at: Date;
  is_used: boolean;
}



export async function saveVerificationCode(userId: number, code: string): Promise<void> {
  const connection: Connection = await mysql.createConnection(dbConfig);
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); 

  try {
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


export async function validateAndUseCode(userId: number, code: string): Promise<boolean> {
  const connection: Connection = await mysql.createConnection(dbConfig);
  
  try {
    const [rows] = await connection.execute(
      'SELECT id, expires_at, is_used FROM verification_codes WHERE user_id = ? AND code = ? ORDER BY expires_at DESC LIMIT 1', 
      [userId, code]
    ) as [VerificationRecord[], FieldPacket[]]; 

    if (rows.length === 0) {
      console.log(`Verification failed: No code found for user ${userId} with code ${code}`);
      return false; 
    }

    const verificationRecord = rows[0];
    const now = new Date();

    if (new Date(verificationRecord.expires_at).getTime() < now.getTime()) {
      console.log(`Verification failed: Code expired at ${verificationRecord.expires_at}`);
      return false; 
    }

    if (verificationRecord.is_used) {
      console.log(`Verification failed: Code ${verificationRecord.id} already used.`);
      return false;
    }

    
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE verification_codes SET is_used = TRUE WHERE id = ?', 
      [verificationRecord.id]
    );

    await connection.execute(
      'UPDATE users SET is_verified = TRUE WHERE id = ?', 
      [userId]
    );

    await connection.commit(); 
    
    return true;
    
  } catch (error) {
    await connection.rollback(); 
    console.error('Error during code validation and usage:', error);
    return false;
  } finally {
    await connection.end();
  }
}