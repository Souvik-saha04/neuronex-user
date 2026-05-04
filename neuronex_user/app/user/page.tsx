import styles from './page.module.css';

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
  { value: '4', label: 'Health Records', icon: '📋', color: '#e3f2fd', accent: '#1976d2' },
  { value: '2', label: 'Vaccinations', icon: '💉', color: '#e8f5e8', accent: '#2e7d32' },
  { value: '1', label: 'Active Alert', icon: '⚠️', color: '#fff3cd', accent: '#856404' },
  { value: '3', label: 'Documents', icon: '📄', color: '#f3e5f5', accent: '#7b1fa2' },
];

export default function UserHomePage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.greeting}>Welcome back, Rajesh 👋</h2>
          <p className={styles.subGreeting}>Access your health records and stay informed</p>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.locationBadge}>
            <span>📍</span>
            <span>Kollam, Kerala, India</span>
          </div>
        </div>
      </div>

      {/* Welcome Hero */}
      <div className={styles.heroCard}>
        <div className={styles.heroLeft}>
          <div className={styles.heroIconBig}>➕</div>
          <div>
            <h3 className={styles.heroTitle}>Welcome to MedAxis</h3>
            <p className={styles.heroDesc}>
              Access comprehensive healthcare services, manage your health records, and stay connected
              with Kerala&apos;s digital health infrastructure.
            </p>
            <a href="/user/health-records" className={styles.heroBtn}>Access Health System</a>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        {healthStats.map((s) => (
          <div key={s.label} className={styles.statCard} style={{ background: s.color }}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue} style={{ color: s.accent }}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        {/* Recent Alerts */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent alerts</h3>
          <div className={styles.alertList}>
            {recentAlerts.map((a, i) => (
              <div key={i} className={styles.alertItem}>
                <span className={styles.alertDot} style={{ background: a.color }} />
                <span className={styles.alertText}>{a.label}</span>
                <span className={styles.alertTag} style={{ background: a.tagColor + '22', color: a.tagColor }}>
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Quick Access</h3>
          <div className={styles.quickLinks}>
            {quickLinks.map((q, i) => (
              <div key={i} className={styles.quickItem}>
                <span className={styles.quickIcon}>{q.icon}</span>
                <div>
                  <p className={styles.quickLabel}>{q.label}</p>
                  <p className={styles.quickSub}>{q.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Outbreak Banner */}
      <div className={styles.outbreakBanner}>
        <div className={styles.outbreakLeft}>
          <span className={styles.outbreakIcon}>⚠️</span>
          <div>
            <p className={styles.outbreakTitle}>Active Disease Outbreak – COVID-19</p>
            <p className={styles.outbreakSub}>520 confirmed cases in your region. Stay alert and follow safety guidelines.</p>
          </div>
        </div>
        <a href="/user/ai-alerts" className={styles.outbreakBtn}>View AI Alerts →</a>
      </div>
    </div>
  );
}