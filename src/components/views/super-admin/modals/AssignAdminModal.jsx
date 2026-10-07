import React from 'react';
import { X, MapPin, Eye, EyeOff } from 'lucide-react';

export default function AssignAdminModal({
  isOpen,
  onClose,
  onSubmit,
  targetEvent,
  assignForm,
  setAssignForm,
  showPassword,
  setShowPassword,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 42, 70, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--pub-surface)',
          width: '100%',
          maxWidth: '500px',
          borderRadius: '20px',
          border: '1px solid var(--pub-line)',
          boxShadow: 'var(--pub-shadow-hover)',
          padding: '2rem',
          animation: 'fadeIn 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
              Buat Akun Admin Panitia
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Buat akun login resmi khusus untuk mengelola event ini.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Target Event Banner (Auto-detected without dropdown) */}
        <div
          style={{
            backgroundColor: 'var(--pub-canvas)',
            padding: '0.9rem 1.15rem',
            borderRadius: '12px',
            border: '1px solid var(--pub-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--pub-muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
              Event Terpilih (Terkunci Otomatis)
            </div>
            <div style={{ fontSize: '0.975rem', fontWeight: 800, color: 'var(--pub-ink)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>
              {targetEvent?.name || 'Event Terpilih'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={12} />
              <span>{targetEvent?.location || 'Lokasi Belum Ditentukan'}</span>
            </div>
          </div>

          <span
            style={{
              backgroundColor: 'var(--pub-coral-pale)',
              color: 'var(--pub-coral)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--pub-radius-pill)',
              fontSize: '0.725rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}
          >
            {targetEvent?.slug || 'EVENT_TARGET'}
          </span>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
              Username / Nama Lengkap Panitia
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: panitia_jastara atau Rian Pratama"
              value={assignForm.username}
              onChange={(e) => setAssignForm({ ...assignForm, username: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
              Email Akun (Digunakan untuk Login)
            </label>
            <input
              type="email"
              required
              placeholder="Contoh: panitia.jastara@kompas.id"
              value={assignForm.email}
              onChange={(e) => setAssignForm({ ...assignForm, email: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)' }}>
                Kata Sandi (Password)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--pub-coral)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{showPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              placeholder="Minimal 6 karakter (contoh: password123)"
              value={assignForm.password}
              onChange={(e) => setAssignForm({ ...assignForm, password: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div
            style={{
              backgroundColor: 'rgba(31, 138, 120, 0.08)',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(31, 138, 120, 0.2)',
              fontSize: '0.775rem',
              color: 'var(--pub-teal)',
            }}
          >
            Akun ini akan langsung aktif dengan hak akses <strong>ADMIN_PANITIA</strong> untuk event{' '}
            <strong>{targetEvent?.name}</strong>. Panitia dapat langsung login di <code>/login</code> menggunakan email dan password di atas.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="pub-btn-outline"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              Batal
            </button>
            <button type="submit" className="pub-btn-coral" style={{ padding: '0.65rem 1.5rem' }}>
              <span>Buat & Tugaskan Akun</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
