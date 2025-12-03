"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { DisplayUser } from "@/lib/db/user.model";
// Imported the new generic TotalCard
import TotalCard from "../components/TotalCard"

type User = DisplayUser;

// Define a minimal type for the Product data needed for counting
interface Product {
    id: number;
    name: string;
}

export default function AdminDashboardPage() {
    // --- USER STATE ---
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [userError, setUserError] = useState<string | null>(null);

    // --- PRODUCT STATE ---
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/admin/users");
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
                }
                setUsers(data.users || []);
                setUserError(null);
            } catch (err: unknown) {
                let errorMessage = "Failed to fetch users: An unknown error occurred.";
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                console.error("Failed to fetch users:", errorMessage);
                setUserError("Failed to load user data. Check server logs for details.");
                setUsers([]);
            } finally {
                setIsLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Fetch Products (Count)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetching all products to get the count from the array length
                const response = await fetch("/api/admin/products");
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
                }
                setProducts(data.products || []);
                setProductError(null);
            } catch (err: unknown) {
                let errorMessage = "Failed to fetch products: An unknown error occurred.";
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                console.error("Failed to fetch products:", errorMessage);
                setProductError("Failed to load product data. Check server logs for details.");
                setProducts([]);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const isLoading = isLoadingUsers || isLoadingProducts;
    const error = userError || productError;

    return (
        <AdminLayout>
            <h1
                style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: "#1f2937",
                }}
            >
                Welcome, Administrator!
            </h1>

            <p
                style={{
                    marginBottom: "2rem",
                    color: "#4b5563",
                }}
            >
                Dashboard overview: key metrics at a glance.
            </p>

            {isLoading && <p>Loading dashboard data...</p>}
            {error && <div style={{ color: "red", padding: "1rem", border: "1px solid red", borderRadius: "4px" }}>{error}</div>}

            {!isLoading && !error && (
                // Wrapper for side-by-side display of cards
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Total Users Card (now using TotalCard) */}
                    <TotalCard
                        label="Total Users"
                        totalCount={users.length}
                        footerText="since last month"
                        
                        
                    />
                    
                    {/* Total Products Card (New) */}
                    <TotalCard
                        label="Total Products"
                        totalCount={products.length}
                        footerText="active items"
                        
                    />
                </div>
            )}
        </AdminLayout>
    );
}