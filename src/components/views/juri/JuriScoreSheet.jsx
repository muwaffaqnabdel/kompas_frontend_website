import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function JuriScoreSheet({
  criteria = [],
  scores = {},
  onSelectScore,
  scoreSubmitted = false,
  onSubmitScore,
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.75rem',
        border: '1px solid var(--pub-line)',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: 0 }}>
        Lembar Input Nilai Aba-Aba Dinamis
      </h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', margin: '0.2rem 0 1.25rem 0' }}>
        Sentuh angka nilai yang sesuai. Konfigurasi kriteria telah dikunci oleh panitia.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {criteria.map((c) => (
          <div key={c.id} style={{ borderBottom: '1px solid var(--pub-line)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--pub-ink)' }}>{c.name}</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: 'var(--pub-coral)' }}>
                Nilai: {scores[c.id]}
              </span>
            </div>

            {/* Large Touch Target Score Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {c.options.map((val) => {
                const isSelected = scores[c.id] === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onSelectScore(c.id, val)}
                    style={{
                      padding: '0.55rem 0.95rem',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--pub-coral)' : '1px solid var(--pub-line)',
                      backgroundColor: isSelected ? 'var(--pub-coral)' : 'var(--pub-canvas)',
                      color: isSelected ? '#FFFFFF' : 'var(--pub-ink)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      minWidth: '50px',
                    }}
                    className="tabular-nums"
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Scoring Button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onSubmitScore}
          disabled={scoreSubmitted}
          className="pub-btn-coral"
          style={{
            padding: '0.75rem 1.75rem',
            fontSize: '0.925rem',
            opacity: scoreSubmitted ? 0.7 : 1,
            cursor: scoreSubmitted ? 'not-allowed' : 'pointer',
          }}
        >
          <CheckCircle size={18} />
          <span>{scoreSubmitted ? 'Nilai Berhasil Disimpan ✓' : 'Submit & Kunci Nilai Pasukan'}</span>
        </button>
      </div>
    </div>
  );
}
