import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Web Layout & Pages (Warm Precision)
import PublicLayout from './components/public/PublicLayout';
import HomePage from './pages/public/HomePage';
import PlatformPage from './pages/public/PlatformPage';
import CaraKerjaPage from './pages/public/CaraKerjaPage';
import EventCatalogPage from './pages/public/EventCatalogPage';
import EventDetailPage from './pages/public/EventDetailPage';
import UntukPenyelenggaraPage from './pages/public/UntukPenyelenggaraPage';
import FaqPage from './pages/public/FaqPage';
import LoginPage from './pages/public/LoginPage';

// Competition Dashboard (Internal multi-role operations)
import DashboardPage from './pages/dashboard/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="platform" element={<PlatformPage />} />
            <Route path="cara-kerja" element={<CaraKerjaPage />} />
            <Route path="event" element={<EventCatalogPage />} />
            <Route path="event/:id" element={<EventDetailPage />} />
            <Route path="untuk-penyelenggara" element={<UntukPenyelenggaraPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          {/* Internal Competition Dashboard Route */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
