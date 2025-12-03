// /app/home/CrafterCTA.tsx
"use client";

import Link from 'next/link';
import styles from "./HomePage.module.css";

export default function CrafterCTA() {
  return (
    <section className={styles.crafterCTA}>
      <div className={styles.ctaContent}>
        <h2 className={styles.ctaTitle}>Are you a Crafter?</h2>
        <p className={styles.ctaSubtitle}>
          Join the Mugna community and sell your creations to a global audience.
        </p>
        <Link href="/signup" className={styles.ctaButton}>
          Start Selling Today
        </Link>
      </div>
    </section>
  );
}