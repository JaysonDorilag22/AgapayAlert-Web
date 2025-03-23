import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../../redux/actions/reportActions";
import AdminLayout from "../../../layouts/AdminLayout";
import ReportsTable from "./ReportTable/ReportsTable";

const IndexReports = () => {
  const dispatch = useDispatch();
  const { reports, totalPages, currentPage } = useSelector((state) => state.reports);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const reportsResult = await dispatch(getReports(filters));
      console.log("Index Reports Data:", reportsResult.data);
    };

    fetchData();
  }, [dispatch, filters]);

  const handlePageChange = (page) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters, page: 1 }));
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setFilters((prevFilters) => ({ ...prevFilters, searchName: query, page: 1 }));
  };

  return (
    <AdminLayout>
      <div>
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

export default IndexReports;