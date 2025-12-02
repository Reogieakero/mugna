"use client";

import styles from "./AdminSidebar.module.css";
import { LayoutDashboard, Users, LogOut, ShoppingBag, Truck, BarChart2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Orders", href: "/admin/orders", icon: Truck },
  { name: "Stocks", href: "/admin/stocks", icon: BarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div> 
        <div className={styles.logo}>MUGNA ADMIN</div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <button className={styles.logoutBtn}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}