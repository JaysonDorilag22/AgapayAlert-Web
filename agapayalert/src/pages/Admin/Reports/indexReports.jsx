import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports, searchReports } from "../../../redux/actions/reportActions";
import AdminLayout from "../../../layouts/AdminLayout";
import ReportsTable from "./ReportTable/ReportsTable";

const indexReports = () => {
    const dispatch = useDispatch();
  const { reports, totalPages, currentPage } = useSelector((state) => state.reports);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const reportsResult = await dispatch(getReports(filters));
      console.log("Reports Data:", reportsResult.data);
    };

    fetchData();
  }, [dispatch, filters]);

  const handlePageChange = (page) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters, page: 1 }));
  };

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    const searchFilters = { ...filters, query, page: 1 };
    const searchResult = await dispatch(searchReports(searchFilters));
    console.log("Search Results:", searchResult.data);
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <ReportsTable
          reports={reports}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </div>
    </AdminLayout>
  );
};

export default indexReports;