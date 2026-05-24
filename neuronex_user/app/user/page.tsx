// FILE: app/user/page.tsx

const recentAlerts = [
  { color: '#f39c12', label: '3 document verification pending', tag: 'Warning', tagColor: '#f39c12' },
  { color: '#3498db', label: 'Weekly report generation completed', tag: 'Done', tagColor: '#27ae60' },
  { color: '#f39c12', label: '2 health checkups overdue this month', tag: 'Warning', tagColor: '#f39c12' },
];

const quickLinks = [
  { icon: '🚨', label: 'Emergency Contacts', sub: 'View all emergency numbers' },
  { icon: '📞', label: '24/7 Helpline Number', sub: '1056 (Toll Free)' },
  { icon: '🏥', label: 'Nearest Health Centre', sub: 'Use location services in app' },
];

const healthStats = [
  { value: '4', label: 'Health Records', icon: '📋', bg: '#e3f2fd', accent: '#1976d2' },
  { value: '2', label: 'Vaccinations', icon: '💉', bg: '#e8f5e9', accent: '#2e7d32' },
  { value: '1', label: 'Active Alert', icon: '⚠️', bg: '#fff3cd', accent: '#856404' },
  { value: '3', label: 'Documents', icon: '📄', bg: '#f3e5f5', accent: '#7b1fa2' },
];

export default function UserHomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '32px 40px 60px', fontFamily: "'Segoe UI', Inter, sans-serif" }}>

      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a2332', margin: '0 0 4px' }}>Welcome back, Rajesh 👋</h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>Access your health records and stay informed</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 14px', fontSize: '0.85rem', color: '#475569', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <span>📍</span><span>Kollam, Kerala, India</span>
        </div>
      </div>

      {/* Hero Card */}
      <div style={{ background: 'linear-gradient(135deg,#1a6fc4,#0d4f9e 60%,#0a3d7a)', borderRadius: 20, padding: '36px 40px', marginBottom: 28, display: 'flex', alignItems: 'center', boxShadow: '0 8px 32px rgba(26,111,196,0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, zIndex: 1 }}>
          <div style={{ fontSize: '2.8rem', background: 'rgba(255,255,255,0.15)', borderRadius: 18, width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>➕</div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Welcome to MedAxis</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 18px', maxWidth: 480, lineHeight: 1.55 }}>
              Access comprehensive healthcare services, manage your health records, and stay connected with Kerala's digital health infrastructure.
            </p>
            <a href="/user/health-records" style={{ display: 'inline-block', background: '#fff', color: '#1a6fc4', fontWeight: 600, fontSize: '0.88rem', padding: '10px 22px', borderRadius: 10, textDecoration: 'none' }}>
              Access Health System
            </a>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
        {healthStats.map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 16, padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <span style={{ fontSize: '1.9rem', fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Two Column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Recent Alerts */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 16px' }}>Recent alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentAlerts.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ fontSize: '0.875rem', color: '#334155', flex: 1 }}>{a.label}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: a.tagColor + '22', color: a.tagColor }}>{a.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 16px' }}>Quick Access</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickLinks.map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, cursor: 'pointer' }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{q.icon}</span>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a2332', margin: '0 0 2px' }}>{q.label}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>{q.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outbreak Banner */}
      <div style={{ background: 'linear-gradient(135deg,#fff3cd,#ffe082)', border: '1.5px solid #f6c90e', borderRadius: 16, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(246,201,14,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '1.8rem' }}>⚠️</span>
          <div>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7a4f00', margin: '0 0 4px' }}>Active Disease Outbreak – COVID-19</p>
            <p style={{ fontSize: '0.83rem', color: '#92600a', margin: 0 }}>520 confirmed cases in your region. Stay alert and follow safety guidelines.</p>
          </div>
        </div>
        <a href="/user/ai-alerts" style={{ background: '#e65100', color: '#fff', fontSize: '0.85rem', fontWeight: 600, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}>
          View AI Alerts →
        </a>
      </div>

    </div>
  );
}