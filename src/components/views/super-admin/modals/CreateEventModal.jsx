import React from 'react';
import { X } from 'lucide-react';

export default function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
  newEventForm,
  setNewEventForm,
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
          maxWidth: '540px',
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
              Daftarkan Lomba Baru
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
              Buat kompetisi baru dengan 4 pos Decision Point standar otomatis.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pub-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
              Nama Kompetisi / Lomba
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: LKBB Pandawa Nusantara 2026"
              value={newEventForm.name}
              onChange={(e) => setNewEventForm({ ...newEventForm, name: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                Tanggal Pelaksanaan
              </label>
              <input
                type="date"
                required
                value={newEventForm.eventDate}
                onChange={(e) => setNewEventForm({ ...newEventForm, eventDate: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
                Status Awal
              </label>
              <select
                value={newEventForm.status}
                onChange={(e) => setNewEventForm({ ...newEventForm, status: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              >
                <option value="REGISTRATION_OPEN">Pendaftaran Dibuka</option>
                <option value="DRAFT_SETUP">Draft Setup</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
              Lokasi Venue / Stadion
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: GOR Remaja Rawamangun, Jakarta Timur"
              value={newEventForm.location}
              onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pub-ink)', marginBottom: '0.35rem' }}>
              Deskripsi Lomba Singkat
            </label>
            <textarea
              rows={3}
              placeholder="Deskripsi singkat ketentuan kategori SMA/SMK se-Nasional..."
              value={newEventForm.description}
              onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
              className="form-input"
              style={{ width: '100%', resize: 'none' }}
            />
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
              <span>Daftarkan Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
