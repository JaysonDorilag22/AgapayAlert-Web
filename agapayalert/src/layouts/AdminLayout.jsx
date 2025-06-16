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
    <div className="flex">
      <AdminNavBar />
      <div className="flex-1 ml-[350px]">
        <AdminTopNavBar />
        <div className="mt-24 p-4">
          {children}
        </div>
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