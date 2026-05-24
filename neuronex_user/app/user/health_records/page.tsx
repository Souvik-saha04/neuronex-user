// FILE: app/user/health-records/page.tsx

const records = [
  { id: 1, type: 'Medical History', title: 'Hypertension – Chronic', date: '12 Jan 2025', doctor: 'Dr. Priya Menon', hospital: 'Govt. Medical College, Kollam', icon: '🫀', status: 'Ongoing', statusColor: '#e65100' },
  { id: 2, type: 'Past Illness', title: 'Typhoid Fever – Recovered', date: '03 Aug 2024', doctor: 'Dr. Anil Kumar', hospital: 'Taluk Hospital, Kollam', icon: '🤒', status: 'Resolved', statusColor: '#2e7d32' },
  { id: 3, type: 'Prescription', title: 'Amlodipine 5mg – Monthly', date: '15 Mar 2025', doctor: 'Dr. Priya Menon', hospital: 'Govt. Medical College, Kollam', icon: '💊', status: 'Active', statusColor: '#1565c0' },
];

const vaccinations = [
  { name: 'COVID-19 (Covishield)', date: '22 Jun 2021', dose: 'Dose 2/2', icon: '💉', bg: '#e3f2fd' },
  { name: 'Hepatitis B', date: '10 Feb 2019', dose: 'Dose 3/3', icon: '💉', bg: '#e8f5e9' },
];

const summaryCards = [
  { label: 'Medical Records', value: '4', icon: '📁', bg: '#e3f2fd', accent: '#1565c0' },
  { label: 'Vaccinations', value: '2', icon: '💉', bg: '#e8f5e9', accent: '#2e7d32' },
  { label: 'Prescriptions', value: '3', icon: '💊', bg: '#f3e5f5', accent: '#7b1fa2' },
  { label: 'Lab Reports', value: '1', icon: '🧪', bg: '#fff3e0', accent: '#e65100' },
];

const filterTabs = ['All', 'Medical History', 'Vaccinations', 'Prescriptions', 'Lab Reports'];

export default function HealthRecordsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '32px 40px 60px', fontFamily: "'Segoe UI', Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', margin: '0 0 6px' }}>📋 Personal Health Records</h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Your complete medical history, all in one place</p>
        </div>
        <a href="/user/upload-prescription" style={{ background: '#1a6fc4', color: '#fff', fontSize: '0.88rem', fontWeight: 600, padding: '11px 22px', borderRadius: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          📤 Upload Prescription
        </a>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {summaryCards.map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {filterTabs.map((t, i) => (
          <button key={t} style={{ background: i === 0 ? '#1a6fc4' : '#fff', color: i === 0 ? '#fff' : '#475569', border: `1.5px solid ${i === 0 ? '#1a6fc4' : '#e2e8f0'}`, borderRadius: 20, padding: '7px 18px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Two Column */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>

        {/* Records List */}
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 14px' }}>Health Records</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {records.map((r) => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1.5px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ fontSize: '1.6rem', background: '#f0f4f8', borderRadius: 12, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8', display: 'block', marginBottom: 3 }}>{r.type}</span>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1a2332', margin: '0 0 5px' }}>{r.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 2px' }}>🩺 {r.doctor} · {r.hospital}</p>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>📅 {r.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: r.statusColor + '18', color: r.statusColor }}>{r.status}</span>
                  <button style={{ background: '#eff6ff', color: '#1a6fc4', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>View →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Vaccinations */}
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: 0 }}>Vaccination Records</h2>
          {vaccinations.map((v) => (
            <div key={v.name} style={{ background: v.bg, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '1.5rem' }}>{v.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a2332', margin: '0 0 3px' }}>{v.name}</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{v.dose} · {v.date}</p>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2e7d32', background: '#e8f5e9', padding: '4px 10px', borderRadius: 20 }}>✅ Complete</span>
            </div>
          ))}

          {/* Due Vaccine */}
          <div style={{ background: '#fff8e1', border: '1.5px solid #fbbf24', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#7a4f00', margin: '0 0 3px' }}>Influenza Vaccine Due</h3>
              <p style={{ fontSize: '0.78rem', color: '#92600a', margin: 0 }}>Annual flu shot recommended. Last taken: 2023</p>
            </div>
            <button style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Schedule</button>
          </div>

          {/* Tips */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '18px 20px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#14532d', margin: '0 0 10px' }}>💡 Health Tips for You</h3>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {['Monitor your blood pressure daily as advised', 'Take Amlodipine at the same time every day', 'Annual checkup overdue — book now'].map((tip) => (
                <li key={tip} style={{ fontSize: '0.83rem', color: '#166534', marginBottom: 6, lineHeight: 1.5 }}>{tip}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}