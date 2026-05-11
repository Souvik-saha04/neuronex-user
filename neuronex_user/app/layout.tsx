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

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';

const navItems = [
  { href: '/user', icon: '🏠', label: 'Home' },
  { href: '/user/health_records', icon: '📄', label: 'Health Records' },
  { href: '/user/ai_alert', icon: '🧠', label: 'AI Health Alerts' },
  { href: '/user/nearby_help', icon: '📍', label: 'Nearby Help' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Close the modal first so the "blur" and form vanish
    setShowModal(false);

    console.log("Login successful, redirecting...");

    // 2. Then move the user to the dashboard
    router.push('/user');
  };

  useEffect(() => {
    if (showModal || showProfileModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal, showProfileModal]);

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

            <div className={styles.sidebarBottom}>
              {isLandingPage ? (
                /* --- LANDING PAGE VIEW: Show Buttons --- */
                <div className={styles["auth-container"]}>
                  <button className={styles["login-btn"]} onClick={() => setShowModal(true)}>Log In</button>
                  <button className={styles["register-btn"]}>Create Account</button>
                  <p className={styles["auth-footer"]}>
                    Secure access via <strong>MedAxis ID</strong>
                  </p>
                </div>
              ) : (
                /* --- DASHBOARD VIEW: Show Profile --- */
                <div className={styles.userCard} onClick={() => setShowProfileModal(true)}>
                  <div className={styles.userAvatar}>RK</div>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>Rajesh Kumar</p>
                    <p className={styles.userId}>ID: MW001</p>
                  </div>
                </div>
              )}
            </div>

            {/* --- Authentication Section --- */}
            {/* <div className={styles["auth-container"]}>
              <button className={styles["login-btn"]} onClick={() => setShowModal(true)}>
                Log In
              </button>
              <button className={styles["register-btn"]} >
                Create Account
              </button>

            </div> */}

            {/* <div className={styles.systemStatus}>
              <div className={styles.statusHeader}>
                <span className={styles.statusLabel}>System Status</span>
                <span className={styles.statusBadge}>Online</span>
              </div>
              <p className={styles.statusTime}>Last sync: 2 mins ago</p>
            </div> */}

            {showModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  {/* Close Button */}
                  <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>

                  <h2>Email Verification</h2>
                  <br></br>
                  <p className={styles.modalSubtext}>Please enter your email id where the verification code is sent.</p>

                  <form className={styles.modalForm} onSubmit={handleLogin}>
                    <label>Email id</label>
                    <input type="text" placeholder="Enter Your Email ID" required />

                    <label className={styles.modalLabel}>OTP</label>
                    <div className={styles.otpInputWrapper}>
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className={styles.otpInput}
                        inputMode="numeric"
                        required
                      />
                      <button type="button" className={styles.resendBtn}>
                        Resend OTP?
                      </button>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Login
                    </button>
                  </form>
                </div>
              </div>
            )}

            {showProfileModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.profileModalContent}>
                  {/* Close Header */}
                  <div className={styles.profileHeader}>
                    <h3>User Profile</h3>
                    <button className={styles.closeBtn} onClick={() => setShowProfileModal(false)}>&times;</button>
                  </div>

                  {/* Profile Picture Section */}
                  <div className={styles.profileAvatarSection}>
                    <div className={styles.largeAvatar}>RK</div>
                    <h4>Rajesh Kumar</h4>
                    <span className={styles.verifiedBadge}>Verified Account</span>
                  </div>

                  {/* Credentials List */}
                  <div className={styles.profileInfoList}>
                    <div className={styles.infoItem}>
                      <label>MedAxis ID</label>
                      <p>MW001</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Email Address</label>
                      <p>rajesh.k@email.com</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Phone Number</label>
                      <p>+91 98546 54422</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Location</label>
                      <p>Kolkata, West Bengal</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className={styles.editProfileBtn} onClick={() => alert("Edit feature coming soon!")}>
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </aside>

          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}