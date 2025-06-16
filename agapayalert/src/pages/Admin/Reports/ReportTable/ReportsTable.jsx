import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineEye } from "react-icons/hi2";
import { extractUniqueValues } from "@/utils/extractUniqueValues";
import ReportDetailsModal from "@/components/ReportDetailsModal";
import * as XLSX from "xlsx";
import { FaSearch } from "react-icons/fa"; // Add this import
import toastUtils from '@/utils/toastUtils';

const ReportsTable = ({
  reports,
  totalPages,
  currentPage,
  onPageChange,
  onFilterChange,
  onSearchChange,
  filters = {},
}) => {
  const ALL_STATUS_OPTIONS = ["Pending", "Assigned", "Under Investigation", "Resolved", "Transferred"];
  const ALL_TYPE_OPTIONS = ["Absent", "Missing", "Abducted", "Kidnapped", "Hit-and-Run"];
  const [search, setSearch] = useState(filters.query || "");
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const uniqueStatusValues = extractUniqueValues(reports, 'status');
    setStatusOptions(uniqueStatusValues);

    const uniqueTypeValues = extractUniqueValues(reports, 'type');
    setTypeOptions(uniqueTypeValues);
  }, [reports]);

  useEffect(() => {
    setSearch(filters.query || "");
  }, [filters]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(search);
  };

  const handleStatusChange = (e) => {
    onFilterChange({
      ...filters,
      status: e.target.value,
      page: 1,
    });
  };

  const handleTypeChange = (e) => {
    onFilterChange({
      ...filters,
      type: e.target.value,
      page: 1,
    });
  };

  const handleReportClick = (reportId) => {
    setSelectedReportId(reportId);
  };

  const handleCloseModal = () => {
    setSelectedReportId(null);
  };

  const getStatusTable  = (status) => {
    switch (status) {
        case 'Pending':
            return (
                <div className='bg-[#FBBC05]/10 px-2 py-2 rounded-full'>
                      <p className='text-[#FBBC05] text-xs font-semibold text-center'>{status}</p>
                </div>
            );
        case 'Assigned':
            return (
                <div className='bg-[#123F7B]/10 px-2 py-2 rounded-full'>
                      <p className='text-[#123F7B] text-xs font-semibold text-center'>{status}</p>
                </div>
            );
        case 'Under Investigation':
            return (
                <div className='bg-[#123F7B] px-2 py-2 rounded-full'>
                    <p className='text-white text-xs font-semibold text-center'>{status}</p>
                </div>
            );
        case 'Resolved':
            return (
                <div className='bg-[#34A853]/10 px-2 py-2 rounded-full'>
                    <p className='text-[#34A853] text-xs font-semibold text-center'>{status}</p>
                </div>
            );
         case 'Transferred':
            return (
                <div className='bg-[#D46A79]/10 px-2 py-2 rounded-full'>
                    <p className='text-[#D46A79] text-xs font-semibold text-center'>{status}</p>
                </div>
            );
    }
  };

  const handleCopyToClipboard = (text) => {
      setTimeout(() => {
          navigator.clipboard.writeText(text).then(() => {
              toastUtils('Copied to clipboard: ' + text, "success");
          }).catch((err) => {
              console.error('Failed to copy text: ', err);
              toastUtils('Failed to copy text', "error");
          });
      }, 100);
  };

// Export to Excel handler
  const handleExportExcel = () => {
    // Prepare data for Excel
    const data = reports.map((report) => ({
      "Report ID": report.caseId,
      "Type": report.type,
      "Name": `${report.personInvolved.firstName} ${report.personInvolved.lastName}`,
      "Date & Time Reported": new Date(report.createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      "Last Known Location": report.personInvolved.lastKnownLocation,
      "Status": report.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    XLSX.writeFile(workbook, "reports.xlsx");
  };

  return (
    <div className="w-full">
      <div className="flex justify-start gap-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by Report ID or Name"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-2 py-1 border border-[#123F7B] rounded-full focus:outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 bg-[#123F7B] text-white px-2 py-1 rounded-full">
            <FaSearch />
          </button>
        </form>
        {/* <select value={filters.status || ""} onChange={handleStatusChange} className="border border-[#123f7B] rounded-3xl px-2 py-1 text-sm">
          <option value="">All Statuses</option>
          {ALL_STATUS_OPTIONS.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
        <select value={filters.type || ""} onChange={handleTypeChange} className="border border-[#123f7B] rounded-3xl px-2 py-1 text-sm">
          <option value="" className="">All Types</option>
          {ALL_TYPE_OPTIONS.map((typeOption) => (
            <option key={typeOption} value={typeOption}>
              {typeOption}
            </option>
          ))}
        </select> */}
        <button
          onClick={handleExportExcel}
          className="bg-[#34A853] text-white px-4 py-2 rounded shadow font-semibold"
        >
          Export to Excel
        </button>
      </div>
      <table className="min-w-full bg-white rounded-2xl px-2 shadow-[#123F7B]/25 shadow-lg overflow-hidden">
        <thead className="bg-[#123F7B] text-white">
          <tr>
            <th className="py-2 px-4 text-start">Report ID</th>
            <th className="py-2 px-4 text-start">Type</th>
            <th className="py-2 px-4 text-start">Name</th>
            <th className="py-2 px-4 text-start">Date & Time Reported</th>
            <th className="py-2 px-4 text-start">Last Known Location</th>
            <th className="py-2 px-4 text-start">Status</th>
            <th className="py-2 px-4 text-start">Action</th>
          </tr>
        </thead>
        <tbody className="text-start">
          {reports.map((report) => (
            <tr key={report._id} className="hover:bg-[#123f7b]/10">
              <td className="py-2 px-4 cursor-pointer" onClick={() => handleCopyToClipboard(report.caseId)}>{report.caseId}</td>
              <td className="py-2 px-4">{report.type}</td>
              <td className="py-2 px-4">
                {report.personInvolved.firstName} {report.personInvolved.lastName}
              </td>
              <td className="py-2 px-4">
                {new Date(report.createdAt).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </td>
              <td className="py-2 px-4">{report.personInvolved.lastKnownLocation}</td>
              <td className="justify-start text-center">
              <div className="m-2">
                {getStatusTable(report?.status)}
              </div>
              </td>
              <td className="py-2 px-4">
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
      <div className="flex justify-between place-items-center content-center mt-4">
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