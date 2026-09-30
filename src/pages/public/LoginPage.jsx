import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, User, Building, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login, register, error } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    schoolName: '',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      if (isRegister) {
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

  const handleQuickLogin = (email, password = 'password123') => {
    setFormData({ ...formData, email, password });
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        </form>

        {/* Quick Demo Preset Credentials */}
        {!isRegister && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--pub-line)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--pub-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Isi Cepat Akun Demo (Password: password123)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
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
                📋 Admin Panitia
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('dp1@kompas.id')}
                className="pub-btn-outline"
                style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', borderRadius: '6px' }}
              >
                🚩 Pos DP 1
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
                style={{ fontSize: '0.725rem', padding: '0.35rem 0.5rem', gridColumn: 'span 2', borderRadius: '6px' }}
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
