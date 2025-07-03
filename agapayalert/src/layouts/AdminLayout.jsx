import React from 'react';
import { useLocation } from "react-router-dom";
import AdminNavBar from '../components/AdminNavBar';
import AdminTopNavBar from '../components/AdminTopNavBar';
import { useReportModal } from './ReportModalProvider';
import ReportDetailsModal from '@/components/ReportDetailsModal';

const AdminLayout = ({ children }) => {
  const { selectedReportId, isOpen, closeModal } = useReportModal();
  const location = useLocation();

  // Close modal on route change
  React.useEffect(() => {
    closeModal();
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="flex-1 ml-80 min-w-0">
        <AdminTopNavBar />
        <main className="mt-16 p-6">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      {/* Global Report Details Modal */}
      {isOpen && (
        <ReportDetailsModal
          reportId={selectedReportId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AdminLayout;