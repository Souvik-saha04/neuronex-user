"use client";

import React, { useState, useEffect } from "react";
// 1. Import styles from the module
import styles from "./page.module.css";

// ── Icon helpers (inline SVG) ──────────────────────────────────────────────
const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconActivity = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const IconNavigation = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
);

const IconClipboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
);

const IconCheckCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const IconXCircle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

const IconPen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const IconPhone = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.5a16 16 0 006.59 6.59l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const districts = [
    { name: 'Kollam', dot: 'dot-red', badge: 'avoid', label: 'Avoid Travel' },
    { name: 'Thiruvananthapuram', dot: 'dot-orange', badge: 'caution', label: 'Caution' },
    { name: 'Kochi', dot: 'dot-orange', badge: 'caution', label: 'Caution' },
    { name: 'Kozhikode', dot: 'dot-green', badge: 'low', label: 'Low Risk' },
    { name: 'Thrissur', dot: 'dot-green', badge: 'low', label: 'Low Risk' },
];

const protocols = [
    { color: '#e53935', icon: '🩺', title: 'Seek Medical Attention Immediately', desc: 'If you experience fever above 38°C, difficulty breathing, or persistent chest pain, call the hotline or visit the nearest health centre.' },
    { color: '#1976d2', icon: '🧪', title: 'Get Tested', desc: 'Free RT-PCR & rapid antigen tests available at all government hospitals and registered labs. Results within 24 hours.' },
    { color: '#fb8c00', icon: '🏠', title: 'Home Isolation Protocol', desc: 'Mild cases must isolate in a well-ventilated room for 10 days. Separate utensils, bathroom if possible. Inform your local health worker.' },
    { color: '#43a047', icon: '📱', title: 'Contact Tracing', desc: 'Enable Bluetooth on Arogya Setu app for automatic exposure notification. Report recent contacts to health authorities.' },
];

export default function App() {
    const [form, setForm] = useState({ name: '', phone: '', symptoms: '' });
    const [isMounted, setIsMounted] = useState(false);

    // Fix Hydration: Ensure client-only code runs after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        alert('Symptom report submitted! Thank you.');
        setForm({ name: '', phone: '', symptoms: '' });
    };

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <div className={styles["dashboard-container"]}>
            {/* ── HEADER ── */}
            <header className={styles.header}>
                <h1>COVID-19 Health Alert Dashboard</h1>
                <p>Kerala State Health Department • Real-time Updates</p>
            </header>

            {/* ── MAIN TWO-COLUMN GRID ── */}
            <div className={styles["main-content"]}>

                {/* LEFT COLUMN */}
                <div className={styles["left-col"]}>

                    {/* Threat Level */}
                    <div className={`${styles.card} ${styles["threat-card"]}`}>
                        <div className={styles["card-label"]}>
                            <IconAlert />
                            CURRENT THREAT LEVEL
                        </div>
                        <div className={styles["threat-bar-bg"]}>
                            <div className={styles["threat-bar-fill"]} />
                        </div>
                        <div className={styles["threat-status"]}>
                            <div className={styles["threat-status-label"]}>
                                <span className={styles["dot-red"]} />
                                HIGH — Immediate Action Required
                            </div>
                            <span className={styles["threat-percent"]}>82%</span>
                        </div>
                    </div>

                    {/* Outbreak Information */}
                    <div className={`${styles.card} ${styles["outbreak-card"]}`}>
                        <div className={styles["section-title"]}>
                            <IconActivity />
                            Outbreak Information
                        </div>
                        <div className={styles["outbreak-name"]}>COVID-19</div>
                        <div className={styles["stats-row"]}>
                            <div className={styles["stat-item"]}>
                                <div className={`${styles["stat-value"]} ${styles.red}`}>1,100</div>
                                <div className={styles["stat-label"]}>Confirmed Cases</div>
                            </div>
                            <div className={styles["stat-item"]}>
                                <div className={`${styles["stat-value"]} ${styles.orange}`}>900</div>
                                <div className={styles["stat-label"]}>Active Cases</div>
                            </div>
                            <div className={styles["stat-item"]}>
                                <div className={`${styles["stat-value"]} ${styles.green}`}>200</div>
                                <div className={styles["stat-label"]}>Recovered</div>
                            </div>
                            <div className={styles["stat-item"]}>
                                <div className={`${styles["stat-value"]} ${styles.blue}`}>12</div>
                                <div className={styles["stat-label"]}>Critical Care</div>
                            </div>
                        </div>
                        <div className={styles["info-row"]}><strong>Transmission :</strong> Coughs, Sneezes, Breathes, Aerosols</div>
                        <div className={styles["info-row"]}><strong>Symptoms :</strong> Fever, Cough, Tiredness, Loss of taste/smell</div>
                        <div className={styles["info-row"]}><strong>Incubation Period :</strong> 2 – 14 days</div>
                        <div className={styles["info-row"]}><strong>Fatality Rate :</strong> ~1.2%</div>
                        <div className={styles["info-row"]}><strong>Variant in Circulation :</strong> JN.1</div>
                    </div>

                    {/* Safety Guidelines */}
                    <div className={`${styles.card} ${styles["safety-card"]}`}>
                        <div className={styles["section-title"]}>
                            <IconCheckCircle />
                            Safety Guidelines
                        </div>
                        <div className={styles["safety-grid"]}>
                            <div className={styles["dos-box"]}>
                                <div className={`${styles["box-title"]} ${styles["dos-title"]}`}>
                                    <IconCheckCircle /> DO's
                                </div>
                                <ul className={styles["guideline-list"]}>
                                    {[
                                        'Wash hands often with soap', 'Wear a well-fitted mask',
                                        'Maintain 6 ft distance', 'Cover cough & sneeze',
                                        'Stay home if unwell', 'Drink plenty of fluids',
                                    ].map((item, i) => (
                                        <li key={i}><span className={styles["dot-green"]} />{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles["donts-box"]}>
                                <div className={`${styles["box-title"]} ${styles["donts-title"]}`}>
                                    <IconXCircle /> DON'Ts
                                </div>
                                <ul className={styles["guideline-list"]}>
                                    {[
                                        "Don't touch face", "Don't share personal items",
                                        "Don't ignore symptoms", "Don't go to crowded places",
                                        "Don't spread rumors", "Don't skip meds",
                                    ].map((item, i) => (
                                        <li key={i}><span className={styles["dot-red"]} />{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className={styles["right-col"]}>

                    {/* Travel Advisory */}
                    <div className={`${styles.card} ${styles["travel-card"]}`}>
                        <div className={styles["travel-title"]}>
                            <IconNavigation /> District Travel Advisory
                        </div>
                        {districts.map((d, i) => (
                            <div className={styles["district-row"]} key={i}>
                                <div className={styles["district-name"]}>
                                    <span className={styles[d.dot]} /> {d.name}
                                </div>
                                <span className={`${styles.badge} ${styles[d.badge]}`}>{d.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Report Symptoms */}
                    <div className={styles["report-card"]}>
                        <div className={styles["report-title"]}>
                            <IconClipboard /> Report Your Symptoms
                        </div>
                        <input className={styles["form-input"]} type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
                        <input className={styles["form-input"]} type="tel" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
                        <textarea className={styles["form-textarea"]} name="symptoms" placeholder="Describe symptoms..." value={form.symptoms} onChange={handleChange} />
                        <button className={styles["submit-btn"]} onClick={handleSubmit}>
                            <IconClipboard /> Submit Symptom Report
                        </button>
                    </div>

                    {/* Vaccination Drive */}
                    <div className={styles["vaccine-card"]}>
                        <div className={styles["vaccine-title"]}><IconPen /> District Vaccination Drive</div>
                        <div className={styles["vaccine-subtitle"]}>Kollam District — Free booster doses</div>
                        <div className={styles["vaccine-bar-row"]}>
                            <span className={styles["vaccine-bar-label"]}>Population coverage</span>
                            <span className={styles["vaccine-bar-pct"]}>63%</span>
                        </div>
                        <div className={styles["vaccine-bar-bg"]}>
                            <div className={styles["vaccine-bar-fill"]} />
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION */}
            {/* <div className={styles["bottom-grid"]}>
                <div className={styles["hotline-card"]}>
                    <div className={styles["hotline-label"]}>Emergency Helpline</div>
                    <div className={styles["hotline-number"]}>1800-599-0019</div>
                    <button className={styles["call-btn"]}><IconPhone /> Call Now</button>
                </div>
            </div> */}

            {/* Official Health Protocols */}
            <div className={styles["protocols-section"]}>
                <div className={styles["protocols-card"]}>
                    <div className={styles["protocols-title"]}><IconClipboard /> Official Health Protocols</div>
                    {protocols.map((p, i) => (
                        <div className={styles["protocol-item"]} key={i}>
                            <div className={styles["protocol-bar"]} style={{ background: p.color }} />
                            <div className={styles["protocol-icon"]}>{p.icon}</div>
                            <div className={styles["protocol-body"]}>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}