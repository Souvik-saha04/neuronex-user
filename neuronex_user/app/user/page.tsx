"use client";

import React from "react";
// 1. Import styles as an object to use CSS Modules
import styles from "./page.module.css";
import { IoCallSharp } from "react-icons/io5";
import { FaMapPin } from "react-icons/fa6";


// ── Icon helpers ──
// Define what the Icon component expects
interface IconProps {
  children: React.ReactNode;
  className?: string;
}

const Icon = ({ children, className }: IconProps) => (
  <span className={`${styles.icon} ${className || ""}`} aria-hidden="true">
    {children}
  </span>
);

// ── Data ──
const stats = [
  { icon: "👥", iconClass: "blue", value: "50,000+", label: "Active Users" },
  { icon: "✅", iconClass: "green", value: "100,000+", label: "Appointments" },
  { icon: "🛡️", iconClass: "purple", value: "100%", label: "Secure" },
];

const features = [
  {
    icon: "📅",
    iconClass: "blue",
    cardClass: "blue",
    name: "Book Appointments",
    desc: "Schedule appointments with healthcare providers.",
  },
  {
    icon: "📄",
    iconClass: "orange",
    cardClass: "orange",
    name: "Health Records",
    desc: "Access and manage medical records securely.",
  },
  {
    icon: "📞",
    iconClass: "red",
    cardClass: "red",
    name: "24/7 Support",
    desc: "Round-the-clock helpline and emergency contact.",
  },
];

const alerts = [
  { icon: "🔔", text: "3 document verification pending", type: "warning" },
  { icon: "✅", text: "Weekly report generation completed", type: "done" },
  { icon: "🕐", text: "2 health checkups overdue this month", type: "warning" },
];

// ── Component ──
export default function MedAxis() {
  return (
    // 2. Use styles['class-name'] for all classes
    <div className={styles["medaxis-wrapper"]}>

      {/* ── Hero ── */}
      <section className={styles["hero-section"]}>
        <div className={styles["hero-left"]}>
          <h1 className={styles["hero-title"]}>Welcome to MedAxis</h1>
          <p className={styles["hero-subtitle"]}>
            Empowering your health journey through digital innovation.
            Streamline your medical history, receive AI-driven health alerts, and connect with trusted local doctors instantly..
          </p>
          <button className={styles["btn-primary"]}>Access Health System</button>
        </div>

        {/* Quick Stats Card */}
        <div className={styles["quick-stats-card"]}>
          <div className={styles["quick-stats-title"]}>Quick Stats</div>
          {stats.map((s) => (
            <div className={styles["stat-item"]} key={s.label}>
              {/* Mapping dynamic classes like 'blue', 'green', 'purple' */}
              <div className={`${styles["stat-icon"]} ${styles[s.iconClass]}`}>{s.icon}</div>
              <div className={styles["stat-info"]}>
                <div className={styles["stat-value"]}>{s.value}</div>
                <div className={styles["stat-label"]}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles["features-section"]}>
        <h2 className={styles["features-title"]}>Our Features</h2>
        <div className={styles["features-grid"]}>
          {features.map((f) => (
            <div className={`${styles["feature-card"]} ${styles[f.cardClass]}`} key={f.name}>
              <div className={`${styles["feature-icon-wrap"]} ${styles[f.iconClass]}`}>{f.icon}</div>
              <div className={styles["feature-name"]}>{f.name}</div>
              <div className={styles["feature-desc"]}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Alerts ── */}
      <section className={styles["alerts-section"]}>
        <h3 className={styles["alerts-title"]}>Recent Alerts</h3>
        {alerts.map((a, i) => (
          <div className={`${styles["alert-item"]} ${styles[a.type]}`} key={i}>
            <div className={styles["alert-left"]}>
              <span className={styles["alert-icon"]}>{a.icon}</span>
              {a.text}
            </div>
            <span className={`${styles["alert-badge"]} ${styles[a.type]}`}>
              {a.type === "done" ? "Done" : "Warning"}
            </span>
          </div>
        ))}
      </section>

      {/* ---Emergency section--- */}
      <section className={styles["emergency-section"]}>
        <div className={styles["emergency-header"]}>
          <span>🔔</span>
          <span>Emergency Contacts</span>
        </div>
        <div className={styles["emergency-grid"]}>
          <div className={styles["emergency-card"]}>
            <div className={styles["emergency-card-label"]}>
              <IoCallSharp size={20} /> 24/7 Helpline
            </div>
            <div className={styles["emergency-card-value"]}>+91 90077 34643</div>
          </div>
          <div className={styles["emergency-card"]}>
            <div className={styles["emergency-card-label"]}>
              <FaMapPin size={20} /> Nearest Centre
            </div>
            <div className={styles["emergency-card-value"]}>Use STAR PG</div>
          </div>
        </div>
      </section>



    </div>
  );
}