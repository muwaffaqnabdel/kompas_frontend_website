import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, PlusCircle, AlertCircle, Loader2 } from 'lucide-react';
import PesertaHero from './peserta/PesertaHero';
import PesertaMetrics from './peserta/PesertaMetrics';
import PesertaTimeline from './peserta/PesertaTimeline';
import PesertaDocuments from './peserta/PesertaDocuments';
import PesertaAgenda from './peserta/PesertaAgenda';
import PesertaDataTimBerkas from './peserta/PesertaDataTimBerkas';
import PesertaScheduleView from './peserta/PesertaScheduleView';
import PesertaResultsView from './peserta/PesertaResultsView';
import PesertaEventCatalog from './peserta/PesertaEventCatalog';
import PesertaProfilKontingen from './peserta/PesertaProfilKontingen';
import PesertaRegisterEventModal from './peserta/PesertaRegisterEventModal';

const SESSION_SELECTED_REG_KEY = 'kompas_peserta_selected_reg_id';

function formatDateId(val) {
  if (!val) return 'Jadwal menyusul';
  try {
    return new Date(val).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(val);
  }
}

export default function PesertaView({ activeTab = 'dashboard', onSelectTab }) {
  const [profileData, setProfileData] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegId, setSelectedRegId] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_SELECTED_REG_KEY) || '';
    } catch {
      return '';
    }
  });
  const [loadingPortal, setLoadingPortal] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);

  // Modal Daftar Event
  const [registerModalEvent, setRegisterModalEvent] = useState(null);

  const fetchPortalData = useCallback(async () => {
    try {
      const [profRes, regRes] = await Promise.all([
        fetch('/api/peserta/profile', { credentials: 'include' }),
        fetch('/api/peserta/registrations', { credentials: 'include' }),
      ]);

      if (profRes.status === 401 || regRes.status === 401) {
        setAuthRequired(true);
        setLoadingPortal(false);
        return;
      }

      setAuthRequired(false);
      const [profJson, regJson] = await Promise.all([profRes.json(), regRes.json()]);

      if (profRes.ok && profJson.success) {
        setProfileData(profJson);
      }
      if (regRes.ok && regJson.success) {
        const list = Array.isArray(regJson.registrations) ? regJson.registrations : [];
        setRegistrations(list);
        setSelectedRegId((prev) => {
          if (prev && list.some((r) => r.id === prev)) return prev;
          return list[0]?.id || '';
        });
      }
    } catch (err) {
      console.error('Error loading Peserta portal data:', err);
    } finally {
      setLoadingPortal(false);
    }
  }, []);

  useEffect(() => {
    fetchPortalData();
  }, [fetchPortalData]);

  useEffect(() => {
    try {
      if (selectedRegId) sessionStorage.setItem(SESSION_SELECTED_REG_KEY, selectedRegId);
    } catch {}
  }, [selectedRegId]);

  const activeRegistration =
    registrations.find((r) => r.id === selectedRegId) || registrations[0] || null;

  const handleRegistrationUpdated = (updatedReg) => {
    if (!updatedReg?.id) {
      fetchPortalData();
      return;
    }
    setRegistrations((prev) => {
      const exists = prev.some((r) => r.id === updatedReg.id);
      if (exists) return prev.map((r) => (r.id === updatedReg.id ? updatedReg : r));
      return [updatedReg, ...prev];
    });
  };

  const handleEventRegistered = (newReg) => {
    setRegisterModalEvent(null);
    if (newReg?.id) {
      setRegistrations((prev) => [newReg, ...prev]);
      setSelectedRegId(newReg.id);
    } else {
      fetchPortalData();
    }
    onSelectTab && onSelectTab('registration');
  };

  const handleOpenRegistrationFromCatalog = (regId) => {
    setSelectedRegId(regId);
    onSelectTab && onSelectTab('registration');
  };

  // Switcher Event & Tim (muncul di tab berbasis event agar peserta mudah berpindah antar lomba)
  const renderEventSwitcher = () => {
    if (authRequired) return null;
    return (
      <div
        style={{
          maxWidth: activeTab === 'registration' ? '1080px' : '1000px',
          margin: '0 auto 1.25rem auto',
          backgroundColor: 'var(--pub-surface)',
          border: '1px solid var(--pub-line)',
          borderRadius: '14px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1 1 320px', minWidth: 0 }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              backgroundColor: 'rgba(201, 75, 60, 0.1)',
              color: 'var(--pub-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Calendar size={17} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--pub-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Event & Tim Aktif ({registrations.length} Pendaftaran)
            </div>
            {registrations.length > 0 ? (
              <select
                value={activeRegistration?.id || ''}
                onChange={(e) => setSelectedRegId(e.target.value)}
                style={{
                  marginTop: '0.15rem',
                  width: '100%',
                  maxWidth: '460px',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '8px',
                  border: '1px solid var(--pub-line)',
                  backgroundColor: 'var(--pub-canvas)',
                  color: 'var(--pub-ink)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {registrations.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.eventName} — {reg.teamName} ({reg.status})
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B', marginTop: '0.1rem' }}>
                Belum terdaftar pada event mana pun
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab && onSelectTab('events')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            borderRadius: '9px',
            border: '1px solid var(--pub-coral)',
            backgroundColor: 'rgba(201, 75, 60, 0.08)',
            color: 'var(--pub-coral)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <PlusCircle size={15} />
          <span>Cari / Daftar Event</span>
        </button>
      </div>
    );
  };

  if (loadingPortal) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--pub-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.85rem' }}>Memuat portal kontingen peserta...</span>
      </div>
    );
  }

  // Banner login jika membuka tab profil/daftar dalam mode demo belum login
  const renderAuthBanner = () =>
    authRequired ? (
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto 1.25rem auto',
          padding: '0.85rem 1.15rem',
          borderRadius: '12px',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          color: '#92400E',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
        }}
      >
        <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
        <span>
          Anda sedang melihat mode pratinjau. <strong>Silakan login dengan akun Peserta</strong> terlebih dahulu agar Profil Kontingen, Pas Foto, dan Pendaftaran Event tersimpan ke database.
        </span>
      </div>
    ) : null;

  // Tab: Katalog Seluruh Event
  if (activeTab === 'events') {
    return (
      <>
        {renderAuthBanner()}
        <PesertaEventCatalog
          registrations={registrations}
          profileMembersCount={profileData?.members?.length || 0}
          onSelectRegisterEvent={(ev) => {
            if (authRequired) {
              alert('Silakan login terlebih dahulu untuk mendaftar event.');
              return;
            }
            setRegisterModalEvent(ev);
          }}
          onOpenRegistration={handleOpenRegistrationFromCatalog}
          onGoToProfile={() => onSelectTab && onSelectTab('profile')}
        />
        {registerModalEvent && (
          <PesertaRegisterEventModal
            event={registerModalEvent}
            profileData={profileData}
            existingRegsForEvent={registrations.filter((r) => r.eventId === registerModalEvent.id)}
            onClose={() => setRegisterModalEvent(null)}
            onRegistered={handleEventRegistered}
            onProfileMemberAdded={fetchPortalData}
          />
        )}
      </>
    );
  }

  // Tab: Profil Kontingen & Bank Anggota
  if (activeTab === 'profile') {
    return (
      <>
        {renderAuthBanner()}
        <PesertaProfilKontingen
          profileData={profileData}
          onProfileUpdated={fetchPortalData}
        />
      </>
    );
  }

  // Tab: Data Tim & Berkas Event Aktif
  if (activeTab === 'registration') {
    return (
      <>
        {renderAuthBanner()}
        {renderEventSwitcher()}
        <PesertaDataTimBerkas
          activeRegistration={activeRegistration}
          profileData={profileData}
          onRegistrationUpdated={handleRegistrationUpdated}
          onGoToEvents={() => onSelectTab && onSelectTab('events')}
          onGoToProfile={() => onSelectTab && onSelectTab('profile')}
        />
      </>
    );
  }

  if (activeTab === 'schedule') {
    return (
      <>
        {renderEventSwitcher()}
        <PesertaScheduleView activeRegistration={activeRegistration} />
      </>
    );
  }

  if (activeTab === 'results') {
    return (
      <>
        {renderEventSwitcher()}
        <PesertaResultsView activeRegistration={activeRegistration} />
      </>
    );
  }

  // Default Tab: Dashboard Ringkasan Event Aktif
  const docSummaryItems = activeRegistration?.documents
    ? activeRegistration.documents.map((d) => ({
        name: d.title,
        status: d.status === 'REJECTED' ? 'REVISION' : d.status,
        size: d.fileSize || 'Belum diunggah',
        note: d.rejectionNote || '',
      }))
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-sans)' }}>
      {renderAuthBanner()}
      {renderEventSwitcher()}

      {/* 1. Header Event Aktif Pasukan */}
      <PesertaHero
        eventName={activeRegistration?.eventName || 'Belum Ada Event Aktif'}
        regCode={activeRegistration?.registrationNumber || 'BELUM TERDAFTAR'}
        location={activeRegistration?.eventLocation || 'Pilih event pada menu Event di sidebar'}
        date={activeRegistration ? formatDateId(activeRegistration.eventDate) : '-'}
        category={activeRegistration?.category || profileData?.profile?.category || 'SMA/SMK/MA'}
        status={activeRegistration?.status || 'DRAFT'}
        onOpenSchedule={() =>
          onSelectTab && onSelectTab(activeRegistration ? 'schedule' : 'events')
        }
      />

      {/* 2. Metrics 3 Kolom Status & Pasukan */}
      <PesertaMetrics
        statusDocs={
          activeRegistration
            ? activeRegistration.status === 'VALIDATED'
              ? 'TERVERIFIKASI'
              : `${activeRegistration.docsSummary?.uploaded || 0}/${activeRegistration.docsSummary?.total || 0} BERKAS`
            : 'BELUM DAFTAR'
        }
        orderNumber={
          activeRegistration?.queueNumber
            ? `#${String(activeRegistration.queueNumber).padStart(2, '0')}`
            : 'Menunggu TM'
        }
        orderSlot={
          activeRegistration?.performanceTime
            ? new Date(activeRegistration.performanceTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            : 'Menunggu penetapan jadwal panitia'
        }
        school={activeRegistration?.schoolName || profileData?.profile?.schoolName || 'Belum diisi'}
        teamName={activeRegistration?.teamName || profileData?.profile?.defaultTeamName || 'Lengkapi Profil Kontingen'}
      />

      {/* 3. Timeline Perjalanan 6 Tahapan Lomba */}
      <PesertaTimeline />

      {/* 4. Grid Dokumen Berkas & Agenda Kegiatan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <PesertaDocuments documents={docSummaryItems} />
        <PesertaAgenda onOpenSchedule={() => onSelectTab && onSelectTab('schedule')} />
      </div>
    </div>
  );
}
