"use client"; // Required for Next.js client-side interactivity

import React from 'react';
import styles from './page.module.css';

// ── Icons ──────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07
      A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.63A2 2 0 012
      .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0
      01-.45 2.11L6.91 8.5a16 16 0 006.59 6.59l1.27-1.27a2 2 0
      012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
);

const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
const hospitals = [
    {
        name: 'City General Hospital',
        phone: '+1 (555) 123-4567',
        address: '123 Medical Center Dr, Downtown, CA 90210',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hospital_Seberang_Jaya.jpg/1200px-Hospital_Seberang_Jaya.jpg',
    },
    {
        name: 'Metro Health Center',
        phone: '+1 (555) 234-5678',
        address: '456 Healthcare Blvd, Midtown, CA 90211',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Wuhu_No.2_People%27s_Hospital_20120825.jpg/1200px-Wuhu_No.2_People%27s_Hospital_20120825.jpg',
    },
    {
        name: 'Victoria Hospital',
        phone: '+1 (555) 345-6789',
        address: '789 Wellness Ave, Uptown, CA 90212',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Victoria_Hospital_London.jpg/1200px-Victoria_Hospital_London.jpg',
    },
];

const doctors = [
    {
        name: 'Dr. Sarah Johnson',
        specialty: 'General Physician',
        phone: '+1 (555) 456-7890',
        address: '321 Physician Plaza, Suite 100, CA 90213',
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&auto=format&fit=crop',
    },
    {
        name: 'Dr. Michael Chen',
        specialty: 'Cardiologist',
        phone: '+1 (555) 567-8901',
        address: '654 Medical Park, Suite 200, CA 90214',
        img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop',
    },
    {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrician',
        phone: '+1 (555) 678-9012',
        address: '987 Care Center, Suite 300, CA 90215',
        img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop',
    },
];

const clinics = [
    {
        name: '24/7 Urgent Care Clinic',
        phone: '+1 (555) 789-0123',
        address: '147 Emergency Lane, Downtown, CA 90216',
        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aster_Labs_clinic.jpg/1200px-Aster_Labs_clinic.jpg',
    },
    {
        name: 'Express Medical Clinic',
        phone: '+1 (555) 890-1234',
        address: '258 Quick Care Rd, Midtown, CA 90217',
        img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop',
    },
    {
        name: 'Central Walk-In Clinic',
        phone: '+1 (555) 901-2345',
        address: '369 Family Health St, Uptown, CA 90218',
        img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop',
    },
];

// ── Card Component ─────────────────────────────────────────────────────────
interface HealthCardProps {
    name: string;
    phone: string;
    address: string;
    img: string;
    specialty?: string; // The '?' makes this optional!
}

// Update the function signature to use this interface
function HealthCard({ name, specialty, phone, address, img }: HealthCardProps) {

    return (
        <div className={styles.card}>
            <img
                className={styles["card-img"]}
                src={img}
                alt={name}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop';
                }}
            />
            <div className={styles["card-body"]}>
                <div className={styles["card-name"]}>{name}</div>
                {specialty && <div className={styles["card-specialty"]}>{specialty}</div>}
                <div className={styles["card-info"]}>
                    <PhoneIcon />
                    <span>{phone}</span>
                </div>
                <div className={styles["card-info"]}>
                    <LocationIcon />
                    <span>{address}</span>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function NearbyHelp() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles["header-title"]}>Nearby Help Support</h1>
                <p className={styles["header-subtitle"]}>Find Healthcare Services Near You • Real-time Availability</p>
            </header>

            <div className={styles["page-body"]}>

                {/* Hospitals */}
                <section className={styles.section}>
                    <h2 className={styles["section-heading"]}>Nearby Hospitals</h2>
                    <div className={styles["cards-grid"]}>
                        {hospitals.map((h, i) => (
                            <HealthCard key={i} {...h} />
                        ))}
                    </div>
                </section>

                {/* Doctors */}
                <section className={styles.section}>
                    <h2 className={styles["section-heading"]}>Available Doctors</h2>
                    <div className={styles["cards-grid"]}>
                        {doctors.map((d, i) => (
                            <HealthCard key={i} {...d} />
                        ))}
                    </div>
                </section>

                {/* Clinics */}
                <section className={styles.section}>
                    <h2 className={styles["section-heading"]}>24/7 Available Clinics</h2>
                    <div className={styles["cards-grid"]}>
                        {clinics.map((c, i) => (
                            <HealthCard key={i} {...c} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}