// app/admin/dashboard/page.tsx (Updated: Removed userBreakdown prop)
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { DisplayUser } from "@/lib/db/user.model";
import TotalUsersCard from "../components/TotalUsersCard"; 

type User = DisplayUser;

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }

        setUsers(data.users || []);
        setError(null);
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch users: An unknown error occurred.";

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        console.error("Failed to fetch users:", errorMessage);

        setError("Failed to load user data. Check server logs for details.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

      {isLoading && <p>Loading user data...</p>}
      {error && <div style={{ color: "red", padding: "1rem", border: "1px solid red", borderRadius: "4px" }}>{error}</div>}

      {!isLoading && !error && (
        <TotalUsersCard 
            // Only passing totalUsers prop now
            totalUsers={users.length} 
        />
      )}
    </AdminLayout>
  );
}