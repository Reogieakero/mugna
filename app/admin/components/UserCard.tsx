"use client";

import React from "react";
import { DisplayUser } from "@/lib/db/user.model"; 

interface UserCardProps {
  user: DisplayUser;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const dateValue = typeof user.created_at === 'string' 
    ? new Date(user.created_at) 
    : user.created_at;

  const formattedDate = dateValue.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#333" }}>
        👤 {user.full_name || "N/A"}
      </div>
      <div style={{ fontSize: "1rem", color: "#444" }}>
        📧 {user.email}
      </div>
      <hr style={{ border: 'none', borderTop: '1px dotted #ccc', margin: '0.5rem 0' }} />
      <div style={{ fontSize: "0.9rem", color: "#666" }}>
        **User ID:** {user.id}
      </div>
      <div style={{ fontSize: "0.9rem", color: "#666" }}>
        **Joined:** {formattedDate}
      </div>
    </div>
  );
};

export default UserCard;