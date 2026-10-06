import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  GitCommit,
  Award,
  Clock,
  Mic,
  FileText,
  Activity,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

export default function Sidebar({ currentRole, activeTab, onSelectTab, onSwitchRoleDemo }) {
  // Menu item berdasarkan Role per PRD UI/UX
  const getNavItems = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
        return [
          { id: 'overview', label: 'Global Overview', icon: LayoutDashboard },
          { id: 'events', label: 'Daftar Seluruh Event', icon: Calendar },
          { id: 'admins', label: 'Admin Panitia', icon: Users },
          { id: 'monitoring', label: 'Monitoring Lapangan', icon: Activity },
          { id: 'audit', label: 'Audit Trail & Log', icon: FileText },
        ];
      case 'ADMIN_PANITIA':
        return [
          { id: 'dashboard', label: 'Dashboard Event', icon: LayoutDashboard },
          { id: 'participants', label: 'Peserta & Berkas', icon: Users },
          { id: 'flow-dp', label: 'Flow DP (4 Pos)', icon: GitCommit },
          { id: 'criteria', label: 'Kriteria & Nilai', icon: Award },
          { id: 'staff', label: 'Juri & Panitia DP', icon: UserCheck },
          { id: 'schedule', label: 'Jadwal & TM', icon: Clock },
          { id: 'live-dp', label: 'Monitoring Hari H', icon: Activity },
          { id: 'results', label: 'Hasil & Publikasi', icon: CheckCircle },
        ];
      case 'PANITIA_DP':
        return [
          { id: 'workstation', label: 'Workstation Pos DP', icon: GitCommit },
          { id: 'queue', label: 'Antrean Pasukan', icon: Users },
          { id: 'logs', label: 'Riwayat Transisi', icon: Clock },
        ];
      case 'JURI':
        return [
          { id: 'scoring', label: 'Lembar Nilai Lapangan', icon: Award },
          { id: 'voice-ai', label: 'Voice Note & AI Feedback', icon: Mic },
          { id: 'submissions', label: 'Rekap Nilai Terkirim', icon: CheckCircle },
        ];
      case 'PESERTA':
      default:
        return [
          { id: 'dashboard', label: 'Progres Lomba', icon: LayoutDashboard },
          { id: 'registration', label: 'Data Tim & Berkas', icon: FileText },
          { id: 'schedule', label: 'Jadwal & Agenda TM', icon: Clock },
          { id: 'results', label: 'Nilai & Evaluasi Juri', icon: Award },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: 'var(--pub-navy)',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        minHeight: 'calc(100vh - 60px)',
        padding: '1.25rem 0.75rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div>
        {/* Role Badge */}
        <div style={{ padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pub-sand)' }}>
            Peran Aktif
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-heading)' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentRole === 'SUPER_ADMIN' ? 'var(--pub-coral)' : 'var(--pub-teal)',
              }}
            />
            {currentRole.replace('_', ' ')}
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'rgba(201, 75, 60, 0.16)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid var(--pub-coral)' : '3px solid transparent',
                }}
              >
                <Icon size={16} color={isActive ? 'var(--pub-coral)' : '#94A3B8'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Quick-Switch Demo Toolbar */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ fontSize: '0.6875rem', color: 'var(--muted-slate)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem', fontWeight: 600 }}>
          Simulasi Peran (Demo)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {[
            { role: 'SUPER_ADMIN', label: '👑 Super Admin' },
            { role: 'ADMIN_PANITIA', label: '📋 Admin Panitia' },
            { role: 'PANITIA_DP', label: '🚩 Panitia DP' },
            { role: 'JURI', label: '⚖️ Juri Penilai' },
            { role: 'PESERTA', label: '🎖️ Peserta Tim' },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => onSwitchRoleDemo(r.role)}
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.5rem',
                borderRadius: '4px',
                border: currentRole === r.role ? '1px solid var(--crimson)' : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: currentRole === r.role ? 'rgba(153, 27, 27, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                color: currentRole === r.role ? '#FECACA' : '#CBD5E1',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
