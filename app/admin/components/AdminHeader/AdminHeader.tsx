"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./AdminHeader.module.css";
import { UserCircle, LogOut } from "lucide-react"; 

export default function AdminHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    console.log("Admin logging out...");
    
    router.push("/admin/login"); 
    
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 

  return (
    <header className={styles.header}>
      <div></div> 

      <div className={styles.actions} ref={dropdownRef}>
        <div 
          className={styles.userAvatarContainer} 
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          role="button"
          tabIndex={0}
        >
          <UserCircle size={30} /> 
        </div>

        {isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            <button 
              className={styles.dropdownItem} 
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}