import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, Lock, Mail, User, Building, Phone, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, loginWithJudgePin, register, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loginMode, setLoginMode] = useState('email'); // 'email' | 'juri_pin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    schoolName: '',
  });
  const [availableEvents, setAvailableEvents] = useState([]);
  const [pinEventId, setPinEventId] = useState('evt-lkbb-2026');
  const [judgePin, setJudgePin] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isOpen || loginMode !== 'juri_pin' || availableEvents.length > 0) return;
    let cancelled = false;
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.events) && data.events.length > 0) {
          setAvailableEvents(data.events);
          setPinEventId((prev) =>
            data.events.some((ev) => ev.id === prev || ev.slug === prev)
              ? prev
              : data.events[0].id
          );
        }
      } catch (err) {
        console.warn('Failed loading events for judge PIN login:', err);
      }
    };
    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [isOpen, loginMode, availableEvents.length]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      if (!isRegister && loginMode === 'juri_pin') {
        await loginWithJudgePin(pinEventId, judgePin);
        setJudgePin('');
      } else if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password = 'password123') => {
    setLocalError('');
    setFormData((prev) => ({ ...prev, email, password }));
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--muted-slate)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--crimson)',
              color: '#FFFFFF',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <Shield size={24} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--deep-slate)' }}>
            {isRegister ? 'Registrasi Akun Pasukan' : 'Masuk ke Platform KOMPAS'}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--muted-slate)' }}>
            {isRegister ? 'Buat akun tim untuk mendaftar ke lomba Paskibra' : 'Masuk sesuai peran dan event yang ditugaskan'}
          </p>
        </div>

        {(localError || error) && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--crimson-light)',
              color: 'var(--crimson-text)',
              fontSize: '0.8125rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
            }}
          >
            {localError || error}
          </div>
        )}

        {/* Mode Switcher: Akun Email vs PIN Juri */}
        {!isRegister && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.35rem',
              padding: '0.25rem',
              backgroundColor: '#F1F5F9',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setLoginMode('email');
                setLocalError('');
              }}
              style={{
                padding: '0.45rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: loginMode === 'email' ? '#FFFFFF' : 'transparent',
                color: loginMode === 'email' ? 'var(--deep-slate)' : 'var(--muted-slate)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxShadow: loginMode === 'email' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Mail size={13} />
              <span>Akun Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('juri_pin');
                setLocalError('');
              }}
              style={{
                padding: '0.45rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: loginMode === 'juri_pin' ? '#FFFFFF' : 'transparent',
                color: loginMode === 'juri_pin' ? 'var(--crimson)' : 'var(--muted-slate)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxShadow: loginMode === 'juri_pin' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <KeyRound size={13} />
              <span>Masuk via PIN Juri</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isRegister && loginMode === 'juri_pin' ? (
            <>
              <div className="form-group">
                <label className="form-label">Pilih Event Penugasan</label>
                <select
                  value={pinEventId}
                  onChange={(e) => setPinEventId(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontWeight: 600 }}
                >
                  {availableEvents.length > 0 ? (
                    availableEvents.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name}
                      </option>
                    ))
                  ) : (
                    <option value="evt-lkbb-2026">LKBB Nasional Paskibra 2026</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">PIN Akses Tablet Dewan Juri (4 Digit)</label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  minLength={4}
                  maxLength={4}
                  required
                  className="form-input"
                  placeholder="Contoh: 8821"
                  value={judgePin}
                  onChange={(e) => setJudgePin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{ fontFamily: 'monospace', letterSpacing: '0.2em', fontWeight: 700 }}
                />
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--muted-slate)', marginTop: '0.25rem' }}>
                  Masukkan tepat 4 digit angka PIN dari Admin Panitia event.
                </span>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Memverifikasi PIN...' : 'Verifikasi PIN & Masuk Juri'}
              </button>
            </>
          ) : (
            <>
              {isRegister && (
                <>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap / Perwakilan Tim</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Contoh: Siti Rahmawati"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Asal Sekolah / Kontingen</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Contoh: SMAN 1 Jakarta"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp Aktif</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Alamat Email</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kata Sandi</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Memproses...' : isRegister ? 'Daftar Akun Baru' : 'Masuk Sekarang'}
              </button>
            </>
          )}
        </form>

        {/* Quick Demo Preset Credentials */}
        {!isRegister && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--muted-slate)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Isi Cepat Akun Role Pos DP (Password: password123)
            </div>

            {/* Sub-kategori: Pos DP LKBB */}
            <div style={{ marginBottom: '0.45rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--crimson)', marginBottom: '0.25rem' }}>
                Event LKBB Nasional:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp1@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left' }}
                >
                  📄 Pos 1: Dokumen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp2@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left' }}
                >
                  📸 Pos 2: Photoshoot
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp3@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left' }}
                >
                  ⏱️ Pos 3: Persiapan
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp4@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left' }}
                >
                  🏟️ Pos 4: Panggung
                </button>
              </div>
            </div>

            {/* Sub-kategori: Pos DP FORDA */}
            <div style={{ marginBottom: '0.55rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#0284c7', marginBottom: '0.25rem' }}>
                Event FORDA Jateng:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp1.forda@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  📄 DP 1 Dokumen FORDA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp2.forda@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  📸 DP 2 Photoshoot FORDA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp3.forda@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  ⏱️ DP 3 Persiapan FORDA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp4.forda@kompas.id')}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.685rem', padding: '0.25rem 0.35rem', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  🏟️ DP 4 Panggung FORDA
                </button>
              </div>
            </div>

            {/* Role Lainnya */}
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--muted-slate)', marginBottom: '0.25rem' }}>
              Role Lain:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.675rem', padding: '0.25rem 0.35rem' }}
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('panitia@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.675rem', padding: '0.25rem 0.35rem' }}
              >
                📋 Panitia
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('juri1@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.675rem', padding: '0.25rem 0.35rem' }}
              >
                ⚖️ Juri 1
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('peserta@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.675rem', padding: '0.25rem 0.35rem', gridColumn: 'span 3' }}
              >
                🎖️ Akun Peserta Tim (SMAN 1 Jakarta)
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setLocalError('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--crimson)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun tim? Daftar sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
