import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Radio, LogOut, User, ChevronDown, Globe } from 'lucide-react';

export default function Topbar({ onOpenAuth, onSelectRoleDemo }) {
  const { user, activeEvent, logout } = useAuth();

  return (
    <header
      style={{
        backgroundColor: 'var(--pub-navy-dark)',
        color: '#FFFFFF',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Brand & Event Scope */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: 'var(--pub-coral)',
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(201, 75, 60, 0.4)',
            }}
          >
            <Shield size={18} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800 }}>KOMPAS<span style={{ color: 'var(--pub-coral)' }}>.</span></span>
        </Link>

        {/* Back to Public Web Link */}
        <Link
          to="/"
          style={{
            fontSize: '0.75rem',
            color: '#CBD5E1',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '0.25rem 0.65rem',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <Globe size={13} color="#94A3B8" />
          <span>Web Publik</span>
        </Link>

        <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Event Scope Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--muted-slate)' }}>Konteks:</span>
          {activeEvent ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <span style={{ fontWeight: 600, color: '#F8FAFC' }}>{activeEvent.eventName || 'LKBB Nasional 2026'}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(5, 150, 105, 0.25)',
                  color: '#34D399',
                  padding: '1px 5px',
                  borderRadius: '3px',
                }}
              >
                {activeEvent.role || 'EVENT AKTIF'}
              </span>
            </div>
          ) : (
            <span style={{ color: '#E2E8F0', fontStyle: 'italic' }}>Global Operations Scope</span>
          )}
        </div>
      </div>

      {/* Right Controls: Sync & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Realtime Live Sync Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            color: '#34D399',
            backgroundColor: 'rgba(5, 150, 105, 0.15)',
            padding: '0.25rem 0.6rem',
            borderRadius: '9999px',
            border: '1px solid rgba(5, 150, 105, 0.3)',
          }}
          title="Tersambung ke Supabase Realtime Server"
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981',
            }}
          />
          <span style={{ fontWeight: 600 }}>LIVE SYNC</span>
        </div>

        {/* User Account / Role Switcher Demo */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#FFFFFF' }}>{user.fullName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-slate)' }}>{user.email}</div>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              title="Keluar dari akun"
            >
              <LogOut size={14} />
              <span>Keluar</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem', padding: '0.4rem 0.9rem' }}
            >
              <User size={14} />
              <span>Login / Masuk</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
