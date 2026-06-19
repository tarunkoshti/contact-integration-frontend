import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashboardLayout';
import GmailAccountsPage from './pages/GmailAccountsPage';
import CreateContactPage from './pages/CreateContactPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Route Definitions */}
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<GmailAccountsPage />} />
          <Route path="/create-contact" element={<CreateContactPage />} />
        </Route>
      </Routes>

      {/* Toast Alerts */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-white text-slate-800 border border-slate-200 shadow-md rounded-xl',
          style: {
            background: '#ffffff',
            color: '#1e293b',
            borderColor: '#e2e8f0',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}
