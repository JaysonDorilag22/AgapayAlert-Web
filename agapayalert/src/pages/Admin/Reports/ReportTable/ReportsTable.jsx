import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { HiOutlineEye, HiChevronUpDown, HiChevronUp, HiChevronDown, HiExclamationTriangle } from "react-icons/hi2";
import { FaSearch, FaFilter, FaFileExcel, FaFilePdf, FaCopy, FaSort } from "react-icons/fa";
import { MdClear, MdRefresh } from "react-icons/md";
import ReportDetailsModal from "@/components/ReportDetailsModal";
import ReportsFilterModal from "@/components/ReportsFilterModal";
import * as XLSX from "xlsx";
import toastUtils from '@/utils/toastUtils';
import ComprehensiveReportsExportView from '@/components/Admin/ComprehensiveReportsExportView';
import html2pdf from 'html2pdf.js';

const ReportsTable = ({
  reports,
  totalPages,
  currentPage,
  onPageChange,
  onFilterChange,
  onSearchChange,
  filters = {},
  user,
  loading = false,
  totalReports = 0,
  allFilteredReports = [], // All filtered reports for comprehensive export
  onFetchAllReports, // Function to fetch all reports for export
}) => {
  const ALL_STATUS_OPTIONS = ["Pending", "Assigned", "Under Investigation", "Resolved", "Transferred"];
  const ALL_TYPE_OPTIONS = ["Absent", "Missing", "Abducted", "Kidnapped", "Hit-and-Run"];
  
  // Role-based access control
  const userRole = user?.roles?.[0]; // Get first role from roles array
  const isPoliceOfficer = userRole === 'police_officer';
  const isPoliceAdmin = userRole === 'police_admin';
  const isSuperAdmin = userRole === 'super_admin';
  
  const [search, setSearch] = useState(filters.query || "");
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortField, setSortField] = useState(filters.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState(filters.sortOrder || "desc");
  const [selectedReports, setSelectedReports] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [keyboardNavIndex, setKeyboardNavIndex] = useState(-1);
  const [exportData, setExportData] = useState([]); // State to hold export data
  const pdfRef = useRef();

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Count active filters (excluding role-based locked filters)
  const activeFilterCount = useMemo(() => {
    const countableFilters = Object.entries(filters).filter(([key, value]) => {
      if (key === 'page' || key === 'limit' || !value || value === '' || value === 'all') {
        return false;
      }
      
      // Don't count role-based locked filters
      if (isPoliceAdmin && key === 'city' && value === user?.city) {
        return false;
      }
      if (isPoliceOfficer && key === 'assignedOfficerId' && value === user?._id) {
        return false;
      }
      
      return true;
    });
    return countableFilters.length;
  }, [filters, isPoliceAdmin, isPoliceOfficer, user?.city, user?._id]);

  // Data validation and sanitization
  const validateReportData = (report) => {
    const errors = [];
    
    if (!report._id) errors.push('Missing report ID');
    if (!report.caseId) errors.push('Missing case ID');
    if (!report.type) errors.push('Missing report type');
    if (!report.personInvolved) {
      errors.push('Missing person involved data');
    } else {
      if (!report.personInvolved.firstName) errors.push('Missing first name');
      if (!report.personInvolved.lastName) errors.push('Missing last name');
      if (!report.personInvolved.lastKnownLocation) errors.push('Missing last known location');
    }
    if (!report.status) errors.push('Missing status');
    if (!report.createdAt) errors.push('Missing creation date');
    
    return errors;
  };

  // Sanitize and validate reports data
  const sanitizedReports = useMemo(() => {
    if (!reports || !Array.isArray(reports)) return [];
    
    return reports.filter(report => {
      const errors = validateReportData(report);
      if (errors.length > 0) {
        console.warn(`Report ${report.caseId || 'unknown'} has validation errors:`, errors);
      }
      return errors.length === 0;
    });
  }, [reports]);

  const hasData = sanitizedReports && sanitizedReports.length > 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'f':
            e.preventDefault();
            document.querySelector('input[type="text"]')?.focus();
            break;
          case 'e':
            e.preventDefault();
            if (e.shiftKey) {
              handleExportPDF();
            } else {
              handleExportExcel();
            }
            break;
          case 'r':
            e.preventDefault();
            window.location.reload();
            break;
        }
      }
      
      // Arrow key navigation for table rows
      if (hasData && ['ArrowUp', 'ArrowDown', 'Enter', 'Space'].includes(e.key)) {
        const maxIndex = sanitizedReports.length - 1;
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setKeyboardNavIndex(prev => Math.min(prev + 1, maxIndex));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setKeyboardNavIndex(prev => Math.max(prev - 1, -1));
            break;
          case 'Enter':
            if (keyboardNavIndex >= 0 && keyboardNavIndex <= maxIndex) {
              e.preventDefault();
              handleReportClick(sanitizedReports[keyboardNavIndex]._id);
            }
            break;
          case ' ':
            if (keyboardNavIndex >= 0 && keyboardNavIndex <= maxIndex) {
              e.preventDefault();
              handleSelectReport(sanitizedReports[keyboardNavIndex]._id);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasData, sanitizedReports, keyboardNavIndex]);

  // Reset keyboard navigation when reports change
  useEffect(() => {
    setKeyboardNavIndex(-1);
  }, [sanitizedReports]);

  // Enhanced export handlers with loading states and user confirmation
  const handleExportPDF = async () => {
    if (!hasData) {
      toastUtils('No data to export', "warning");
      return;
    }

    console.log('=== PDF Export Debug ===');
    console.log('- Current sanitized reports:', sanitizedReports.length);
    console.log('- Total reports available:', totalReports);
    console.log('- Current filters:', filters);
    console.log('- Has onFetchAllReports function:', !!onFetchAllReports);

    setIsExporting(true);
    let exportData = sanitizedReports; // Start with current page data
    
    try {
      // Always try to fetch all reports if we have the function and there are more reports than what's visible
      const shouldFetchAll = onFetchAllReports && (
        sanitizedReports.length < totalReports || 
        sanitizedReports.length === (filters.limit || 10)
      );
      
      console.log('- Should fetch all reports:', shouldFetchAll);
      console.log('- Condition 1 (less than total):', sanitizedReports.length < totalReports);
      console.log('- Condition 2 (equals limit):', sanitizedReports.length === (filters.limit || 10));
      
      if (shouldFetchAll) {
        toastUtils('Fetching all filtered reports for comprehensive export...', "info");
        console.log('- Calling onFetchAllReports with filters:', filters);
        const allReports = await onFetchAllReports(filters);
        console.log('- Received reports from fetch:', allReports?.length || 0);
        
        if (allReports && allReports.length > 0) {
          exportData = allReports;
          setExportData(allReports); // Store for PDF component
          console.log(`✅ Successfully fetched ${allReports.length} reports for export`);
          
          // Show success message with actual count
          if (allReports.length > sanitizedReports.length) {
            toastUtils(`Successfully fetched all ${allReports.length} reports for export!`, "success");
          }
          
          // Wait for state update to propagate
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          console.warn('❌ No reports returned from fetch all function, using current page data');
          setExportData(exportData); // Store current export data
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else {
        console.log('- Not fetching all reports, using current page data');
        setExportData(exportData); // Store current export data
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('- Final export data length:', exportData.length);
      console.log('=== End PDF Export Debug ===');
      
      // Show user what they're exporting
      const totalAvailable = totalReports || exportData.length;
      if (exportData.length < totalAvailable) {
        const message = `Exporting ${exportData.length} reports out of ${totalAvailable} total available reports.`;
        console.warn(message);
        const confirmed = window.confirm(`${message}\n\nNote: This may be due to current filters or pagination. Do you want to continue?`);
        if (!confirmed) {
          setIsExporting(false);
          return;
        }
      }

      // Show confirmation for large datasets
      if (exportData.length > 100) {
        const confirmed = window.confirm(
          `You are about to export ${exportData.length} reports to PDF. This comprehensive export includes data visualization and may take a while. Continue?`
        );
        if (!confirmed) {
          setIsExporting(false);
          return;
        }
      }
      
      if (!pdfRef.current) {
        toastUtils('PDF component not ready', "error");
        return;
      }
      
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `AgapayAlert-Comprehensive-Reports-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4',
          orientation: 'landscape'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      await html2pdf().set(opt).from(pdfRef.current).save();
      toastUtils(`Comprehensive PDF exported successfully (${exportData.length} reports with analytics)`, "success");
    } catch (error) {
      toastUtils('Failed to export PDF', "error");
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!hasData) {
      toastUtils('No data to export', "warning");
      return;
    }

    console.log('=== Excel Export Debug ===');
    console.log('- Current sanitized reports:', sanitizedReports.length);
    console.log('- Total reports available:', totalReports);
    console.log('- Has onFetchAllReports function:', !!onFetchAllReports);

    setIsExporting(true);
    let exportData = sanitizedReports; // Start with current page data
    
    try {
      // Always try to fetch all reports if we have the function and there are more reports than what's visible
      const shouldFetchAll = onFetchAllReports && (
        sanitizedReports.length < totalReports || 
        sanitizedReports.length === (filters.limit || 10)
      );
      
      console.log('- Should fetch all reports:', shouldFetchAll);
      
      if (shouldFetchAll) {
        toastUtils('Fetching all filtered reports for complete export...', "info");
        console.log('- Calling onFetchAllReports with filters:', filters);
        const allReports = await onFetchAllReports(filters);
        console.log('- Received reports from fetch:', allReports?.length || 0);
        
        if (allReports && allReports.length > 0) {
          exportData = allReports;
          console.log(`✅ Successfully fetched ${allReports.length} reports for Excel export`);
          
          // Show success message with actual count
          if (allReports.length > sanitizedReports.length) {
            toastUtils(`Successfully fetched all ${allReports.length} reports for export!`, "success");
          }
        } else {
          console.warn('❌ No reports returned from fetch all function, using current page data');
        }
      } else {
        console.log('- Not fetching all reports, using current page data');
      }
      
      console.log('- Final export data length:', exportData.length);
      console.log('=== End Excel Export Debug ===');

      // Show confirmation for large datasets
      if (exportData.length > 1000) {
        const confirmed = window.confirm(
          `You are about to export ${exportData.length} reports to Excel. This may take a while. Continue?`
        );
        if (!confirmed) {
          setIsExporting(false);
          return;
        }
      }
      
      const data = exportData.map((report) => ({
        "Report ID": report.caseId,
        "Type": report.type,
        "Name": `${report.personInvolved.firstName} ${report.personInvolved.lastName}`,
        "Age": report.personInvolved.age || 'N/A',
        "Gender": report.personInvolved.gender || 'N/A',
        "Date & Time Reported": new Date(report.createdAt).toLocaleString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
          hour: 'numeric', minute: 'numeric', hour12: true,
        }),
        "Last Known Location": report.personInvolved.lastKnownLocation,
        "Status": report.status,
        "City": report.city || 'N/A',
        "Barangay": report.barangay || 'N/A',
        "Police Station": report.policeStation || 'N/A',
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
      
      const filename = `AgapayAlert-Reports-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, filename);
      toastUtils(`Excel file exported successfully (${exportData.length} reports)`, "success");
    } catch (error) {
      toastUtils('Failed to export Excel file', "error");
      console.error('Excel export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced bulk actions
  const handleBulkExport = async (format) => {
    if (selectedReports.size === 0) {
      toastUtils('Please select reports to export', "warning");
      return;
    }        const selectedData = sanitizedReports.filter(report => selectedReports.has(report._id));
    
    if (format === 'excel') {
      setIsExporting(true);
      try {
        const data = selectedData.map((report) => ({
          "Report ID": report.caseId,
          "Type": report.type,
          "Name": `${report.personInvolved.firstName} ${report.personInvolved.lastName}`,
          "Age": report.personInvolved.age || 'N/A',
          "Gender": report.personInvolved.gender || 'N/A',
          "Date & Time Reported": new Date(report.createdAt).toLocaleString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: 'numeric', hour12: true,
          }),
          "Last Known Location": report.personInvolved.lastKnownLocation,
          "Status": report.status,
          "City": report.city || 'N/A',
          "Barangay": report.barangay || 'N/A',
          "Police Station": report.policeStation || 'N/A',
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Reports");
        
        const filename = `AgapayAlert-Selected-Reports-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, filename);
        toastUtils(`Selected reports exported successfully (${selectedData.length} reports)`, "success");
      } catch (error) {
        toastUtils('Failed to export selected reports', "error");
        console.error('Bulk export error:', error);
      } finally {
        setIsExporting(false);
      }
    }
  };

  const clearSelection = () => {
    setSelectedReports(new Set());
  };

  // Enhanced search with autocomplete suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate search suggestions based on available data
  const generateSearchSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = new Set();
    const lowerQuery = query.toLowerCase();

    sanitizedReports?.forEach(report => {
      // Add case ID suggestions
      if (report.caseId?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(report.caseId);
      }
      
      // Add name suggestions
      const fullName = `${report.personInvolved.firstName} ${report.personInvolved.lastName}`;
      if (fullName.toLowerCase().includes(lowerQuery)) {
        suggestions.add(fullName);
      }
      
      // Add location suggestions
      if (report.personInvolved.lastKnownLocation?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(report.personInvolved.lastKnownLocation);
      }
      
      // Add type suggestions
      if (report.type?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(report.type);
      }
    });

    const suggestionsList = Array.from(suggestions).slice(0, 5);
    setSearchSuggestions(suggestionsList);
    setShowSuggestions(suggestionsList.length > 0);
  };

  // Debounced search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Generate suggestions
    generateSearchSuggestions(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      onSearchChange(value);
      setShowSuggestions(false);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Clear timeout and search immediately
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onSearchChange(search);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange("");
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  // Sorting handlers
  const handleSort = (field) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
    onFilterChange({
      ...filters,
      sortBy: field,
      sortOrder: newSortOrder,
      page: 1,
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <HiChevronUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === 'asc' 
      ? <HiChevronUp className="w-4 h-4 text-white" />
      : <HiChevronDown className="w-4 h-4 text-white" />;
  };

  // Bulk selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReports(new Set(sanitizedReports.map(r => r._id)));
    } else {
      setSelectedReports(new Set());
    }
  };

  const handleSelectReport = (reportId) => {
    const newSelected = new Set(selectedReports);
    if (newSelected.has(reportId)) {
      newSelected.delete(reportId);
    } else {
      newSelected.add(reportId);
    }
    setSelectedReports(newSelected);
  };

  const clearFilters = () => {
    // Base filters with role-based restrictions maintained
    let baseFilters = { page: 1, limit: filters.limit || 10 };
    
    if (isPoliceAdmin && user?.city) {
      // Police Admin: maintain city restriction
      baseFilters.city = user.city;
    } else if (isPoliceOfficer && user?._id) {
      // Police Officer: maintain officer assignment restriction
      baseFilters.assignedOfficerId = user._id;
    }
    
    onFilterChange(baseFilters);
    setSearch("");
  };

  useEffect(() => {
    setStatusOptions(ALL_STATUS_OPTIONS);
    setTypeOptions(ALL_TYPE_OPTIONS);
  }, [reports]);

  useEffect(() => {
    setSearch(filters.query || "");
  }, [filters]);

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

  // Enhanced status badge with better accessibility
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: '⏳',
        ring: 'ring-yellow-200'
      },
      'Assigned': { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        icon: '👤',
        ring: 'ring-blue-200'
      },
      'Under Investigation': { 
        bg: 'bg-indigo-600', 
        text: 'text-white', 
        icon: '🔍',
        ring: 'ring-indigo-200'
      },
      'Resolved': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: '✅',
        ring: 'ring-green-200'
      },
      'Transferred': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        icon: '↗️',
        ring: 'ring-red-200'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: '❓',
      ring: 'ring-gray-200'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} ring-1 ${config.ring}`}>
        <span role="img" aria-hidden="true">{config.icon}</span>
        {status}
      </span>
    );
  };

  // Loading state component
  const LoadingRow = () => (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  // Enhanced empty state with actionable suggestions
  const EmptyState = () => (
    <tr>
      <td colSpan="8" className="py-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-8xl text-gray-300">📋</div>
          <div className="space-y-2">
            <div className="text-xl font-semibold text-gray-600">No Reports Found</div>
            <div className="text-sm text-gray-500 max-w-md mx-auto">
              {activeFilterCount > 0 ? (
                "No reports match your current filters. Try adjusting your search criteria below."
              ) : isPoliceOfficer ? (
                "You don't have any assigned reports yet. Reports assigned to you will appear here."
              ) : isPoliceAdmin ? (
                `No reports found for ${user?.city || 'your city'}. Reports from your city will appear here once they are created.`
              ) : (
                "No reports have been submitted yet. Reports will appear here once they are created."
              )}
            </div>
          </div>
          
          {activeFilterCount > 0 ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {isPoliceAdmin || isPoliceOfficer ? 'Clear User Filters' : 'Clear All Filters'}
              </button>
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
              {isPoliceOfficer ? (
                "💡 Tip: Reports assigned to you will automatically appear here"
              ) : isPoliceAdmin ? (
                `💡 Tip: Reports from ${user?.city || 'your city'} will automatically appear here`
              ) : (
                "💡 Tip: Use the search bar above to find specific reports by ID, name, or location"
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );

  // Truncate text helper
  const truncateText = (text, maxLength = 25) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filterOptions = {
    statusOptions: ALL_STATUS_OPTIONS,
    typeOptions: typeOptions.length ? typeOptions : ALL_TYPE_OPTIONS,
    // Add cityOptions, barangayOptions, policeStationOptions, genderOptions as needed
    // Role-based restrictions will be handled in the filter modal
  };

  const handleModalSubmit = (newFilters) => {
    console.log('Applied Filters:', newFilters); // Log the filters to the console
    
    // Apply role-based restrictions to filter submissions
    let restrictedFilters = { ...newFilters };
    
    if (isPoliceAdmin && user?.city) {
      // Police Admin: cannot change city filter
      restrictedFilters.city = user.city;
    } else if (isPoliceOfficer && user?._id) {
      // Police Officer: cannot change officer assignment
      restrictedFilters.assignedOfficerId = user._id;
    }
    
    onFilterChange(restrictedFilters);
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

  // Debug information
  useEffect(() => {
    console.log('ReportsTable Debug Info:');
    console.log('- Current reports (sanitized):', sanitizedReports.length);
    console.log('- Total reports available:', totalReports);
    console.log('- Current filters:', filters);
    console.log('- Has onFetchAllReports function:', !!onFetchAllReports);
    console.log('- Export data length:', exportData.length);
  }, [sanitizedReports, totalReports, filters, onFetchAllReports, exportData]);

  return (
    <div className="w-full space-y-6">
      {/* Header Section with Enhanced Stats and Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
                {/* Role-based access indicator */}
                {isPoliceOfficer && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Your Reports Only
                  </span>
                )}
                {isPoliceAdmin && user?.city && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {user.city} City
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Total: <span className="font-semibold">{totalReports || sanitizedReports?.length || 0}</span>
                </span>
                {loading && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Loading...
                  </span>
                )}
                {activeFilterCount > 0 && (
                  <span className="flex items-center gap-1 text-orange-600">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                  </span>
                )}
                {/* Role-based access information */}
                {isPoliceOfficer && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Officer Access
                  </span>
                )}
                {isPoliceAdmin && (
                  <span className="flex items-center gap-1 text-indigo-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    City Admin Access
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Selection and Quick Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {selectedReports.size > 0 && (
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                  {selectedReports.size} selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkExport('excel')}
                    disabled={isExporting}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    Export Selected
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-xs px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
            
            {/* Quick Status Overview */}
            {hasData && !loading && (
              <div className="flex gap-2 text-xs">
                {['Pending', 'Under Investigation', 'Resolved'].map(status => {
                  const count = sanitizedReports.filter(r => r.status === status).length;
                  const colors = {
                    'Pending': 'bg-yellow-100 text-yellow-800',
                    'Under Investigation': 'bg-blue-100 text-blue-800',
                    'Resolved': 'bg-green-100 text-green-800'
                  };
                  return count > 0 ? (
                    <span key={status} className={`px-2 py-1 rounded ${colors[status]}`}>
                      {status}: {count}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Controls Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Enhanced Search with Autocomplete */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="text"
                placeholder="Search by Report ID, Name, Location, or Type..."
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <MdClear className="w-4 h-4" />
                </button>
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-sm"
                    >
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {search && (
              <div className="mt-1 text-xs text-gray-500">
                Press Enter to search or wait 0.5s for auto-search
              </div>
            )}
          </form>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              title={
                isPoliceOfficer 
                  ? "Filter your reports only"
                  : isPoliceAdmin 
                    ? `Filter reports in ${user?.city || 'your city'}`
                    : "Filter all reports"
              }
            >
              <FaFilter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-blue-400 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
              {/* Role indicator on filter button */}
              {(isPoliceAdmin || isPoliceOfficer) && (
                <svg className="w-3 h-3 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                title="Clear all active filters"
              >
                <MdClear className="w-4 h-4" />
                Clear
              </button>
            )}

            <div className="w-px bg-gray-300 mx-1"></div>

            <button
              onClick={handleExportExcel}
              disabled={!hasData || isExporting}
              className="inline-flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              title={!hasData ? "No data to export" : 
                isPoliceOfficer 
                  ? `Export your assigned reports to Excel${totalReports ? ` (${totalReports} total available)` : ''}`
                  : isPoliceAdmin
                    ? `Export ${user?.city || 'your city'} reports to Excel${totalReports ? ` (${totalReports} total available)` : ''}`
                    : `Export all filtered reports to Excel${totalReports ? ` (up to ${totalReports} total available)` : ''}`
              }
            >
              <FaFileExcel className="w-4 h-4" />
              {isExporting ? 'Exporting...' : `Excel${totalReports ? ` (${isPoliceOfficer ? 'Your' : isPoliceAdmin ? user?.city || 'City' : 'All'} ${totalReports})` : ''}`}
            </button>

            <button
              onClick={handleExportPDF}
              disabled={!hasData || isExporting}
              className="inline-flex items-center gap-2 px-4 py-3 bg-[#123F7B] text-white rounded-lg hover:bg-[#123F7B]/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
              title={!hasData ? "No data to export" : 
                isPoliceOfficer 
                  ? `Export comprehensive PDF report for your assigned reports${totalReports ? ` (${totalReports} total available)` : ''}`
                  : isPoliceAdmin
                    ? `Export comprehensive PDF report for ${user?.city || 'your city'}${totalReports ? ` (${totalReports} total available)` : ''}`
                    : `Export comprehensive PDF report with analytics${totalReports ? ` (up to ${totalReports} total available)` : ''}`
              }
            >
              <FaFilePdf className="w-4 h-4" />
              {isExporting ? 'Exporting...' : `PDF Report${totalReports ? ` (${isPoliceOfficer ? 'Your' : isPoliceAdmin ? user?.city || 'City' : 'All'} ${totalReports})` : ''}`}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
              title="Refresh data"
            >
              <MdRefresh className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Export Info */}
        {hasData && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#123F7B] rounded-full"></span>
                <strong>Export:</strong> PDF includes comprehensive analytics & visualizations
              </span>
              <span className="text-gray-300">•</span>
              <span>
                Exports will fetch ALL filtered reports from database
                {totalReports && ` (${totalReports} total available)`}
              </span>
            </div>
          </div>
        )}

        {/* Filter Summary */}
        {(activeFilterCount > 0 || isPoliceAdmin || isPoliceOfficer) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {/* Role-based restrictions display */}
              {(isPoliceAdmin || isPoliceOfficer) && (
                <>
                  <span className="text-gray-600 font-medium">Access restrictions:</span>
                  {isPoliceAdmin && user?.city && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>City: {user.city} (locked)</span>
                    </span>
                  )}
                  {isPoliceOfficer && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Your reports only</span>
                    </span>
                  )}
                  {activeFilterCount > 0 && (
                    <span className="text-gray-400">•</span>
                  )}
                </>
              )}
              
              {/* Active filters display */}
              {activeFilterCount > 0 && (
                <>
                  <span className="text-gray-600 font-medium">Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => {
                    // Skip role-based locked filters and empty values
                    if (key === 'page' || key === 'limit' || !value || value === '' || value === 'all') {
                      return null;
                    }
                    
                    // Don't show locked filters for role-based users
                    if (isPoliceAdmin && key === 'city' && value === user?.city) {
                      return null;
                    }
                    if (isPoliceOfficer && key === 'assignedOfficerId' && value === user?._id) {
                      return null;
                    }
                    
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                        <span className="font-medium">{Array.isArray(value) ? value.join(', ') : value}</span>
                      </span>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Table Section */}
      <div className="bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(18,63,123,0.1)] border border-gray-100 overflow-hidden">
        {/* Table Header with Sort Info */}
        {hasData && (
          <div className="px-6 py-4 bg-gradient-to-r from-[#123F7B]/5 to-[#123F7B]/10 border-b border-[#123F7B]/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-[#123F7B] font-medium">
                Showing {sanitizedReports.length} of {totalReports || sanitizedReports.length} reports
                {sortField && (
                  <span className="ml-2 text-xs text-[#123F7B]/70">
                    • Sorted by {sortField} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-[#123F7B]/60">
                  💡 Click headers to sort • Select rows for bulk actions
                </div>
                <div className="relative group">
                  <button className="text-xs text-[#123F7B]/60 hover:text-[#123F7B] px-3 py-1.5 rounded-lg border border-[#123F7B]/20 hover:border-[#123F7B]/40 transition-colors">
                    ⌨️ Shortcuts
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 hidden group-hover:block z-50">
                    <div className="text-xs space-y-1">
                      <div className="font-medium text-[#123F7B] mb-2">Keyboard Shortcuts</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">Ctrl+F</kbd> Focus search</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">Ctrl+E</kbd> Export Excel</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">Ctrl+Shift+E</kbd> Export PDF</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">Ctrl+R</kbd> Refresh</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">↑↓</kbd> Navigate rows</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">Enter</kbd> View details</div>
                      <div><kbd className="px-1 py-0.5 bg-[#123F7B]/10 text-[#123F7B] rounded text-xs">Space</kbd> Select row</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#123F7B]/10">
            <thead className="bg-[#123F7B]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedReports.size === sanitizedReports?.length && sanitizedReports?.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-white/30 text-white bg-white/10 focus:ring-white focus:ring-offset-[#123F7B]"
                    />
                    <span className="text-xs text-white/90 font-medium">
                      {selectedReports.size > 0 ? `${selectedReports.size}` : 'All'}
                    </span>
                  </div>
                </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors group"
                    onClick={() => handleSort('caseId')}
                  >
                    <div className="flex items-center gap-2">
                      Report ID
                      <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {getSortIcon('caseId')}
                      </div>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors group"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {getSortIcon('type')}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Person Details
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors group"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Date Reported
                      <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {getSortIcon('createdAt')}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors group"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {getSortIcon('status')}
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#123F7B]/5">
              {loading ? (
                [...Array(5)].map((_, i) => <LoadingRow key={i} />)
              ) : !hasData ? (
                <EmptyState />
              ) : (
                sanitizedReports.map((report, index) => (
                  <tr 
                    key={report._id} 
                    className={`hover:bg-[#123F7B]/5 transition-colors ${
                      selectedReports.has(report._id) ? 'bg-[#123F7B]/10' : ''
                    } ${
                      keyboardNavIndex === index ? 'ring-2 ring-[#123F7B]/50 bg-[#123F7B]/15' : ''
                    }`}
                    tabIndex={0}
                    role="row"
                    aria-selected={selectedReports.has(report._id)}
                    onFocus={() => setKeyboardNavIndex(index)}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.has(report._id)}
                        onChange={() => handleSelectReport(report._id)}
                        className="rounded border-[#123F7B]/30 text-[#123F7B] focus:ring-[#123F7B]"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <button
                        onClick={() => handleCopyToClipboard(report.caseId)}
                        className="flex items-center gap-2 hover:text-[#123F7B] transition-colors group p-1 -m-1 rounded"
                        title="Click to copy Report ID"
                      >
                        <span className="font-mono">{report.caseId}</span>
                        <FaCopy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#123F7B]" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        report.type === 'Missing' ? 'bg-orange-100 text-orange-800' :
                        report.type === 'Abducted' ? 'bg-red-100 text-red-800' :
                        report.type === 'Kidnapped' ? 'bg-red-100 text-red-800' :
                        report.type === 'Hit-and-Run' ? 'bg-purple-100 text-purple-800' :
                        'bg-[#123F7B]/10 text-[#123F7B]'
                      }`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-gray-900">
                          {report.personInvolved.firstName} {report.personInvolved.lastName}
                        </span>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {report.personInvolved.age && (
                            <span>Age: {report.personInvolved.age}</span>
                          )}
                          {report.personInvolved.gender && (
                            <span>• {report.personInvolved.gender}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium">{new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(report.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit', hour12: true
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        <span 
                          title={report.personInvolved.lastKnownLocation}
                          className="block truncate"
                        >
                          {truncateText(report.personInvolved.lastKnownLocation, 30)}
                        </span>
                        {report.city && (
                          <span className="text-xs text-gray-400">
                            {report.city}{report.barangay && `, ${report.barangay}`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleReportClick(report._id)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-[#123F7B] text-white rounded-lg hover:bg-[#123F7B]/90 focus:ring-2 focus:ring-[#123F7B] focus:ring-offset-1 transition-all text-sm font-medium"
                        title="View Report Details"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {hasData && (
          <div className="bg-gradient-to-r from-[#123F7B]/5 to-[#123F7B]/10 px-6 py-4 border-t border-[#123F7B]/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Mobile pagination */}
              <div className="flex justify-between sm:hidden">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-[#123F7B]/30 text-sm font-medium rounded-md text-[#123F7B] bg-white hover:bg-[#123F7B]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center px-4 text-sm text-[#123F7B] font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-[#123F7B]/30 text-sm font-medium rounded-md text-[#123F7B] bg-white hover:bg-[#123F7B]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
              
              {/* Desktop pagination */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <p className="text-sm text-[#123F7B] font-medium">
                    Showing page <span className="font-semibold">{currentPage}</span> of{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </p>
                  {totalReports && (
                    <p className="text-xs text-[#123F7B]/70">
                      ({totalReports} total results)
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Page number inputs for quick navigation */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#123F7B]/70">Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          onPageChange(page);
                        }
                      }}
                      className="w-16 px-2 py-1 border border-[#123F7B]/30 rounded text-center text-sm focus:ring-2 focus:ring-[#123F7B] focus:border-[#123F7B]"
                    />
                  </div>
                  
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => onPageChange(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-[#123F7B]/30 bg-white text-sm font-medium text-[#123F7B] hover:bg-[#123F7B]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      First
                    </button>
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 border border-[#123F7B]/30 bg-white text-sm font-medium text-[#123F7B] hover:bg-[#123F7B]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 border border-[#123F7B]/30 bg-white text-sm font-medium text-[#123F7B] hover:bg-[#123F7B]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => onPageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-[#123F7B]/30 bg-white text-sm font-medium text-[#123F7B] hover:bg-[#123F7B]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Last
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden PDF Export Component */}
      <div style={{ display: 'none' }}>
        <div ref={pdfRef}>
          <ComprehensiveReportsExportView
            reports={sanitizedReports}
            allReports={exportData.length > 0 ? exportData : sanitizedReports}
            totalReports={totalReports || sanitizedReports?.length || 0}
            filters={filters}
            user={user}
          />
        </div>
      </div>

      {/* Modals */}
      <ReportsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialFilters={filters}
        user={user}
        options={filterOptions}
      />

      {selectedReportId && (
        <ReportDetailsModal 
          reportId={selectedReportId} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default ReportsTable;