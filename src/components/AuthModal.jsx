import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, Lock, Mail, User, Building, Phone } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    schoolName: '',
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Terjadi kesalahan autentikasi.');
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

        <form onSubmit={handleSubmit}>
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
        </form>

        {/* Quick Demo Preset Credentials */}
        {!isRegister && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--muted-slate)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Isi Otomatis Akun Demo (Password: password123)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.4rem' }}
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('panitia@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.4rem' }}
              >
                📋 Admin Panitia
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('dp1@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.4rem' }}
              >
                🚩 Panitia DP 1
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('juri1@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.4rem' }}
              >
                ⚖️ Juri 1
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('peserta@kompas.id')}
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.4rem', gridColumn: 'span 2' }}
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
