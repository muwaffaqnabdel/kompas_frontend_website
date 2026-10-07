import React, { useState } from 'react';
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

  // Peran efektif: Jika ada user login, pakai peran user. Jika tidak/untuk demo, pakai demoRole
  const currentRole = demoRole || (user?.globalRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : user?.assignedEvents?.[0]?.role) || 'ADMIN_PANITIA';

  const handleSwitchRoleDemo = (role) => {
    setDemoRole(role);
    setActiveTab(role === 'SUPER_ADMIN' ? 'overview' : role === 'PANITIA_DP' ? 'workstation' : role === 'JURI' ? 'scoring' : 'dashboard');
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
        return <PesertaView activeTab={activeTab} />;
      case 'ADMIN_PANITIA':
      default:
        return <AdminPanitiaView activeTab={activeTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--pub-canvas)', fontFamily: 'var(--font-sans)' }}>
      {/* Topbar Navigation */}
      <Topbar onOpenAuth={() => setAuthModalOpen(true)} onSelectRoleDemo={handleSwitchRoleDemo} />

      {/* Main Container: Fixed Sidebar + Scrollable Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onSwitchRoleDemo={handleSwitchRoleDemo}
        />

        <main style={{ flex: 1, padding: '1.75rem 2rem', overflowY: 'auto', height: '100%', minWidth: 0 }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
