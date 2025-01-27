import React from 'react';
import AdminNavBar from '../components/AdminNavBar';
import AdminTopNavBar from '../components/AdminTopNavBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminNavBar />
      <div className="flex-1 ml-[350px]">
        <AdminTopNavBar />
        <div className="mt-24 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;