import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import Guests from './pages/Guests';

// Simple Analytics and Settings pages for completeness
const Analytics: React.FC = () => (
  <div className="space-y-6">
    <div className="animate-slide-up">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      <p className="text-gray-600 mt-2">Detailed analytics and reporting dashboard</p>
    </div>
    <div className="card animate-fade-in">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
        <p className="text-gray-600">Detailed reports and insights coming soon...</p>
      </div>
    </div>
  </div>
);

const Settings: React.FC = () => (
  <div className="space-y-6">
    <div className="animate-slide-up">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600 mt-2">Configure your hotel management system</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="Grand Hotel" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} defaultValue="123 Hotel Street, City, Country" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" defaultValue="+1-555-0123" />
          </div>
        </div>
      </div>
      
      <div className="card animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Email Notifications</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Auto Check-out</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'rooms':
        return <Rooms />;
      case 'reservations':
        return <Reservations />;
      case 'guests':
        return <Guests />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;