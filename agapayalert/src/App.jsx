import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ReportMainPage from './pages/Reports/ReportMainPage';
import About from './pages/About';
import Support from './pages/Support';
import Dashboard from './pages/Admin/Dashboard';
import IndexReports from './pages/Admin/Reports/indexReports';
import NavBar from './components/NavBar';
import ReportCard from './pages/User/ReportCard';
import ProfileCard from './pages/User/ProfileCard';
import PoliceStation from './pages/Admin/PoliceStation/indexPolice';
import ProtectedRoute from './navigations/ProtectedRoute';
import { loginSuccess } from './redux/actions/authActions';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProfileRoute = location.pathname.startsWith('/profile');
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      // Dispatch login success action to update Redux state
      dispatch(loginSuccess({ user, token }));
    }
  }, [dispatch]);

  return (
    <div className="">
      {!isAdminRoute && !isProfileRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<ReportMainPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route
          path="/profile/*"
          element={
            <Routes>
              <Route path="" element={<ProfileCard />} />
              <Route path="report" element={<ReportCard />} />
            </Routes>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="reports" element={<IndexReports />} />
                <Route path="police-station" element={<PoliceStation />} />
                {/* Add more admin routes here */}
              </Routes>
            </ProtectedRoute>
          }
        />
        {/* Add more routes here */}
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