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

// ── Component ─────────────────────────────────────────────────────────────
export default function HealthRecords() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("date");

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
                                <div className={styles["hr-patient-id"]}>WK001</div>
                            </div>
                            <div className={styles["hr-patient-actions"]}>
                                <button className={styles["hr-icon-btn"]} aria-label="Copy">
                                    <CopyIcon />
                                </button>
                                <button className={styles["hr-icon-btn"]} aria-label="Expand">
                                    <ChevronDown />
                                </button>
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
                    <div className={styles["hr-doc-list"]}>
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
                    </div>

                </div>
            </div>

        </div>
    );
}