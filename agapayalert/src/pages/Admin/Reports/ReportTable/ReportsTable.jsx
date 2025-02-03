import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineEye } from "react-icons/hi2";
import { extractUniqueValues } from "@/utils/extractUniqueValues";
import ReportDetailsModal from "@/components/ReportDetailsModal";
import { FaSearch } from "react-icons/fa";

const ReportsTable = ({ reports, totalPages, currentPage, onPageChange, onFilterChange, onSearchChange }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const uniqueStatusValues = extractUniqueValues(reports, 'status');
    setStatusOptions(uniqueStatusValues);

    const uniqueTypeValues = extractUniqueValues(reports, 'type');
    setTypeOptions(uniqueTypeValues);
  }, [reports]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(search);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onFilterChange({ query: search, status: e.target.value, type });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    onFilterChange({ query: search, status, type: e.target.value });
  };

  const handleReportClick = (reportId) => {
    setSelectedReportId(reportId);
  };

  const handleCloseModal = () => {
    setSelectedReportId(null);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start gap-4 mb-4">
      {/* <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 border border-[#123F7B] rounded-full focus:outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 bg-[#123F7B] text-white px-2 py-1 rounded-full">
            <FaSearch />
          </button>
        </form> */}
        <select value={status} onChange={handleStatusChange} className="border border-gray-300 rounded px-4 py-2">
          <option value="">All Statuses</option>
          {statusOptions.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
        <select value={type} onChange={handleTypeChange} className="border border-gray-300 rounded px-4 py-2">
          <option value="">All Types</option>
          {typeOptions.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {typeOption}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300 shadow-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300">Report ID</th>
            <th className="py-2 px-4 border-b border-gray-300">Type</th>
            <th className="py-2 px-4 border-b border-gray-300">Name</th>
            <th className="py-2 px-4 border-b border-gray-300">Date & Time Reported</th>
            <th className="py-2 px-4 border-b border-gray-300">Last Known Location</th>
            <th className="py-2 px-4 border-b border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td className="py-2 px-4 border-b border-gray-300">{report._id}</td>
              <td className="py-2 px-4 border-b border-gray-300">{report.type}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                {report.personInvolved.firstName} {report.personInvolved.lastName}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {new Date(report.createdAt).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">{report.personInvolved.lastKnownLocation}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                <button onClick={() => handleReportClick(report._id)} className="flex items-center justify-center">
                  <div className="bg-[#123F7B] px-4 py-2 rounded-full shadow-lg">
                    <HiOutlineEye className="text-white w-6 h-6" />
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedReportId && (
        <ReportDetailsModal reportId={selectedReportId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ReportsTable;