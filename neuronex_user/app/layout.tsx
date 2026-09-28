'use client';
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import "./globals.css";
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';
import { FaHome, FaMapPin } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import { IoIosAlert } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { UploadCloud } from 'lucide-react';



const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const BASE_URL = "http://127.0.0.1:8000";

const navItems = [
  { href: '/user', icon: <FaHome />, label: 'Home' },
  { href: '/user/health_records', icon: <CgFileDocument />, label: 'Health Records' },
  { href: '/user/ai_alert', icon: <IoIosAlert />, label: 'AI Health Alerts' },
  { href: '/user/nearby_help', icon: <FaMapPin />, label: 'Nearby Help' },
  { href: '/user/upload_doc', icon: <UploadCloud />, label: 'upload doc' },
];

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  state: string;
  pincode: string;
  phno: string;
}

interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phno: string;
  address: string;
  state: string;
  pincode: string;
}

const initialRegisterForm: RegisterForm = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phno: "",
  address: "",
  state: "",
  pincode: "",
};

function getDisplayName(user: User): string {
  return `${user.first_name} ${user.last_name}`.trim() || user.email;
}

function getInitials(user: User): string {
  const first = user.first_name?.[0] ?? "";
  const last = user.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [registerForm, setRegisterForm] = useState<RegisterForm>(initialRegisterForm);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("medaxis_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${BASE_URL}/accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        setUser(result.user);
        localStorage.setItem("medaxis_user", JSON.stringify(result.user));
        localStorage.setItem("medaxis_token", result.access);
        localStorage.setItem("medaxis_refresh", result.refresh);
        setShowModal(false);
        setEmail("");
        setPassword("");
        router.push('/user');
      } 
      else {
        setLoginError(result?.message || result?.detail || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setLoginError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");

    try {
      const res = await fetch(`${BASE_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const result = await res.json();

      if (res.ok) {
        setShowRegisterModal(false);
        setRegisterForm(initialRegisterForm);
        router.push('/user');
      } else {
        const firstError =
          typeof result === "object" ? Object.values(result).flat()[0] : undefined;
        setRegisterError(
          (firstError as string) || "Registration failed. Please check your details."
        );
      }
    } catch (err) {
      console.error("Registration request failed:", err);
      setRegisterError("Could not reach the server. Please try again.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("medaxis_user");
    localStorage.removeItem("medaxis_token");
    localStorage.removeItem("medaxis_refresh");
    setShowProfileModal(false);
    router.push('/');
};

  useEffect(() => {
    if (showModal || showProfileModal || showRegisterModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
  }, [showModal, showProfileModal, showRegisterModal]);

  return (
    <>
      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body>
          <div className={`${styles.container} ${isCollapsed ? styles.collapsed : ''}`}>
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsedSidebar : ''}`}>
              <div className={styles.logo}>
                {!isCollapsed && (
                  <div className={styles.logoIcon}>
                    <img className="w-full h-full" src="/logo.png" alt="Medaxis Logo" />
                  </div>
                )}
                {!isCollapsed && <div className={styles.logoText}></div>}
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
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {!isCollapsed && (
                <div className={styles.sidebarBottom}>
                  {!user ? (
                    <div className={styles["auth-container"]}>
                      <button className={styles["login-btn"]} onClick={() => setShowModal(true)}>
                        Log In
                      </button>
                      <button className={styles["register-btn"]} onClick={() => setShowRegisterModal(true)}>
                        Create Account
                      </button>
                      <p className={styles["auth-footer"]}>
                        Secure access via <strong>MedAxis ID</strong>
                      </p>
                    </div>
                  ) : (
                    <div className={styles.userCard} onClick={() => setShowProfileModal(true)}>
                      <div className={styles.userAvatar}>{getInitials(user)}</div>
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{getDisplayName(user)}</p>
                        <p className={styles.userId}>ID: M{user.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showModal && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                      &times;
                    </button>

                    <h2>Email Verification</h2>
                    <br />
                    <p className={styles.modalSubtext}>Please enter your email id and the password.</p>

                    <form className={styles.modalForm} onSubmit={handleLogin}>
                      <label>Email id</label>
                      <input
                        type="email"
                        placeholder="Enter Your Email ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="Enter Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />

                      {loginError && <p className={styles.errorText}>{loginError}</p>}

                      <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {showProfileModal && user && (
                <div className={styles.modalOverlay}>
                  <div className={styles.profileModalContent}>
                    <div className={styles.profileHeader}>
                      <h3>User Profile</h3>
                      <button className={styles.closeBtn} onClick={() => setShowProfileModal(false)}>
                        &times;
                      </button>
                    </div>

                    <div className={styles.profileAvatarSection}>
                      <div className={styles.largeAvatar}>{getInitials(user)}</div>
                      <h4>{getDisplayName(user)}</h4>
                      <span className={styles.verifiedBadge}>Verified Account</span>
                    </div>

                    <div className={styles.profileInfoList}>
                      <div className={styles.infoItem}>
                        <label>MedAxis ID</label>
                        <p>M{user.id}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Email Address</label>
                        <p>{user.email}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Phone Number</label>
                        <p>{user.phno || "Not provided"}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Location</label>
                        <p>{user.address || "Not provided"}</p>
                      </div>
                    </div>

                    <button className={styles.editProfileBtn} onClick={() => alert("Edit feature coming soon!")}>
                      Edit Profile
                    </button>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "10px 24px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showRegisterModal && (
                <div className={styles.modalOverlay}>
                  <div className={`${styles.modalContent} ${styles.scrollableModal}`}>
                    <button
                      className={styles.closeBtn}
                      onClick={() => {
                        setShowRegisterModal(false);
                        setRegisterError("");
                      }}
                    >
                      &times;
                    </button>

                    <h2 className={styles.formMainTitle}>Register New Migrant Worker</h2>

                    <form className={styles.registrationForm} onSubmit={handleRegister}>
                      <div className={styles.formSectionBox}>
                        <h3>Personal Information</h3>
                        <label>First Name *</label>
                        <input
                          type="text"
                          name="first_name"
                          placeholder="Enter Your First Name"
                          value={registerForm.first_name}
                          onChange={handleRegisterChange}
                          required
                        />

                        <label>Last Name *</label>
                        <input
                          type="text"
                          name="last_name"
                          placeholder="Enter Your Last Name"
                          value={registerForm.last_name}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>

                      <div className={styles.formSectionBox}>
                        <h3>Contact Information</h3>
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="email@example.com"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          required
                        />

                        <label>Password *</label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Create a password"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          required
                        />

                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phno"
                          placeholder="Enter Phone Number"
                          value={registerForm.phno}
                          onChange={handleRegisterChange}
                        />
                      </div>

                      <div className={styles.formSectionBox}>
                        <h3>Address Information</h3>
                        <label>Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Enter Your Address"
                          value={registerForm.address}
                          onChange={handleRegisterChange}
                        />

                        <label>State</label>
                        <select name="state" value={registerForm.state} onChange={handleRegisterChange}>
                          <option value="">Select State</option>
                          <option value="kerala">Kerala</option>
                          <option value="west-bengal">West Bengal</option>
                        </select>

                        <label>Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          placeholder="Enter Pincode"
                          maxLength={6}
                          value={registerForm.pincode}
                          onChange={handleRegisterChange}
                        />
                      </div>

                      {registerError && <p className={styles.errorText}>{registerError}</p>}

                      <button type="submit" className={styles.submitBtn} disabled={registerLoading}>
                        {registerLoading ? "Submitting..." : "Submit Registration"}
                      </button>
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