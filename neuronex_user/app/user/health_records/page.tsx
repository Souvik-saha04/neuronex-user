"use client";

import React, { useState } from "react";

import styles from "./page.module.css";

// ── SVG Icons ──
const SearchIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
);

const UploadIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const FilterIcon = () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const CopyIcon = () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

const ChevronDown = () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const LocationIcon = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const DocIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const EyeIcon = () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const DOCUMENTS = [
    { id: 1, name: "MRI Scan - Spine", date: "03/25/2025", size: "5.7 MB", type: "PDF" },
    { id: 2, name: "Blood Test - Complete Panel", date: "12/18/2024", size: "2.4 MB", type: "PDF" },
    { id: 3, name: "Eye Examination Report", date: "08/05/2023", size: "1.6 MB", type: "PDF" },
    { id: 4, name: "Arthritis Diagnosis Report", date: "01/10/2022", size: "2.1 MB", type: "PDF" },
];

const FAMILYDOCS = [
    {
        id: "mother",
        name: "Sunita Kumar", // Example name
        role: "Mother",
        idCode: "MW001-M",
        location: "Kolkata",
        phone: "+91 9584654422",
        docs: [
            { id: 101, name: "Mother's Cardiac Checkup", date: "04/12/2026", size: "3.2 MB" },
            { id: 102, name: "Mother's Pancreatic Checkup", date: "05/05/2026", size: "3.2 MB" },
        ]
    },
    {
        id: "father",
        name: "Ramesh Kumar", // Example name
        role: "Father",
        idCode: "MW001-F",
        location: "Kolkata",
        phone: "+91 9584654422",
        docs: [
            { id: 201, name: "Father's Diabetes Report", date: "11/20/2025", size: "4.5 MB" },
            { id: 202, name: "Father's General Checkup", date: "09/10/2026", size: "3.2 MB" },
        ]
    },
    {
        id: "daughter",
        name: "Souviksha Kumar",
        role: "Daughter",
        idCode: "MW001-D",
        location: "Kolkata",
        phone: "+91 8956423669",
        docs: [
            { id: 301, name: "Daughter's General Checkup Report", date: "11/20/2025", size: "2.9 MB" },
            { id: 302, name: "Daughter's Pneumonia Report", date: "11/20/2025", size: "3.5 MB" },
        ]
    }
];

// ── Component ─────────────────────────────────────────────────────────────
export default function HealthRecords() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("date");
    const [activeTab, setActiveTab] = useState("Personal");

    const filtered = DOCUMENTS.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles["hr-page"]}>

            {/* ── Header ── */}
            <header className={styles["hr-header"]}>
                <div className={styles["hr-header-left"]}>
                    <h1>My Health Records</h1>
                    <p>Rajesh Kumar - WK001</p>
                </div>

                <button className={styles["header-upload-btn"]}>
                    <UploadIcon />
                    <span>New Document</span>
                </button>

            </header>

            {/* ── Search ── */}
            <div className={styles["hr-search-wrap"]}>
                <div className={styles["hr-search"]}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles["hr-filter-row"]}>
                    <button className={styles["hr-filter-btn"]} aria-label="filter">
                        <FilterIcon />
                    </button>
                </div>

            </div>



            {/* ── Meta Bar ── */}
            <div className={styles["hr-meta-bar"]}>
                <span className={styles["hr-count"]}>{filtered.length} documents found</span>
                <button className={styles["hr-filtered-btn"]}>
                    <FilterIcon /> Filtered
                </button>
            </div>

            {/* ── buttons ── */}
            <div className={styles["hr-buttons"]}>
                <button
                    className={`${styles["hr-personal-btn"]} ${activeTab === "Personal" ? styles.selected : styles.unselected}`}
                    onClick={() => setActiveTab("Personal")}
                >
                    Personal
                </button>
                <button
                    className={`${styles["hr-family-btn"]} ${activeTab === "Family" ? styles.selected : styles.unselected}`}
                    onClick={() => setActiveTab("Family")}
                >
                    Family
                </button>
            </div>

            {/* ── Body ── */}
            <div className={styles["hr-body"]}>
                <div className={styles["hr-patient-card"]}>

                    {/* Patient Info */}
                    <div className={styles["hr-patient-info"]}>
                        <div className={styles["hr-patient-top"]}>
                            <div>
                                <div className={styles["hr-patient-name-row"]}>
                                    <span className={styles["hr-patient-name"]}>Rajesh Kumar</span>
                                    <span className={styles["hr-verified-badge"]}>Verified</span>
                                </div>
                                <div className={styles["hr-patient-id"]}>MW001</div>
                            </div>
                            <div className={styles["hr-patient-actions"]}>
                                {/* <button className={styles["hr-icon-btn"]} aria-label="Expand">
                                    <ChevronDown />
                                </button> */}
                            </div>
                        </div>

                        <div className={styles["hr-patient-location-row"]}>
                            <div className={styles["hr-location"]}>
                                <LocationIcon />
                                Kolkata
                            </div>
                            <div className={styles["hr-phone"]}>+91 9584654422</div>
                        </div>
                    </div>

                    {/* Document List */}
                    {/* <div className={styles["hr-doc-list"]}>
                        {filtered.map((doc) => (
                            <div className={styles["hr-doc-item"]} key={doc.id}>
                                <div className={styles["hr-doc-left"]}>
                                    <div className={styles["hr-doc-icon"]}><DocIcon /></div>
                                    <div>
                                        <div className={styles["hr-doc-name"]}>{doc.name}</div>
                                        <div className={styles["hr-doc-meta"]}>
                                            {doc.date} &bull; {doc.size} &bull; {doc.type}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles["hr-doc-actions"]}>
                                    <button className={styles["hr-icon-btn"]} aria-label="View">
                                        <EyeIcon />
                                    </button>
                                    <button className={styles["hr-icon-btn"]} aria-label="Download">
                                        <DownloadIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div> */}

                    {/* ── Document List Container ── */}
                    <div className={styles["hr-doc-list"]}>

                        {/* ── CONDITIONAL RENDERING Logic ── */}
                        <div className={styles["hr-list-container"]}>
                            {activeTab === "Personal" ? (
                                // 1. PERSONAL VIEW: Map through the flat list of files
                                DOCUMENTS.map((doc) => (
                                    <div className={styles["hr-doc-item"]} key={doc.id}>
                                        <div className={styles["hr-doc-left"]}>
                                            <div className={styles["hr-doc-icon"]}><DocIcon /></div>
                                            <div>
                                                <div className={styles["hr-doc-name"]}>{doc.name}</div>
                                                <div className={styles["hr-doc-meta"]}>
                                                    {doc.date} &bull; {doc.size} &bull; PDF
                                                </div>
                                            </div>
                                        </div>
                                        {/* ... action buttons ... */}
                                        <div className={styles["hr-doc-actions"]}>
                                            <button className={styles["hr-icon-btn"]} aria-label="View">
                                                <EyeIcon />
                                            </button>
                                            <button className={styles["hr-icon-btn"]} aria-label="Download">
                                                <DownloadIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // 2. FAMILY VIEW: Map through the list of PEOPLE
                                FAMILYDOCS.map((member) => (
                                    <FamilyMemberCard key={member.id} member={member} styles={styles} />
                                ))
                            )}
                        </div>
                    </div>


                </div>
            </div>

        </div>
    );
}

interface FamilyMember {
    id: string;
    name: string;
    role: string;
    idCode: string;
    location: string;
    phone: string;
    docs: Array<{ id: number; name: string; date: string; size: string }>;
}

function FamilyMemberCard({ member, styles }: { member: FamilyMember; styles: any }) {
    const [isOpen, setIsOpen] = React.useState(true); // Toggle state for accordion

    return (
        <div className={styles["hr-family-card"]} style={{ marginBottom: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
            {/* Header of the individual card */}
            <div className={styles["hr-doc-item"]} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
                <div className={styles["hr-doc-left"]}>
                    <div>
                        <div className={styles["hr-doc-name"]}>
                            {member.name} <span style={{ fontSize: '0.7rem', background: '#e0f2fes', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>{member.role}</span>
                        </div>
                        <div className={styles["hr-doc-meta"]}>
                            {member.idCode} • {member.location}
                        </div>
                    </div>
                </div>
                <div className={styles["hr-doc-actions"]}>
                    <button className={styles["hr-icon-btn"]} aria-label="Expand">
                        <ChevronDown />
                    </button>
                </div>
            </div>

            {/* The documents that show up when "isOpen" is true */}
            {isOpen && (
                <div style={{ padding: '0 15px 15px 15px' }}>
                    {member.docs.map((doc) => (
                        <div className={styles["hr-doc-item"]} key={doc.id} style={{ borderTop: '1px solid #cccccc', marginTop: '5px' }}>
                            <div className={styles["hr-doc-left"]}>
                                📄
                                <div style={{ marginLeft: '10px' }}>
                                    <div className={styles["hr-doc-name"]} style={{ fontSize: '0.9rem' }}>{doc.name}</div>
                                    <div className={styles["hr-doc-meta"]}>{doc.date} • {doc.size}</div>
                                </div>
                            </div>
                            <div className={styles["hr-doc-actions"]}>
                                <button className={styles["hr-icon-btn"]} aria-label="View">
                                    <EyeIcon />
                                </button>
                                <button className={styles["hr-icon-btn"]} aria-label="Download">
                                    <DownloadIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}