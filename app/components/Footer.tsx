// /app/components/Footer.tsx
import styles from "../home/HomePage.module.css"; // NOTE: Import path may need adjustment

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Mugna. All rights reserved.</p>
    </footer>
  );
}