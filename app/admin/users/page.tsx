"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { DisplayUser } from "@/lib/db/user.model"; 

interface User {
  id: string; 
  name: string;
  email: string;
  createdAt: string; 
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok || !data.success) {
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
        setError("Failed to load user data. Please check the API status.");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading user data...</p>;
    }

    if (error) {
      return (
        <div style={{ 
          color: "rgb(185, 28, 28)", 
          padding: "1rem", 
          border: "1px solid rgb(248, 113, 113)", 
          backgroundColor: "rgb(254, 226, 226)",
          borderRadius: "0.5rem",
          fontWeight: "600",
        }}>
          **Error:** {error}
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div style={{ 
          padding: "1rem", 
          border: "1px solid #d1d5db", 
          backgroundColor: "#f9fafb",
          borderRadius: "0.5rem",
          color: "#4b5563"
        }}>
          <p>No users found.</p>
        </div>
      );
    }

    return (
      <div style={{ 
        overflowX: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)', // Subtle shadow
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          minWidth: '600px' 
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ ...tableHeaderStyle, borderTopLeftRadius: '0.5rem' }}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={{ ...tableHeaderStyle, borderTopRightRadius: '0.5rem' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                style={{ 
                  borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none', 
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', 
                }}
              >
                <td style={tableCellStyle}>{user.id}</td>
                <td style={tableCellStyle}>{user.name}</td>
                <td style={tableCellStyle}><a href={`mailto:${user.email}`} style={{ color: '#10b981', textDecoration: 'none' }}>{user.email}</a></td>
                <td style={tableCellStyle}>{new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AdminLayout>
      <h1 
        style={{ 
          fontSize: "2rem", 
          fontWeight: "700", 
          marginBottom: "0.5rem",
          color: "#1f2937",
        }}
      >
        User Management
      </h1>

      <p 
        style={{ 
          marginBottom: "2rem", 
          color: "#4b5563",
        }}
      >
        List of all registered users in the system.
      </p>

      {renderContent()}
    </AdminLayout>
  );
}

const tableHeaderStyle: React.CSSProperties = {
    padding: '1rem 1.5rem', 
    textAlign: 'left', 
    fontWeight: '700',
    color: '#1f2937', 
    fontSize: '0.875rem', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em',
};

const tableCellStyle: React.CSSProperties = {
    padding: '1rem 1.5rem', 
    textAlign: 'left', 
    color: '#4b5563',
    fontSize: '0.9375rem',
};