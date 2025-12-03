"use client";

import { useState } from "react"; // 1. Import useState for dropdown logic
import Image from "next/image";
import Link from "next/link";
// 2. Import icons for the header/dropdown
import { MoveRight, Zap, Globe, Heart, User, LogOut } from "lucide-react"; 
import styles from "./HomePage.module.css";

// --- START: Header Component (Ideally this is in Header.tsx) ---
const Header = () => {
    // State to control the visibility of the dropdown menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleUserDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        // Here you would implement your actual logout API call
        alert("User successfully logged out!");
        setIsDropdownOpen(false); // Close dropdown after action
        // Redirect to login or home page
    };

    // Note: The styles.userProfile class will dynamically include 'styles.open'
    // when the dropdown is open. We'll add this rule to the CSS.
    const profileClass = `${styles.userProfile} ${isDropdownOpen ? styles.open : ''}`;

    return (
        <header className={styles.mugnaHeader}>
            <div className={styles.logo}>
                <Link href="/">MUGNA</Link>
            </div>

            {/* Main Navigation Links */}
            <nav className={styles.mainNav}>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/products">Products</Link></li>
                    <li><Link href="/crafters">Crafters</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </nav>

            {/* User Avatar and Dropdown */}
            <div className={profileClass}>
                <div className={styles.avatarContainer} onClick={toggleUserDropdown}>
                    {/* User icon serves as the avatar */}
                    <User size={24} color="#ffffff" /> 
                </div>

                {/* Dropdown Menu - only visible when isDropdownOpen is true */}
                <div className={styles.userDropdownMenu}>
                    <Link href="/profile">My Profile</Link>
                    <hr />
                    {/* Logout Button */}
                    <button onClick={handleLogout}>
                        <LogOut size={16} style={{ marginRight: '8px' }} />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};
// --- END: Header Component ---


// This is the public index page for your application
export default function HomePage() {
  return (
    <div className={styles.mainContainer}
         style={{
           backgroundImage: `url('/market-shop.jpg')`, 
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
         }}
    >
        {/* 1. HEADER (New Addition) */}
        <Header />

        <div className={styles.backgroundOverlay}></div>

        <div className={styles.contentWrapper}>
            
            {/* 2. Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Mugna: The Global Marketplace for Artisans & Creators
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Unleash your craft. Connect directly with a world that values unique, handmade quality.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/signup" className={styles.primaryButton}>
                            Start Selling Today <MoveRight size={20} />
                        </Link>
                        <Link href="/login" className={styles.secondaryButton}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. Feature Grid Section */}
            <section className={styles.featureSection}>
                <h2 className={styles.sectionHeading}>Why Choose Mugna?</h2>
                <div className={styles.featureGrid}>
                
                <div className={styles.featureCard}>
                    <Globe className={styles.featureIcon} size={40} />
                    <h3 className={styles.cardTitle}>Global Reach</h3>
                    <p className={styles.cardText}>
                    Expand your customer base beyond local borders. Mugna connects you to buyers worldwide.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <Heart className={styles.featureIcon} size={40} />
                    <h3 className={styles.cardTitle}>Artisan Focused</h3>
                    <p className={styles.cardText}>
                    A platform built to highlight unique craftsmanship, not mass-produced goods.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <Zap className={styles.featureIcon} size={40} />
                    <h3 className={styles.cardTitle}>Powerful Admin Tools</h3>
                    <p className={styles.cardText}>
                    Manage inventory, track sales, and run promotions with our intuitive admin panel.
                    </p>
                </div>

                </div>
            </section>

            {/* 4. CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Ready to Share Your Art with the World?</h2>
                    <Link href="/signup" className={styles.primaryButton}>
                    Join Mugna Now
                    </Link>
                </div>
            </section>

            {/* 5. Footer (Simplified) */}
            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Mugna. All rights reserved. | <Link href="/login">Sign In</Link></p>
            </footer>
        </div>
    </div>
  );
}