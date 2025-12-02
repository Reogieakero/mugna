
import React, { useState } from "react";

interface TotalUsersCardProps {
  totalUsers: number;
}

export default function TotalUsersCard({ totalUsers }: TotalUsersCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const primaryColor = "#000000";
  const lightShadow = '0 2px 4px rgba(0, 0, 0, 0.05)'; 
  const hoverShadow = `0 4px 8px rgba(0, 0, 0, 0.1)`;

  const baseCardStyle: React.CSSProperties = {
    padding: '2rem', 
    borderRadius: '8px', 
    backgroundColor: '#ffffff',
    border: '1px solid #f3f4f6', 
    transition: 'all 0.3s ease-in-out', 
    boxShadow: isHovering ? hoverShadow : lightShadow,
    maxWidth: '300px', 
    margin: '0 auto 2rem 0',
    cursor: 'pointer',
    transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "1.2rem", 
    color: "#000000", 
    fontWeight: '500', 
    letterSpacing: '0', 
    textTransform: 'none', 
    marginBottom: '0.5rem',
    textAlign: 'left', 
  };

  const rightAlignedContentStyle: React.CSSProperties = {
    textAlign: 'right', 
  };

  const countStyle: React.CSSProperties = {
    fontSize: "4.5rem", 
    fontWeight: "800", 
    color: primaryColor,
    margin: 0,
    lineHeight: 1,
  };
  
  const footerStyle: React.CSSProperties = {
    marginTop: '0.2rem', 
    fontSize: '0.7rem', 
    color: '#9ca3af', 
    fontWeight: '400',
  };

  return (
    <div 
      style={baseCardStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <p style={labelStyle}>
        Users
      </p>

      <div style={rightAlignedContentStyle}>
        <h2 style={countStyle}>
          {totalUsers.toLocaleString()}
        </h2>
        <div style={footerStyle}>
          since last month
        </div>
      </div>
    </div>
  );
}