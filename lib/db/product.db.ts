// lib/db/product.db.ts
import mysql, { ResultSetHeader, FieldPacket, RowDataPacket } from 'mysql2/promise'; 
import { dbConfig } from './db.config'; // Your MySQL configuration
import { Product, CreateProduct, UpdateProduct } from '@/lib/db/product.model';

// Type for raw data from MySQL
interface ProductRow extends RowDataPacket {
    id: number;
    name: string;
    description: string;
    price: string; 
    stock: number;
    category: string;
    image_url: string; 
    promotion_type: string;
    discount: number; 
    created_at: Date;
    updated_at: Date;
}

// Map database row to TypeScript interface
const mapRowToProduct = (row: ProductRow): Product => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price), 
    stock: row.stock,
    category: row.category,
    imageUrl: row.image_url,
    promotionType: row.promotion_type,
    discount: row.discount,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
});

// --- BASE SELECT QUERY ---
const PRODUCT_SELECT_FIELDS = 
    'id, name, description, price, stock, category, image_url, promotion_type, discount, created_at, updated_at';
// -------------------------


export async function dbGetAllProducts(): Promise<Product[]> {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(
            `SELECT ${PRODUCT_SELECT_FIELDS} FROM products ORDER BY created_at DESC`
        );
        return (rows as ProductRow[]).map(mapRowToProduct); 
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw new Error('Database query failed to retrieve products.');
    } finally {
        await connection.end();
    }
}


export async function dbCreateProduct(productData: CreateProduct): Promise<Product> {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.execute(
            `INSERT INTO products 
             (name, description, price, stock, category, image_url, promotion_type, discount) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                productData.name, productData.description, productData.price,
                productData.stock, productData.category, productData.imageUrl,
                productData.promotionType, productData.discount,
            ]
        ) as [ResultSetHeader, FieldPacket[]]; 

        const [rows] = await connection.execute(
            `SELECT ${PRODUCT_SELECT_FIELDS} FROM products WHERE id = ?`,
            [result.insertId]
        );

        if (Array.isArray(rows) && rows.length > 0) {
            return mapRowToProduct(rows[0] as ProductRow); 
        }
        throw new Error('Failed to retrieve newly created product after insertion.');
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    } finally {
        await connection.end();
    }
}


export async function dbUpdateProduct(updateData: UpdateProduct): Promise<Product> {
    const connection = await mysql.createConnection(dbConfig);
    const { id, ...data } = updateData;

    try {
        const fields: string[] = [];
        const values: (string | number)[] = [];
        
        for (const key in data) {
            if (data[key as keyof typeof data] !== undefined) { 
                let dbField: string;
                const value = data[key as keyof typeof data];

                switch (key) {
                    case 'imageUrl':
                        dbField = 'image_url';
                        break;
                    case 'promotionType':
                        dbField = 'promotion_type';
                        break;
                    // Note: 'discount' maps directly to 'discount' in the database.
                    default:
                        dbField = key;
                }
                
                fields.push(`${dbField} = ?`);
                values.push(value as (string | number));
            }
        }

        if (fields.length === 0) {
            // If nothing to update, just fetch and return the existing product
            const [rows] = await connection.execute(`SELECT ${PRODUCT_SELECT_FIELDS} FROM products WHERE id = ?`, [id]);
            if (Array.isArray(rows) && rows.length > 0) {
                return mapRowToProduct(rows[0] as ProductRow); 
            }
            throw new Error(`Product ID ${id} not found.`);
        }

        const query = `UPDATE products SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        
        await connection.execute(query, [...values, id]);

        const [rows] = await connection.execute(
            `SELECT ${PRODUCT_SELECT_FIELDS} FROM products WHERE id = ?`,
            [id]
        );

        if (Array.isArray(rows) && rows.length > 0) {
            return mapRowToProduct(rows[0] as ProductRow);
        }
        throw new Error(`Product ID ${id} not found after update.`);

    } catch (error) {
        console.error(`Error updating product ID ${id}:`, error);
        throw error;
    } finally {
        await connection.end();
    }
}


export async function dbDeleteProduct(productId: number): Promise<void> {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.execute(
            'DELETE FROM products WHERE id = ?',
            [productId]
        ) as [ResultSetHeader, FieldPacket[]];

        if (result.affectedRows === 0) {
            throw new Error(`Product with ID ${productId} not found.`);
        }
    } catch (error) {
        console.error(`Error deleting product ID ${productId}:`, error);
        throw error;
    } finally {
        await connection.end();
    }
}