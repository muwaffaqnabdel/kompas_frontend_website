import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Square,
  User,
  Plus,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { compressPasFoto } from '../../../utils/imageCompress';

const ROLE_OPTIONS = ['DANTON', 'PASUKAN', 'CADANGAN', 'OFFICIAL'];
const CATEGORY_OPTIONS = ['SMP/MTs', 'SMA/SMK/MA', 'SD/MI', 'Umum / Purna'];

export default function PesertaRegisterEventModal({
  event,
  profileData,
  existingRegsForEvent = [],
  onClose,
  onRegistered,
  onProfileMemberAdded,
}) {
  const defaultSchool = profileData?.profile?.schoolName || '';
  const baseTeam = profileData?.profile?.defaultTeamName || defaultSchool || '';
  const suggestedTeamName =
    existingRegsForEvent.length > 0 && baseTeam
      ? `${baseTeam} (Tim ${String.fromCharCode(65 + existingRegsForEvent.length)})`
      : baseTeam;

  const [schoolName, setSchoolName] = useState(defaultSchool);
  const [teamName, setTeamName] = useState(suggestedTeamName);
  const [category, setCategory] = useState(profileData?.profile?.category || 'SMA/SMK/MA');

  // Daftar kandidat anggota dari Profil Kontingen + status tercentang & peran khusus event ini
  const [rosterItems, setRosterItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Quick tambah anggota baru langsung dari modal pendaftaran
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTtl, setNewTtl] = useState('');
  const [newNisn, setNewNisn] = useState('');
  const [newRole, setNewRole] = useState('PASUKAN');
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [addingNewMember, setAddingNewMember] = useState(false);

  useEffect(() => {
    const profileMembers = Array.isArray(profileData?.members) ? profileData.members : [];
    setRosterItems(
      profileMembers.map((m, idx) => ({
        key: m.id,
        sourceMemberId: m.id,
        fullName: m.fullName,
        ttl: m.ttl || '',
        nisn: m.nisn || '',
        roleInTeam: m.defaultRole || 'PASUKAN',
        photoUrl: m.photoUrl || null,
        // Otomatis centang maks 16 anggota pertama jika belum ada tim lain di event ini
        selected: existingRegsForEvent.length === 0 ? idx < 16 : false,
      }))
    );
  }, [profileData, existingRegsForEvent.length]);

  const selectedCount = rosterItems.filter((r) => r.selected).length;

  const toggleSelect = (key) => {
    setRosterItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateItemRole = (key, role) => {
    setRosterItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, roleInTeam: role } : item))
    );
  };

  const handleSelectAll = (val) => {
    setRosterItems((prev) => prev.map((item) => ({ ...item, selected: val })));
  };

  const handlePickQuickPhoto = async (e) => {
    const raw = e.target.files?.[0];
    if (!raw) return;
    try {
      const comp = await compressPasFoto(raw);
      setNewPhotoFile(comp.file);
      if (newPhotoPreview && newPhotoPreview.startsWith('blob:')) URL.revokeObjectURL(newPhotoPreview);
      setNewPhotoPreview(URL.createObjectURL(comp.blob));
    } catch (err) {
      setError(err.message || 'Gagal memproses pas foto.');
    }
  };

  const handleAddQuickMember = async () => {
    if (!newName.trim()) {
      setError('Nama anggota baru wajib diisi.');
      return;
    }
    setError('');
    setAddingNewMember(true);
    try {
      if (saveToProfile) {
        // Simpan ke Bank Anggota Profil + upload pas foto ke Supabase Storage sekalian
        const fd = new FormData();
        fd.append('fullName', newName.trim());
        fd.append('ttl', newTtl.trim());
        fd.append('nisn', newNisn.trim());
        fd.append('defaultRole', newRole);
        if (schoolName.trim()) fd.append('schoolName', schoolName.trim());
        if (newPhotoFile) fd.append('photo', newPhotoFile);

        const res = await fetch('/api/peserta/profile/members', {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Gagal menyimpan anggota ke Profil.');
        }

        const created = data.member;
        setRosterItems((prev) => [
          ...prev,
          {
            key: created.id,
            sourceMemberId: created.id,
            fullName: created.fullName,
            ttl: created.ttl || '',
            nisn: created.nisn || '',
            roleInTeam: created.defaultRole || newRole,
            photoUrl: created.photoUrl || null,
            selected: true,
          },
        ]);
        onProfileMemberAdded && onProfileMemberAdded();
      } else {
        setRosterItems((prev) => [
          ...prev,
          {
            key: `temp-${Date.now()}`,
            sourceMemberId: null,
            fullName: newName.trim(),
            ttl: newTtl.trim(),
            nisn: newNisn.trim(),
            roleInTeam: newRole,
            photoUrl: null,
            selected: true,
            saveToProfile: false,
          },
        ]);
      }

      setNewName('');
      setNewTtl('');
      setNewNisn('');
      setNewRole('PASUKAN');
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
      setShowQuickAdd(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingNewMember(false);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (!schoolName.trim() || !teamName.trim()) {
      setError('Nama sekolah dan nama tim wajib diisi.');
      return;
    }

    const chosenMembers = rosterItems
      .filter((item) => item.selected)
      .map((item) => ({
        sourceMemberId: item.sourceMemberId,
        fullName: item.fullName,
        ttl: item.ttl,
        nisn: item.nisn,
        roleInTeam: item.roleInTeam,
        photoUrl: item.photoUrl,
        saveToProfile: Boolean(item.saveToProfile),
      }));

    setSubmitting(true);
    try {
      const res = await fetch('/api/peserta/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          eventId: event.id,
          schoolName: schoolName.trim(),
          teamName: teamName.trim(),
          category,
          selectedMembers: chosenMembers,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal mendaftarkan tim ke event.');
      }
      onRegistered && onRegistered(data.registration);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.28)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.15rem 1.4rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pub-coral)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Pendaftaran Cepat dari Profil Kontingen
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', margin: '0.15rem 0 0 0' }}>
              {event?.name}
            </h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmitRegistration} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {error && (
              <div style={{ padding: '0.75rem 0.95rem', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Identitas Tim */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Asal Sekolah / Instansi *
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Contoh: SMKN 2 Kudus"
                  style={{ width: '100%', padding: '0.58rem 0.75rem', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Nama Tim / Pasukan di Event Ini *
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Contoh: Paskibra Garuda Tim A"
                  style={{ width: '100%', padding: '0.58rem 0.75rem', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Jenjang / Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.58rem 0.75rem', borderRadius: '9px', border: '1px solid #CBD5E1', fontSize: '0.85rem', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Crosscheck Anggota & Pas Foto dari Profil */}
            <div style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} color="var(--pub-teal)" />
                    <span>Crosscheck Pasukan & Pas Foto ({selectedCount} Terpilih)</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                    Centang hanya anggota yang tampil di event ini. Pas foto langsung diambil otomatis dari Profil Kontingen.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {rosterItems.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(true)}
                        style={{ padding: '0.3rem 0.6rem', borderRadius: '7px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectAll(false)}
                        style={{ padding: '0.3rem 0.6rem', borderRadius: '7px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
                      >
                        Kosongkan
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd((v) => !v)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.32rem 0.65rem',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: 'var(--pub-navy)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                    <span>Anggota Baru</span>
                  </button>
                </div>
              </div>

              {/* Quick Add Anggota Baru */}
              {showQuickAdd && (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label
                      style={{
                        width: '54px',
                        height: '70px',
                        borderRadius: '8px',
                        border: '1.5px dashed #94A3B8',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {newPhotoPreview ? (
                        <img src={newPhotoPreview} alt="Foto baru" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Camera size={16} color="#64748B" />
                      )}
                      <input type="file" accept="image/*" onChange={handlePickQuickPhoto} style={{ display: 'none' }} />
                    </label>

                    <div style={{ flex: 1, minWidth: '200px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Nama Lengkap *"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ padding: '0.48rem 0.65rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        placeholder="TTL (opsional)"
                        value={newTtl}
                        onChange={(e) => setNewTtl(e.target.value)}
                        style={{ padding: '0.48rem 0.65rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        placeholder="NISN (opsional)"
                        value={newNisn}
                        onChange={(e) => setNewNisn(e.target.value)}
                        style={{ padding: '0.48rem 0.65rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                      />
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        style={{ padding: '0.48rem 0.65rem', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '0.8rem', backgroundColor: '#FFFFFF' }}
                      >
                        {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                      <input type="checkbox" checked={saveToProfile} onChange={(e) => setSaveToProfile(e.target.checked)} />
                      <span>Simpan juga ke Profil Kontingen (biar besok tidak upload ulang)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddQuickMember}
                      disabled={addingNewMember}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: 'var(--pub-teal)',
                        color: '#FFFFFF',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {addingNewMember ? 'Menyimpan...' : 'Tambahkan ke Daftar'}
                    </button>
                  </div>
                </div>
              )}

              {/* Grid Checklist Anggota */}
              {rosterItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', fontSize: '0.8rem', color: '#64748B' }}>
                  Belum ada anggota di Profil Kontingen. Anda tetap bisa mendaftar sekarang lalu melengkapi anggota di tab Data Tim & Berkas, atau klik <strong>+ Anggota Baru</strong> di atas.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.6rem', maxHeight: '290px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                  {rosterItems.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => toggleSelect(item.key)}
                      style={{
                        backgroundColor: item.selected ? '#ECFDF5' : '#FFFFFF',
                        border: item.selected ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.55rem 0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{ flexShrink: 0, color: item.selected ? '#059669' : '#94A3B8' }}>
                        {item.selected ? <CheckSquare size={17} /> : <Square size={17} />}
                      </div>

                      <div
                        style={{
                          width: '36px',
                          height: '46px',
                          borderRadius: '6px',
                          backgroundColor: '#F1F5F9',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={16} color="#94A3B8" />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.fullName}
                        </div>
                        <select
                          value={item.roleInTeam}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateItemRole(item.key, e.target.value)}
                          style={{
                            marginTop: '0.2rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.12rem 0.35rem',
                            borderRadius: '5px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            color: '#334155',
                          }}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              <CheckCircle2 size={14} color="var(--pub-teal)" style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
              Setelah terdaftar, Anda tinggal melengkapi berkas khusus event ini.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{ padding: '0.55rem 1rem', borderRadius: '9px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="pub-btn-coral"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: submitting ? 'wait' : 'pointer',
                }}
              >
                {submitting && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
                <span>{submitting ? 'Mendaftarkan...' : `Konfirmasi Daftar (${selectedCount} Anggota)`}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

