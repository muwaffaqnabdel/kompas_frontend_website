import React from 'react';
import { Sparkles, Mic, MicOff, Send, CheckCircle } from 'lucide-react';

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
        padding: '1.75rem',
        border: '1px solid var(--pub-line)',
        borderTop: '5px solid #8B5CF6',
        boxShadow: 'var(--pub-shadow-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7C3AED', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={15} />
            <span>AI VOICE NOTE FEEDBACK (GROQ WHISPER + LLAMA 3)</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-ink)', margin: '0.25rem 0 0 0' }}>
            Rekam Suara Evaluasi Juri di Lapangan
          </h3>
        </div>
        <span
          style={{
            backgroundColor: '#F5F3FF',
            color: '#7C3AED',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--pub-radius-pill)',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          AI PIPELINE READY
        </span>
      </div>

      <p style={{ fontSize: '0.8125rem', color: 'var(--pub-muted)', marginBottom: '1.25rem' }}>
        Tekan tombol mic untuk merekam suara evaluasi. AI Groq akan mentranskrip bising lapangan (Whisper) dan menyusunnya menjadi bahasa baku Paskibra yang profesional (Llama 3).
      </p>

      {/* Record Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={toggleRecording}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1.4rem',
            borderRadius: '9999px',
            backgroundColor: isRecording ? 'var(--pub-coral)' : '#7C3AED',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: 'var(--pub-shadow-card)',
            transition: 'all 0.2s ease',
          }}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          <span>{isRecording ? 'Hentikan & Proses AI...' : 'Mulai Rekam Suara Komentar'}</span>
        </button>

        {isRecording && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--pub-coral)', fontWeight: 700, fontSize: '0.875rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--pub-coral)' }} />
            <span>Merekam Audio Juri...</span>
          </div>
        )}
      </div>

      {/* AI Draft Result & 5s Countdown */}
      {aiDraft && !feedbackSent && (
        <div
          style={{
            backgroundColor: '#FAF5FF',
            border: '1px solid #E9D5FF',
            borderRadius: '14px',
            padding: '1.25rem',
            marginTop: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6D28D9', textTransform: 'uppercase' }}>
              Draft AI Siap Ditinjau Juri:
            </span>
            <span
              style={{
                backgroundColor: '#EDE9FE',
                color: '#6D28D9',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              STATUS: DRAFT AI
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
              border: '1px solid #DDD6FE',
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
                    backgroundColor: 'var(--pub-coral)',
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
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Send size={15} />
                  <span>Setujui & Kirim Feedback (5s Countdown)</span>
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginTop: '0.75rem',
          }}
        >
          <CheckCircle size={18} />
          <span>Feedback resmi berhasil dipancarkan ke Dashboard Peserta via Supabase Realtime!</span>
        </div>
      )}
    </div>
  );
}
