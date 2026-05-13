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
import NextImage from 'next/image';
import { FaHome, FaMapPin } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { IoIosAlert } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const navItems = [
  { href: '/user', icon: <FaHome />, label: 'Home' },
  { href: '/user/health_records', icon: <CgFileDocument />, label: 'Health Records' },
  { href: '/user/ai_alert', icon: <IoIosAlert />, label: 'AI Health Alerts' },
  { href: '/user/nearby_help', icon: <FaMapPin />, label: 'Nearby Help' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Close the modal first so the "blur" and form vanish
    setShowModal(false);

    console.log("Login successful, redirecting...");

    // 2. Then move the user to the dashboard
    router.push('/user');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading

    // 1. Close the modal instantly
    setShowRegisterModal(false);

    console.log("Worker Registered. Redirecting...");

    // 2. Send them to the dashboard
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
    <>
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body>
          <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsedSidebar : ''}`}>
              <div className={styles.logo}>
                {!isCollapsed && (
                  <div className={styles.logoIcon}>
                    <NextImage
                      src="/logo.png"
                      alt="Medaxis Logo"
                      width={140}
                      height={140}
                      priority
                    />
                  </div>
                )}
                {!isCollapsed && (
                  <div className={styles.logoText}>
                    <h1 className={styles["logo-text-wrapper"]}>MedAxis</h1>
                    <p className={styles["logo-text-wrapper"]}>Digital Health Records</p>
                  </div>
                )}
                <button className={styles.menuButton} onClick={() => setIsCollapsed(!isCollapsed)}>
                  <IoMenu size={24} />
                </button>
              </div>

              <nav className={styles.nav}>
                {!isCollapsed && <p className={styles.navLabel}>MENU</p>}
                <ul className={styles.navMenu}>
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                      >
                        <span className={styles.navIcon}>{item.icon}</span>
                        {/* 5. Hide label when collapsed */}
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {!isCollapsed && (
                <div className={styles.sidebarBottom}>
                  {isLandingPage ? (
                    /* --- LANDING PAGE VIEW: Show Buttons --- */
                    <div className={styles["auth-container"]}>
                      <button className={styles["login-btn"]} onClick={() => setShowModal(true)}>Log In</button>
                      <button className={styles["register-btn"]} onClick={() => setShowRegisterModal(true)}>Create Account</button>
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
              )}

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

              {showRegisterModal && (
                <div className={styles.modalOverlay}>
                  <div className={`${styles.modalContent} ${styles.scrollableModal}`}>
                    <button className={styles.closeBtn} onClick={() => setShowRegisterModal(false)}>&times;</button>

                    <h2 className={styles.formMainTitle}>Register New Migrant Worker</h2>

                    <form className={styles.registrationForm} onSubmit={handleRegister}>

                      {/* Section 1: Personal Information */}
                      <div className={styles.formSectionBox}>
                        <h3>Personal Information</h3>
                        <label>Full Name *</label>
                        <input type="text" placeholder="Enter Your Name" required />

                        <label>Date of Birth *</label>
                        <input type="date" required />

                        <div className={styles.radioGroup}>
                          <label>Gender *</label>
                          <input type="radio" name="gender" value="male" /> Male
                          <input type="radio" name="gender" value="female" /> Female
                          <input type="radio" name="gender" value="others" /> Others
                        </div>

                        <label>Father's Name *</label>
                        <input type="text" placeholder="Enter Your Father's Name" required />

                        <label>Address Information *</label>
                        <select required>
                          <option value="">Select State</option>
                          <option value="kerala">Kerala</option>
                          <option value="west-bengal">West Bengal</option>
                        </select>
                      </div>

                      {/* Section 2: Contact Information */}
                      <div className={styles.formSectionBox}>
                        <h3>Contact Information</h3>
                        <label>Mobile Number *</label>
                        <input type="tel" placeholder="Enter Mobile Number" required />

                        <label>Email *</label>
                        <input type="email" placeholder="email@example.com" required />
                      </div>

                      {/* Section 3: Identity Documents */}
                      <div className={styles.formSectionBox}>
                        <h3>Identity Documents</h3>
                        <label>Aadhar Number *</label>
                        <input type="text" placeholder="XXXX XXXX XXXX" maxLength={12} required />
                      </div>

                      {/* Section 4: Employment Information */}
                      <div className={styles.formSectionBox}>
                        <h3>Employment Information</h3>
                        <label>Occupation</label>
                        <select>
                          <option value="">Select Occupation</option>
                          <option value="construction">Construction</option>
                          <option value="agriculture">Agriculture</option>
                          <option value="manufacturing">Manufacturing</option>
                        </select>
                      </div>

                      <button type="submit" className={styles.submitBtn}>Submit Registration</button>
                    </form>
                  </div>
                </div>
              )}
            </aside>

            <main className={styles.main}>{children}</main>
          </div>
        </body>
      </html>
    </>
  );

}