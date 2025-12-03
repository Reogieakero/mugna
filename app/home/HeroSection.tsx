// /app/home/HeroSection.tsx
"use client";

import Link from "next/link";
import styles from "./HomePage.module.css";

const getStaggerClass = (delay: number) =>
  `${styles.staggerIn} [animation-delay:${delay}ms]`;

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      {/* --- Background Video --- */}
      <video
        className={styles.backgroundVideo}
        src="/market-shop.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* --- Dark Overlay --- */}
      <div className={styles.backgroundOverlay}></div>

      {/* --- Content --- */}
      <div className={styles.heroContent}>
        <h1 className={`${styles.heroTitle} ${getStaggerClass(200)}`}>
          Crafted with Passion. Shared with the World.
        </h1>

        <p className={`${styles.heroSubtitle} ${getStaggerClass(400)}`}>
          Discover unique, handcrafted items from the heart of the artisan
          community.
        </p>

        <div className={`${styles.heroActions} ${getStaggerClass(600)}`}>
          <Link href="/products" className={styles.primaryButton}>
            Explore Products
          </Link>

          <Link href="/crafters" className={styles.secondaryButton}>
            Meet the Crafters
          </Link>
        </div>
      </div>
    </section>
  );
}