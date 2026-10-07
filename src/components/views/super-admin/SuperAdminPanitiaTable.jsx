import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function SuperAdminPanitiaTable({ onOpenAssignModal, events = [] }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/admins');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins || []);
      }
    } catch (err) {
      console.error('Error fetching admin panitia list:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter((adm) => {
    const query = searchQuery.toLowerCase();
    const matchName = adm.fullName.toLowerCase().includes(query) || adm.email.toLowerCase().includes(query);
    const matchEvent = adm.assignedEvents?.some(
      (ev) => ev.name.toLowerCase().includes(query) || ev.slug.toLowerCase().includes(query)
    );
    const matchSearch = matchName || matchEvent;
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? adm.isActive : !adm.isActive);

    return matchSearch && matchStatus;
  });

  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Topbar Toolbar & Filters */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--pub-line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'var(--pub-ink)',
              margin: 0,
            }}
          >
            Manajemen Akun Admin Panitia
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 0 0' }}>
            Daftar pengelola operasional yang memiliki hak akses pengelolaan event lomba Paskibra.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--pub-canvas)',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
            }}
          >
            <Search size={14} color="var(--pub-muted)" />
            <input
              type="text"
              placeholder="Cari admin / email / event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.8125rem',
                color: 'var(--pub-ink)',
                width: '180px',
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--pub-line)',
              backgroundColor: 'var(--pub-canvas)',
              fontSize: '0.8125rem',
              color: 'var(--pub-ink)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">Semua Status Akun</option>
            <option value="ACTIVE">Akun Aktif</option>
            <option value="INACTIVE">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--pub-canvas)', borderBottom: '1px solid var(--pub-line)' }}>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Admin Panitia
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Event yang Dikelola
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Beban Penugasan
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Status Akun
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Terdaftar Sejak
              </th>
              <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--pub-muted)' }}>
                  Memuat data akun Admin Panitia...
                </td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--pub-muted)' }}>
                  Tidak ada data Admin Panitia yang sesuai.
                </td>
              </tr>
            ) : (
              filteredAdmins.map((adm) => {
                const assignedCount = adm.assignedEvents?.length || 0;

                return (
                  <tr
                    key={adm.id}
                    style={{
                      borderBottom: '1px solid var(--pub-line)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pub-canvas)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* 1. Admin Panitia */}
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--pub-ink)', fontSize: '0.925rem' }}>
                        {adm.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--pub-muted)', marginTop: '0.15rem' }}>
                        {adm.email}
                      </div>
                    </td>

                    {/* 2. Event yang Dikelola */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      {assignedCount > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {adm.assignedEvents.map((ev, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--pub-ink)' }}>{ev.name}</span>
                              <code
                                style={{
                                  fontSize: '0.7rem',
                                  fontFamily: 'var(--font-mono)',
                                  backgroundColor: 'var(--pub-canvas)',
                                  padding: '0.1rem 0.35rem',
                                  borderRadius: '4px',
                                  color: 'var(--pub-muted)',
                                }}
                              >
                                {ev.slug}
                              </code>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.775rem', color: 'var(--pub-muted)' }}>
                          Belum ditugaskan ke event
                        </span>
                      )}
                    </td>

                    {/* 3. Beban Penugasan */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span className="tabular-nums" style={{ fontWeight: 700, color: 'var(--pub-ink)' }}>
                        {assignedCount} Event
                      </span>
                    </td>

                    {/* 4. Status Akun */}
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: adm.isActive ? 'var(--pub-teal-light)' : 'var(--pub-coral-pale)',
                          color: adm.isActive ? 'var(--pub-teal)' : 'var(--pub-coral)',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--pub-radius-pill)',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          display: 'inline-block',
                        }}
                      >
                        {adm.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* 5. Terdaftar Sejak */}
                    <td style={{ padding: '0.9rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--pub-ink-soft)' }}>
                        {new Date(adm.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    {/* 6. Aksi */}
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const targetEvent = events[0] || null;
                          if (targetEvent) {
                            onOpenAssignModal(targetEvent);
                          }
                        }}
                        className="pub-btn-outline"
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--pub-coral)',
                        }}
                        title="Tugaskan ke event lain"
                      >
                        Tugaskan Event
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
