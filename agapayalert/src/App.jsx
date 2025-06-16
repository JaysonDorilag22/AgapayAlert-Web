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
import EditProfileCard from './pages/User/EditProfileCard';
import PoliceStation from './pages/Admin/PoliceStation/indexPolice';
import PoliceUsers from './pages/Admin/Users/indexUsers';
import IndexCharts from './pages/Admin/Analytics/IndexCharts';
import ProtectedRoute from './navigations/ProtectedRoute';
import { loginSuccess } from './redux/actions/authActions';
import { Toaster } from "sonner";
import { ReportModalProvider } from './layouts/ReportModalProvider';
import ForgotPassword from "@/pages/User/ForgotPassword";
import ResetPassword from "@/pages/User/ResetPassword";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile/*"
          element={
            <Routes>
              <Route path="" element={<ProfileCard />} />
              <Route path="report" element={<ReportCard />} />
              <Route path="settings" element={<EditProfileCard />} />
              {/* Add more profile routes here */}
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
                <Route path="analytics" element={<IndexCharts />} />
                <Route path="users" element={<PoliceUsers />} />

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
    <ReportModalProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <AppContent />
      </Router>
    </ReportModalProvider>
  );
}