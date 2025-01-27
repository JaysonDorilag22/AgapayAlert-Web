import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ReportMainPage from './pages/Reports/ReportMainPage';
import About from './pages/About';
import Support from './pages/Support';
import Dashboard from './pages/Admin/Dashboard';
import NavBar from './components/NavBar';
import ProtectedRoute from './navigations/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="">
      {!isAdminRoute && <NavBar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<ReportMainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
          {/* Add more admin routes here */}
        </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}