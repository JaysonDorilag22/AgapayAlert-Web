import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../../redux/actions/reportActions";
import AdminLayout from "../../../layouts/AdminLayout";
import ReportsTable from "./ReportTable/ReportsTable";

const IndexReports = () => {
  const dispatch = useDispatch();
  const { reports, totalPages, currentPage } = useSelector((state) => state.reports);
   const user = useSelector((state) => state.auth.user); // Assumes user info is in state.auth.user
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      await dispatch(getReports(cleanedFilters));
    };
    fetchData();
    console.log("pearasfasdf: ",filters)
  }, [dispatch, filters]);

  const handlePageChange = (page) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleSearchChange = (query) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      query, // Use 'query' as the key for backend compatibility
      page: 1,
    }));
  };

    // Filter reports assigned to the current user
// const filteredReports = reports || [];

  return (
    <AdminLayout>
      <div>
        <ReportsTable
          reports={reports || []} // Ensure reports is an array
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          filters={filters}
        />
      </div>
    </AdminLayout>
  );
};

export default IndexReports;