import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, User, Building, ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithJudgePin, register, error } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loginMode, setLoginMode] = useState('email'); // 'email' | 'juri_pin'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    schoolName: '',
  });
  const [availableEvents, setAvailableEvents] = useState([]);
  const [pinEventId, setPinEventId] = useState('evt-lkbb-2026');
  const [judgePin, setJudgePin] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (loginMode !== 'juri_pin' || availableEvents.length > 0) return;
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
  }, [loginMode, availableEvents.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      if (!isRegister && loginMode === 'juri_pin') {
        await loginWithJudgePin(pinEventId, judgePin);
      } else if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Gagal autentikasi.');
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
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Gagal autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--pub-canvas)',
      }}
    >
      <div
        className="pub-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--pub-surface)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--pub-shadow-hover)',
        }}
      >
        {/* Top Brand & Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--pub-coral)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: '0 4px 12px rgba(201, 75, 60, 0.3)',
            }}
          >
            <Shield size={22} strokeWidth={2.4} />
          </div>
          <h1 className="pub-heading" style={{ fontSize: '1.65rem', color: 'var(--pub-ink)' }}>
            {isRegister ? 'Registrasi Kontingen' : 'Masuk ke KOMPAS'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', marginTop: '0.25rem' }}>
            {isRegister ? 'Buat akun tim pangkalan untuk mendaftar lomba' : 'Masuk untuk mengakses workspace peran Anda'}
          </p>
        </div>

        {/* Error notification */}
        {(localError || error) && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--crimson-light)',
              color: 'var(--crimson-text)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(153, 27, 27, 0.2)',
            }}
          >
            {localError || error}
          </div>
        )}

        {/* Mode Switcher: Email & Password vs PIN Juri */}
        {!isRegister && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.4rem',
              padding: '0.3rem',
              backgroundColor: 'var(--pub-canvas)',
              borderRadius: '10px',
              border: '1px solid var(--pub-line)',
              marginBottom: '1.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setLoginMode('email');
                setLocalError('');
              }}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loginMode === 'email' ? '#FFFFFF' : 'transparent',
                color: loginMode === 'email' ? 'var(--pub-ink)' : 'var(--pub-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxShadow: loginMode === 'email' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <Mail size={14} />
              <span>Akun Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('juri_pin');
                setLocalError('');
              }}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loginMode === 'juri_pin' ? '#FFFFFF' : 'transparent',
                color: loginMode === 'juri_pin' ? 'var(--pub-coral)' : 'var(--pub-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxShadow: loginMode === 'juri_pin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <KeyRound size={14} />
              <span>Masuk via PIN Juri</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isRegister && loginMode === 'juri_pin' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Pilih Event Penugasan
                </label>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  PIN Akses Tablet Dewan Juri (4 Digit)
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  minLength={4}
                  maxLength={4}
                  required
                  placeholder="Contoh: 8821"
                  value={judgePin}
                  onChange={(e) => setJudgePin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="form-input"
                  style={{ width: '100%', fontFamily: 'monospace', letterSpacing: '0.2em', fontWeight: 700 }}
                />
                <span style={{ display: 'block', fontSize: '0.725rem', color: 'var(--pub-muted)', marginTop: '0.3rem' }}>
                  Masukkan tepat 4 digit PIN yang diberikan oleh Admin Panitia event.
                </span>
              </div>

              <button type="submit" disabled={loading} className="pub-btn-coral" style={{ width: '100%', marginTop: '0.5rem' }}>
                <KeyRound size={16} />
                <span>{loading ? 'Memverifikasi PIN...' : 'Verifikasi PIN & Masuk Juri'}</span>
              </button>
            </>
          ) : (
            <>
              {isRegister && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                      Nama Lengkap Pembina / Official
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dimas Pratama"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                      Asal Pangkalan Sekolah
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: SMAN 1 Jakarta"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="form-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" disabled={loading} className="pub-btn-coral" style={{ width: '100%', marginTop: '0.5rem' }}>
                <span>{loading ? 'Memproses...' : isRegister ? 'Daftar Akun Kontingen' : 'Masuk Sekarang'}</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </form>

        {/* Quick Demo Preset Credentials */}
        {!isRegister && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--pub-line)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Isi Cepat Akun Role Pos DP (Password: password123)
            </div>

            {/* Sub-kategori: Pos DP LKBB */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--pub-coral)', marginBottom: '0.25rem' }}>
                Event LKBB Nasional:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp1@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left' }}
                >
                  📄 Pos 1: Dokumen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp2@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left' }}
                >
                  📸 Pos 2: Photoshoot
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp3@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left' }}
                >
                  ⏱️ Pos 3: Persiapan
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp4@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left' }}
                >
                  🏟️ Pos 4: Panggung
                </button>
              </div>
            </div>

            {/* Sub-kategori: Pos DP FORDA */}
            <div style={{ marginBottom: '0.65rem' }}>
              <div style={{ fontSize: '0.675rem', fontWeight: 700, color: '#0284c7', marginBottom: '0.25rem' }}>
                Event FORDA Jateng:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp1.forda@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  📄 DP 1 Dokumen FORDA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp2.forda@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  📸 DP 2 Photoshoot FORDA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp3.forda@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  ⏱️ DP 3 Persiapan FORDA
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('dp4.forda@kompas.id')}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px', textAlign: 'left', borderColor: '#bae6fd' }}
                >
                  🏟️ DP 4 Panggung FORDA
                </button>
              </div>
            </div>

            {/* Role Lain */}
            <div style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--pub-muted)', marginBottom: '0.25rem' }}>
              Role Lain:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@kompas.id')}
                className="pub-btn-outline"
                style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px' }}
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('panitia@kompas.id')}
                className="pub-btn-outline"
                style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px' }}
              >
                📋 Panitia
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('juri1@kompas.id')}
                className="pub-btn-outline"
                style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px' }}
              >
                ⚖️ Juri 1
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('peserta@kompas.id')}
                className="pub-btn-outline"
                style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', gridColumn: 'span 3', borderRadius: '6px' }}
              >
                🎖️ Peserta (SMAN 1 Jakarta)
              </button>
            </div>
          </div>
        )}

        {/* Toggle Login vs Register */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setLocalError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--pub-coral)',
              cursor: 'pointer',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
            }}
          >
            {isRegister ? 'Sudah memiliki akun? Masuk di sini' : 'Belum punya akun kontingen? Daftar di sini'}
          </button>
        </div>

        {/* Direct Link to Dashboard */}
        <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--pub-line)' }}>
          <Link
            to="/dashboard"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--pub-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>Atau langsung masuk ke Dashboard mode demo</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
