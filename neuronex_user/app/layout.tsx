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

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const BASE_URL="http://127.0.0.1:8000"
const navItems = [
  { href: '/user', icon: <FaHome />, label: 'Home' },
  { href: '/user/health_records', icon: <CgFileDocument />, label: 'Health Records' },
  { href: '/user/ai_alert', icon: <IoIosAlert />, label: 'AI Health Alerts' },
  { href: '/user/nearby_help', icon: <FaMapPin />, label: 'Nearby Help' },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [data,setData]=useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    const res=await fetch(`${BASE_URL}/accounts/login/`,
      {
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          "email":email,
          "password":password
        })

      }
    )
    const data= await res.json();
    if(res.ok)
    {
      setData(data);
      setShowModal(false);
      console.log("Login successful, redirecting...");
      router.push('/user');
    }
    else{
      console.log("Login Failed");
    }
    
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRegisterModal(true);
    console.log("Worker Registered. Redirecting...");
    router.push('/user');
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
                    <img className="w-full h-full"
                      src="/logo.png"
                      alt="Medaxis Logo"
                    />
                  </div>
                )}
                {!isCollapsed && (
                  <div className={styles.logoText}>
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
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {!isCollapsed && (
                <div className={styles.sidebarBottom}>
                  {isLandingPage ? (
                    <div className={styles["auth-container"]}>
                      <button className={styles["login-btn"]} onClick={() => setShowModal(true)}>Log In</button>
                      <button className={styles["register-btn"]} onClick={() => setShowRegisterModal(true)}>Create Account</button>
                      <p className={styles["auth-footer"]}>
                        Secure access via <strong>MedAxis ID</strong>
                      </p>
                    </div>
                  ) : (
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

              {showModal && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <button className={styles.closeBtn} onClick={() => setShowModal(false)}>&times;</button>

                    <h2>Email Verification</h2>
                    <br></br>
                    <p className={styles.modalSubtext}>Please enter your email id and the password.</p>

                    <form className={styles.modalForm} onSubmit={handleLogin}>
                      <label>Email id</label>
                      <input type="text" placeholder="Enter Your Email ID" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      <input type="text" placeholder="Enter Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      
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
                    <div className={styles.profileHeader}>
                      <h3>User Profile</h3>
                      <button className={styles.closeBtn} onClick={() => setShowProfileModal(false)}>&times;</button>
                    </div>

                    <div className={styles.profileAvatarSection}>
                      <div className={styles.largeAvatar}>RK</div>
                      <h4>{data.name}</h4>
                      <span className={styles.verifiedBadge}>Verified Account</span>
                    </div>

                    <div className={styles.profileInfoList}>
                      <div className={styles.infoItem}>
                        <label>MedAxis ID</label>
                        <p>M{data.id}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Email Address</label>
                        <p>{data.email}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Phone Number</label>
                        <p>{data.phno}</p>
                      </div>
                      <div className={styles.infoItem}>
                        <label>Location</label>
                        <p>{data.address}</p>
                      </div>
                    </div>

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