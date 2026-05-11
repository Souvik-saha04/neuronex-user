/* import "./globals.css";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
 */


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

const navItems = [
  { href: '/user', icon: '🏠', label: 'Home' },
  { href: '/user/health_records', icon: '📄', label: 'Health Records' },
  { href: '/user/upload_prescription', icon: '📤', label: 'Upload Prescription' },
  { href: '/user/ai_alerts', icon: '🧠', label: 'AI Health Alerts' },
  { href: '/user/nearby_help', icon: '📍', label: 'Nearby Help' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <aside className={styles.sidebar}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <span>➕</span>
              </div>
              <div>
                <h1>MedAxis</h1>
                <p>Digital Health Records</p>
              </div>
            </div>

            <nav className={styles.nav}>
              <p className={styles.navLabel}>MENU</p>
              <ul className={styles.navMenu}>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.userCard}>
              <div className={styles.userAvatar}>RK</div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>Rajesh Kumar</p>
                <p className={styles.userId}>ID: MW001</p>
              </div>
            </div>

            <div className={styles.systemStatus}>
              <div className={styles.statusHeader}>
                <span className={styles.statusLabel}>System Status</span>
                <span className={styles.statusBadge}>Online</span>
              </div>
              <p className={styles.statusTime}>Last sync: 2 mins ago</p>
            </div>
          </aside>

          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}