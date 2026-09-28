"use client";

import React, { useState, useEffect } from "react";
import { FolderOpen, SearchX, AlertCircle, Loader2, Upload, RefreshCw, LogIn } from "lucide-react";
import styles from "./page.module.css";

const BASE_URL = "http://127.0.0.1:8000";

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

const primaryBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#1a6fc4",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 20px",
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
} as const;

function StateMessage({
    icon,
    title,
    text,
    color = "#1a6fc4",
    background = "#e3f2fd",
    children,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
    color?: string;
    background?: string;
    children?: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "56px 24px", gap: 8 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                {icon}
            </div>
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1a2332" }}>{title}</h3>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b", maxWidth: 320, lineHeight: 1.5 }}>{text}</p>
            {children && <div style={{ marginTop: 16 }}>{children}</div>}
        </div>
    );
}


interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    address: string;
    phno: string;
}

interface Document {
    id: number;
    title: string;
    document_type: string;
    document_date: string | null;
    file_url: string;
    file_name: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
}

function formatSize(bytes: number): string {
    if (!bytes) return "0 KB";
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(value: string | null): string {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
}

export default function HealthRecords() {
    const [user, setUser] = useState<User | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("medaxis_user");
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem("medaxis_token");

        fetch(`${BASE_URL}/accounts/documents/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();
            })
            .then((data) => {
                setDocuments(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setLoadError("Could not load your documents. Please log in again.");
                setLoading(false);
            });
    }, [user]);
    const filteredDocs = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const renderDocuments = () => {
    if (loading) {
        return (
            <StateMessage
                icon={<Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />}
                title="Loading your documents"
                text="Just a moment..."
            />
        );
    }

    if (!user) {
        return (
            <StateMessage
                icon={<LogIn size={32} />}
                title="You're not logged in"
                text="Log in to see your health records."
            />
        );
    }

    if (loadError) {
        return (
            <StateMessage
                icon={<AlertCircle size={32} />}
                color="#c0392b"
                background="#fdecea"
                title="Something went wrong"
                text={loadError}
            >
                <button style={primaryBtn} onClick={() => window.location.reload()}>
                    <RefreshCw size={16} /> Try Again
                </button>
            </StateMessage>
        );
    }

    if (documents.length === 0) {
        return (
            <StateMessage
                icon={<FolderOpen size={32} />}
                title="No documents yet"
                text="Upload your prescriptions, reports and scans to keep them all in one place."
            >
                <a href="/user/upload-prescription" style={primaryBtn}>
                    <Upload size={16} /> Upload Your First Document
                </a>
            </StateMessage>
        );
    }

    if (filteredDocs.length === 0) {
        return (
            <StateMessage
                icon={<SearchX size={32} />}
                title="No matching documents"
                text={`We couldn't find anything matching "${searchQuery}".`}
            >
                <button style={primaryBtn} onClick={() => setSearchQuery("")}>
                    Clear Search
                </button>
            </StateMessage>
        );
    }

    return filteredDocs.map((doc) => (
        <div className={styles["hr-doc-item"]} key={doc.id}>
            <div className={styles["hr-doc-left"]}>
                <div className={styles["hr-doc-icon"]}><DocIcon /></div>
                <div>
                    <div className={styles["hr-doc-name"]}>{doc.title}</div>
                    <div className={styles["hr-doc-meta"]}>
                        {formatDate(doc.document_date || doc.uploaded_at)} &bull; {formatSize(doc.file_size)} &bull; {doc.document_type}
                    </div>
                </div>
            </div>
            <div className={styles["hr-doc-actions"]}>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className={styles["hr-icon-btn"]} aria-label="View">
                    <EyeIcon />
                </a>
                <a href={doc.file_url} download={doc.file_name} className={styles["hr-icon-btn"]} aria-label="Download">
                    <DownloadIcon />
                </a>
            </div>
        </div>
    ));
};
    return (
        <div className={styles["hr-page"]}>

            <header className={styles["hr-header"]}>
                <div className={styles["hr-header-left"]}>
                    <h1>My Health Records</h1>
                    <p>{user ? `${user.first_name} ${user.last_name} - M${user.id}` : "Not logged in"}</p>
                </div>

                <a href="/user/upload_doc" style={primaryBtn}>
                    <Upload size={16} /> Upload Your First Document
                </a>
            </header>

            <div className={styles["hr-search-wrap"]}>
                <div className={styles["hr-search"]}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles["hr-filter-row"]}>
                    <button className={styles["hr-filter-btn"]} aria-label="filter">
                        <FilterIcon />
                    </button>
                </div>
            </div>

            <div className={styles["hr-meta-bar"]}>
                <span className={styles["hr-count"]}>
                    {filteredDocs.length} {filteredDocs.length === 1 ? "document" : "documents"} found
                </span>
            </div>

            <div className={styles["hr-body"]}>
                <div className={styles["hr-patient-card"]}>

                    <div className={styles["hr-patient-info"]}>
                        <div className={styles["hr-patient-top"]}>
                            <div>
                                <div className={styles["hr-patient-name-row"]}>
                                    <span className={styles["hr-patient-name"]}>
                                        {user ? `${user.first_name} ${user.last_name}` : "—"}
                                    </span>
                                    {user && <span className={styles["hr-verified-badge"]}>Verified</span>}
                                </div>
                                <div className={styles["hr-patient-id"]}>{user ? `M${user.id}` : ""}</div>
                            </div>
                        </div>

                        <div className={styles["hr-patient-location-row"]}>
                            <div className={styles["hr-location"]}>
                                <LocationIcon />
                                {user?.address || "Not provided"}
                            </div>
                            <div className={styles["hr-phone"]}>{user?.phno || "Not provided"}</div>
                        </div>
                    </div>

                    <div className={styles["hr-doc-list"]}>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        {renderDocuments()}
                    </div>
                </div>
            </div>
        </div>
    );
}