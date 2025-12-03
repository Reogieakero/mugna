import React, { useState } from "react";

interface TotalCardProps {
  label: string;
  totalCount: number;
  footerText: string;
}

export default function TotalCard({ label, totalCount, footerText }: TotalCardProps) {
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
    
    // ⭐ KEY CHANGES: Set fixed width and height for uniform size
    width: '280px', 
    height: '200px', 
    maxWidth: '300px', // Keep max-width constraint
    // ⭐ END KEY CHANGES
    
    margin: '0', 
    cursor: 'pointer',
    transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    justifyContent: 'space-between', // Ensures content aligns vertically within the fixed height
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
        {label}
      </p>

      <div style={rightAlignedContentStyle}>
        <h2 style={countStyle}>
          {totalCount.toLocaleString()}
        </h2>
        <div style={footerStyle}>
          {footerText}
        </div>
      </div>
    </div>
  );
}