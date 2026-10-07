import React from 'react';
import { Activity } from 'lucide-react';

export default function SuperAdminAuditLog({ auditLogs = [] }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        border: '1px solid var(--pub-line)',
        padding: '1.5rem',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <Activity size={18} color="var(--pub-coral)" />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
          Audit Trail & Jejak Aktivitas Operasional
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {auditLogs.length > 0 ? (
          auditLogs.slice(0, 5).map((log, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--pub-canvas)',
                borderRadius: '10px',
                border: '1px solid var(--pub-line)',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--pub-muted)',
                  }}
                >
                  {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                </span>
                <div>
                  <strong style={{ color: 'var(--pub-ink)' }}>{log.actor}</strong> ({log.role}):{' '}
                  <span style={{ color: 'var(--pub-coral)', fontWeight: 600 }}>{log.action}</span>
                  {log.target && <span style={{ color: 'var(--pub-ink-soft)' }}> → {log.target}</span>}
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--pub-muted)' }}>Verified System Audit</span>
            </div>
          ))
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--pub-muted)', padding: '1rem 0' }}>
            Belum ada riwayat audit log baru.
          </div>
        )}
      </div>
    </div>
  );
}
