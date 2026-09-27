import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cek sesi yang ada saat aplikasi dibuka
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setAssignedEvents(data.user.assignedEvents || []);

        // Pilih event aktif otomatis jika hanya memiliki 1 event
        if (data.user.assignedEvents && data.user.assignedEvents.length > 0) {
          setActiveEvent(data.user.assignedEvents[0]);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session check error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login gagal.');
      }

      setUser(data.user);
      await checkSession();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Registrasi gagal.');
      }

      setUser(data.user);
      await checkSession();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      setActiveEvent(null);
      setAssignedEvents([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeEvent,
        setActiveEvent,
        assignedEvents,
        loading,
        error,
        login,
        register,
        logout,
        refreshSession: checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
