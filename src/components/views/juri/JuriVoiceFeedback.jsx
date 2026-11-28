import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function JuriVoiceFeedback({
  isRecording,
  toggleRecording,
  aiDraft,
  setAiDraft,
  countdown,
  setCountdown,
  feedbackSent,
  handleStartSendFeedback,
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--pub-surface)',
        borderRadius: 'var(--pub-radius-card)',
        padding: '1.5rem',
        border: '1px solid var(--pub-line)',
        borderTop: '4px solid #DC2626',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ color: '#DC2626', fontWeight: 800, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI VOICE NOTE FEEDBACK (GROQ WHISPER v3)
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.12rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.2rem 0 0 0' }}>
            Rekam Suara Evaluasi Juri di Lapangan
          </h3>
        </div>
        <span
          style={{
            backgroundColor: '#FEF2F2',
            color: '#B91C1C',
            padding: '0.22rem 0.6rem',
            borderRadius: 'var(--pub-radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 700,
          }}
        >
          AI PIPELINE READY
        </span>
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', marginBottom: '1.15rem' }}>
        Tekan tombol mic untuk merekam suara evaluasi. AI Groq akan mentranskrip suara lapangan dan menyusunnya menjadi bahasa baku Paskibra.
      </p>

      {/* Record Button (Red) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={toggleRecording}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.75rem 1.35rem',
            borderRadius: '9999px',
            backgroundColor: isRecording ? '#991B1B' : '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: 'var(--pub-shadow-card)',
            transition: 'all 0.2s ease',
          }}
        >
          {isRecording ? <MicOff size={17} /> : <Mic size={17} />}
          <span>{isRecording ? 'Hentikan & Proses AI...' : 'Mulai Rekam Suara Komentar'}</span>
        </button>

        {isRecording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#DC2626', fontWeight: 700, fontSize: '0.85rem' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
            <span>Merekam Audio Juri...</span>
          </div>
        )}
      </div>

      {/* AI Draft Result & 5s Countdown */}
      {aiDraft && !feedbackSent && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '14px',
            padding: '1.15rem',
            marginTop: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase' }}>
              Draft AI Siap Ditinjau Juri:
            </span>
            <span
              style={{
                backgroundColor: '#FEE2E2',
                color: '#B91C1C',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              DRAFT AI
            </span>
          </div>

          <textarea
            value={aiDraft}
            onChange={(e) => setAiDraft(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              border: '1px solid #FCA5A5',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              color: 'var(--pub-ink)',
              backgroundColor: '#FFFFFF',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            {countdown !== null ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  className="tabular-nums"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                  }}
                >
                  {countdown}
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pub-ink)' }}>
                  Mengirim ke peserta dalam {countdown} detik...
                </span>
                <button
                  type="button"
                  onClick={() => setCountdown(null)}
                  className="pub-btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  Batalkan
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={handleStartSendFeedback}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                  }}
                >
                  Setujui & Kirim Feedback (5s)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {feedbackSent && (
        <div
          style={{
            padding: '0.85rem 1.15rem',
            borderRadius: '12px',
            backgroundColor: 'var(--pub-teal-light)',
            color: 'var(--pub-teal)',
            border: '1px solid var(--pub-teal)',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginTop: '0.75rem',
          }}
        >
          Feedback resmi berhasil dikirim ke Dashboard Peserta.
        </div>
      )}
    </div>
  );
}
