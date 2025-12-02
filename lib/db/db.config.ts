import { createPool, Pool, ConnectionOptions } from 'mysql2/promise';

// 1. Export the configuration object (this remains unchanged)
export const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mugna-ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// 2. Create and export the database connection pool instance
// The 'pool' is the actual object you will use to run queries.
const pool: Pool = createPool(dbConfig);
export { pool };

/**
 * 3. Export a dedicated function to test and confirm the connection is working.
 * This function is what your API route should call.
 */
export async function connectDB() {
    try {
        // Attempt to get a connection from the pool to test it
        const connection = await pool.getConnection();
        console.log("MySQL Pool connection successful.");
        // Release the connection back to the pool immediately
        connection.release(); 
    } catch (error) {
        console.error("Failed to connect to MySQL database:", error);
        // In a real application, you might want to throw or exit here
        throw new Error("Database connection failed.");
    }
}