import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react';

export default function JuriStepScoring({
  team,
  judge,
  abaAbaList = [],
  initialScores = {},
  onSubmitScores,
  onCancel,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState(initialScores);

  const currentAbaAba = abaAbaList[currentIndex] || {
    id: `aba-${currentIndex + 1}`,
    orderIndex: currentIndex + 1,
    name: `Aba-aba ${currentIndex + 1}`,
    options: [8, 10, 12, 14, 16, 18, 20, 22],
  };

  const options = currentAbaAba.options || [8, 10, 12, 14, 16, 18, 20, 22];
  const currentScore = scores[currentAbaAba.id];

  const handleSelectScore = (val) => {
    setScores((prev) => ({
      ...prev,
      [currentAbaAba.id]: val,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < abaAbaList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = () => {
    onSubmitScores(scores);
  };

  const isLastAbaAba = currentIndex === abaAbaList.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 2rem',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Minimal Header (Nama Tim & Progres Saja) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '0.85rem',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'transparent',
            border: 'none',
            color: '#64748B',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.35rem 0.6rem',
            borderRadius: '6px',
          }}
          title="Keluar dari lembar penilaian"
        >
          <X size={18} />
          <span>Kembali</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
            {team?.school || 'SMAN 1 Jakarta'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            No. Urut {team?.orderNumber || '01'} • Aba-Aba {currentIndex + 1} dari {abaAbaList.length}
          </div>
        </div>

        <div style={{ width: '80px', textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: '#DC2626' }}>
          {judge?.category || 'PBB Murni'}
        </div>
      </div>

      {/* 2. AREA UTAMA: HANYA NAMA ABA-ABA & BARIS NILAI (SESUAI REVISI USER) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '1rem 0',
        }}
      >
        {/* Nama Aba-Aba */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 2.5rem 0',
            lineHeight: 1.25,
          }}
        >
          {currentAbaAba.name}
        </h1>

        {/* Baris Kotak Opsi Nilai Sesuai Gambar User:
            - Tablet/Desktop: 1 baris menyamping kesamping (8 kotak)
            - Mobile: 2 baris x 4 kolom */}
        <div style={{ width: '100%', maxWidth: '780px' }}>
          <div className="juri-fullscreen-score-grid">
            {options.map((val) => {
              const isSelected = currentScore === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectScore(val)}
                  style={{
                    height: '82px',
                    borderRadius: '14px',
                    border: '2.5px solid #0F172A',
                    backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#0F172A',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.12s ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 8px 20px rgba(15, 23, 42, 0.35)'
                      : '0 2px 6px rgba(0, 0, 0, 0.04)',
                    userSelect: 'none',
                  }}
                  className="tabular-nums"
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Minimal Bottom Navigation: Sebelumnya & Selanjutnya */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.6rem',
            borderRadius: '12px',
            border: '2px solid #E2E8F0',
            backgroundColor: currentIndex === 0 ? '#F8FAFC' : '#FFFFFF',
            color: currentIndex === 0 ? '#94A3B8' : '#0F172A',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={20} />
          <span>Sebelumnya</span>
        </button>

        {!isLastAbaAba ? (
          <button
            type="button"
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#C94B3C',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(201, 75, 60, 0.3)',
            }}
          >
            <span>Selanjutnya</span>
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.9rem 2.2rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(13, 148, 136, 0.35)',
            }}
          >
            <CheckCircle size={20} />
            <span>Selesai & Masuk Voice Note AI →</span>
          </button>
        )}
      </div>

      {/* Responsive CSS Grid:
          - Screen >= 640px (Tablet/Desktop): 1 baris menyamping 8 kolom
          - Screen < 640px (Mobile): 2 baris x 4 kolom */}
      <style>{`
        .juri-fullscreen-score-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(8, 1fr);
        }
        @media (max-width: 640px) {
          .juri-fullscreen-score-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
