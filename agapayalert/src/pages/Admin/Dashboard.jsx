import React from "react";
import AdminLayout from "../../layouts/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Section 1</h2>
          <p>Content for section 1.</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Section 2</h2>
          <p>Content for section 2.</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Section 3</h2>
          <p>Content for section 3.</p>
        </div>
        {/* Add more sections as needed */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;