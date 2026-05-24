// FILE: app/user/ai-alerts/page.tsx

const alerts = [
  {
    id: 1,
    severity: 'high',
    icon: '🦟',
    title: 'You may be at risk of Dengue',
    body: 'There are 112 active dengue cases within 5 km of your location. Your area has stagnant water reports. Symptoms to watch: high fever, joint pain, rash.',
    action: 'Get checkup at nearest clinic',
    actionLink: '/user/nearby-clinics',
    time: '2 hours ago',
    badge: 'AI Risk Alert',
    bg: '#fff5f5',
    border: '#fca5a5',
    badgeBg: '#fde8e8',
    badgeColor: '#c0392b',
    dot: '#c0392b',
  },
  {
    id: 2,
    severity: 'medium',
    icon: '😷',
    title: 'COVID-19 Outbreak in Your Region',
    body: "520 confirmed cases in Kollam district this week. You are not fully vaccinated for this year's variant. Consider wearing a mask in crowded places.",
    action: 'View safety guidelines',
    actionLink: '/user/ai-alerts/covid',
    time: '6 hours ago',
    badge: 'Outbreak Alert',
    bg: '#fffbeb',
    border: '#fcd34d',
    badgeBg: '#fff3e0',
    badgeColor: '#e65100',
    dot: '#e65100',
  },
  {
    id: 3,
    severity: 'info',
    icon: '💉',
    title: 'Flu Vaccine Reminder',
    body: 'Annual influenza vaccination is due. Getting vaccinated reduces your risk by up to 60%. Free vaccination available at government health centres.',
    action: 'Find vaccination centre',
    actionLink: '/user/nearby-clinics',
    time: '1 day ago',
    badge: 'Preventive Care',
    bg: '#f0f9ff',
    border: '#7dd3fc',
    badgeBg: '#e0f2fe',
    badgeColor: '#0369a1',
    dot: '#0369a1',
  },
  {
    id: 4,
    severity: 'info',
    icon: '🩺',
    title: 'Annual Health Checkup Overdue',
    body: "Your last full-body checkup was over 14 months ago. As someone with hypertension, it's important to get checked every 6 months.",
    action: 'Book appointment',
    actionLink: '/user/nearby-clinics',
    time: '3 days ago',
    badge: 'Health Reminder',
    bg: '#f0f9ff',
    border: '#7dd3fc',
    badgeBg: '#e0f2fe',
    badgeColor: '#0369a1',
    dot: '#0369a1',
  },
];

const statCards = [
  { label: 'Active Cases Nearby', value: '520', icon: '🦠', bg: '#fde8e8', accent: '#c0392b' },
  { label: 'Dengue Cases 5km', value: '112', icon: '🦟', bg: '#fff3e0', accent: '#e65100' },
  { label: 'Alerts for You', value: '4', icon: '🔔', bg: '#fff8e1', accent: '#f39c12' },
  { label: 'Safe Zones Nearby', value: '3', icon: '🏥', bg: '#e8f5e9', accent: '#2e7d32' },
];

export default function AIAlertsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '32px 40px 60px', fontFamily: "'Segoe UI', Inter, sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a2332', margin: '0 0 6px' }}>🧠 AI Health Alerts</h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>Personalised risk alerts based on your location and health profile</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '8px 16px', fontSize: '0.85rem', color: '#475569', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <span>📍</span><span>Kollam, Kerala, India</span>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* AI Banner */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius: 16, padding: '20px 28px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <span style={{ fontSize: '2rem', flexShrink: 0 }}>🧠</span>
        <div>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 5px' }}>How AI Alerts Work</p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.55, maxWidth: 680 }}>
            Our AI analyses disease outbreak data, your location, vaccination status, and medical history to generate personalised risk alerts. Always consult a doctor for medical decisions.
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: '0 0 16px' }}>Your Personalised Alerts</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {alerts.map((a) => (
          <div key={a.id} style={{ background: a.bg, border: `1.5px solid ${a.border}`, borderRadius: 16, padding: '20px 24px' }}>
            {/* Alert Top */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.04em', padding: '3px 10px', borderRadius: 20, background: a.badgeBg, color: a.badgeColor }}>{a.badge}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{a.time}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a2332', margin: 0 }}>{a.title}</h3>
                </div>
              </div>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: a.dot, flexShrink: 0, marginTop: 4, display: 'inline-block' }} />
            </div>
            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: '0 0 14px' }}>{a.body}</p>
            <a href={a.actionLink} style={{ fontSize: '0.88rem', fontWeight: 700, color: a.badgeColor, textDecoration: 'none' }}>👉 {a.action} →</a>
          </div>
        ))}
      </div>

    </div>
  );
}