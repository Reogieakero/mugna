"use client";

import AdminSidebar from "./AdminSidebar/AdminSidebar";
import AdminHeader from "./AdminHeader/AdminHeader";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <AdminSidebar />

      <div className={styles.content}>
        <AdminHeader />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}