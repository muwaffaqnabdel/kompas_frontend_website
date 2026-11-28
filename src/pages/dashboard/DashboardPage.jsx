import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Topbar from '../../components/Topbar';
import Sidebar from '../../components/Sidebar';
import SuperAdminView from '../../components/views/SuperAdminView';
import AdminPanitiaView from '../../components/views/AdminPanitiaView';
import PanitiaDPView from '../../components/views/PanitiaDPView';
import JuriView from '../../components/views/JuriView';
import PesertaView from '../../components/views/PesertaView';
import AuthModal from '../../components/AuthModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [demoRole, setDemoRole] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Reset demoRole otomatis saat akun login berganti (misal login via Email atau PIN Juri)
  useEffect(() => {
    if (user?.id) {
      setDemoRole(null);
    }
  }, [user?.id]);

  const currentRole =
    demoRole ||
    (user?.globalRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : user?.assignedEvents?.[0]?.role) ||
    'ADMIN_PANITIA';

  const handleSwitchRoleDemo = (role) => {
    setDemoRole(role);
    setActiveTab(
      role === 'SUPER_ADMIN'
        ? 'overview'
        : role === 'PANITIA_DP'
        ? 'workstation'
        : role === 'JURI'
        ? 'scoring'
        : 'dashboard'
    );
    setMobileMenuOpen(false);
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const renderActiveView = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
        return <SuperAdminView activeTab={activeTab} />;
      case 'PANITIA_DP':
        return <PanitiaDPView activeTab={activeTab} />;
      case 'JURI':
        return <JuriView activeTab={activeTab} />;
      case 'PESERTA':
        return <PesertaView activeTab={activeTab} onSelectTab={handleSelectTab} />;
      case 'ADMIN_PANITIA':
      default:
        return <AdminPanitiaView activeTab={activeTab} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: 'var(--pub-canvas)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Topbar Navigation */}
      <Topbar onOpenAuth={() => setAuthModalOpen(true)} onSelectRoleDemo={handleSwitchRoleDemo} />

      {/* Mobile Menu Bar (hanya muncul di layar HP/Android < 768px) */}
      <div className="dash-mobile-bar">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--pub-line)',
            backgroundColor: '#FFFFFF',
            color: 'var(--pub-ink)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Menu {currentRole.replace('_', ' ')}</span>
        </button>
      </div>

      {/* Main Container: Responsive Sidebar + Scrollable Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Desktop Sidebar */}
        <div className="dash-sidebar-desktop">
          <Sidebar
            currentRole={currentRole}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onSwitchRoleDemo={handleSwitchRoleDemo}
          />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="dash-sidebar-mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div style={{ height: '100%' }} onClick={(e) => e.stopPropagation()}>
              <Sidebar
                currentRole={currentRole}
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                onSwitchRoleDemo={handleSwitchRoleDemo}
              />
            </div>
          </div>
        )}

        <main className="dash-main-content">
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>{renderActiveView()}</div>
        </main>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <style>{`
        .dash-mobile-bar {
          display: none;
          padding: 0.55rem 0.9rem;
          background-color: var(--pub-surface);
          border-bottom: 1px solid var(--pub-line);
          flex-shrink: 0;
        }
        .dash-sidebar-desktop {
          display: flex;
          height: 100%;
          flex-shrink: 0;
        }
        .dash-sidebar-mobile-overlay {
          position: fixed;
          inset: 0;
          top: 60px;
          background-color: rgba(15, 23, 42, 0.55);
          z-index: 90;
          display: flex;
        }
        .dash-main-content {
          flex: 1;
          padding: 1.75rem 2rem;
          overflow-y: auto;
          height: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .dash-mobile-bar {
            display: flex;
            align-items: center;
          }
          .dash-sidebar-desktop {
            display: none;
          }
          .dash-main-content {
            padding: 1rem 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
