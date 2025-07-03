import React from "react";

// Helper: get value or fallback (same as AnalyticsExportPDFView)
const get = (obj, path, fallback = "-") => {
  try {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : fallback), obj);
  } catch {
    return fallback;
  }
};

// Robust helper functions to access report fields with multiple fallbacks
const getReportField = (report, field, fallback = "N/A") => {
  if (!report) return fallback;
  
  const fieldMappings = {
    // ID fields
    id: [report._id, report.id, report.caseId],
    caseId: [report.caseId, report.case_id, report.id, report._id],
    
    // Basic fields
    type: [report.type, report.reportType, report.case_type],
    status: [report.status, report.reportStatus, report.case_status],
    city: [report.city, report.personInvolved?.city, report.location?.city],
    barangay: [report.barangay, report.personInvolved?.barangay, report.location?.barangay],
    
    // Date fields
    createdAt: [report.createdAt, report.created_at, report.dateCreated, report.dateReported],
    updatedAt: [report.updatedAt, report.updated_at, report.dateUpdated],
    
    // Person involved fields
    firstName: [
      report.personInvolved?.firstName,
      report.personInvolved?.first_name,
      report.first_name,
      report.firstName,
      report.personInvolved?.name?.split(' ')[0]
    ],
    lastName: [
      report.personInvolved?.lastName,
      report.personInvolved?.last_name,
      report.last_name,
      report.lastName,
      report.personInvolved?.name?.split(' ').slice(1).join(' ')
    ],
    age: [
      report.personInvolved?.age,
      report.age,
      report.personInvolved?.ageAtTimeOfIncident
    ],
    gender: [
      report.personInvolved?.gender,
      report.gender,
      report.personInvolved?.sex
    ],
    lastKnownLocation: [
      report.personInvolved?.lastKnownLocation,
      report.lastKnownLocation,
      report.location?.address,
      report.address,
      report.personInvolved?.address
    ]
  };
  
  const candidates = fieldMappings[field] || [report[field]];
  
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && candidate !== "") {
      return candidate;
    }
  }
  
  return fallback;
};

// Helper to get person's full name
const getPersonName = (report, fallback = "N/A") => {
  const firstName = getReportField(report, 'firstName', '');
  const lastName = getReportField(report, 'lastName', '');
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || fallback;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });
};

const ComprehensiveReportsExportView = React.forwardRef(({ reports = [], allReports = [], filters = {}, user, exportedBy }, ref) => {
  // Use allReports for comprehensive export, fallback to reports
  const exportReports = allReports && allReports.length > 0 ? allReports : reports || [];
  const finalExportedBy = exportedBy || (user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Admin');
  
  console.log("🔄 ComprehensiveReportsExportView - Rendering with data:", {
    reportsCount: reports.length,
    allReportsCount: allReports.length,
    exportReportsCount: exportReports.length,
    filters,
    finalExportedBy
  });

  if (!exportReports || exportReports.length === 0) {
    return (
      <div ref={ref} className="w-full bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">No Reports Available</h1>
        <p className="text-gray-500">There are no reports to export based on the current filters.</p>
      </div>
    );
  }

  const datePrinted = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  // Calculate statistics
  const totalReportsCount = exportReports.length;
  const resolvedReports = exportReports.filter(r => ['Found', 'Resolved', 'Closed'].includes(getReportField(r, 'status'))).length;
  const pendingReports = exportReports.filter(r => getReportField(r, 'status') === 'Pending').length;
  const underInvestigation = exportReports.filter(r => ['Under Investigation', 'Investigating'].includes(getReportField(r, 'status'))).length;
  const assignedReports = exportReports.filter(r => getReportField(r, 'status') === 'Assigned').length;
  const transferredReports = exportReports.filter(r => getReportField(r, 'status') === 'Transferred').length;

  // Data distribution calculations
  const statusCounts = exportReports.reduce((acc, report) => {
    const status = getReportField(report, 'status');
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const cityCounts = exportReports.reduce((acc, report) => {
    const city = getReportField(report, 'city');
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const typeCounts = exportReports.reduce((acc, report) => {
    const type = getReportField(report, 'type');
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Top 5 cities
  const topCities = Object.entries(cityCounts).sort(([,a], [,b]) => b - a).slice(0, 5);
  
  const totalCities = Object.keys(cityCounts).length;
  const totalBarangays = new Set(exportReports.map(r => getReportField(r, 'barangay')).filter(b => b !== "N/A")).size;

  // Helper function for filter labels
  const getFilterLabel = (value, defaultLabel) => {
    return value && value !== "" ? value : defaultLabel;
  };

  // Pagination for landscape - fit more rows per page (increased for landscape)
  const rowsPerPage = 25; // Increased for landscape
  const tablePages = [];
  for (let i = 0; i < exportReports.length; i += rowsPerPage) {
    tablePages.push(exportReports.slice(i, i + rowsPerPage));
  }

  console.log("📊 Export calculations:", {
    totalReportsCount,
    resolvedReports,
    pendingReports,
    statusCounts,
    topCities,
    tablePages: tablePages.length
  });

  return (
    <>
      {/* Print-specific CSS - Optimized for Landscape */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @media print {
          body { 
            font-family: 'Poppins', sans-serif !important; 
            margin: 0;
            padding: 0;
            font-size: 10px;
          }
          
          .page-break { 
            page-break-before: always; 
          }
          
          .avoid-break { 
            page-break-inside: avoid; 
          }
          
          .print-page {
            width: 100%;
            min-height: 100vh;
            margin: 0;
            padding: 15px 20px;
            box-sizing: border-box;
          }
          
          table { 
            border-collapse: collapse !important; 
            width: 100% !important;
            font-size: 8px !important;
          }
          
          th, td { 
            border: 1px solid #333 !important; 
            padding: 3px 4px !important;
            font-size: 8px !important;
            font-family: 'Poppins', sans-serif !important;
            line-height: 1.1 !important;
            vertical-align: top !important;
          }
          
          th {
            background-color: #123F7B !important;
            color: white !important;
            font-weight: 600 !important;
            font-size: 9px !important;
          }
          
          .bg-gray-50 { background-color: #f9f9f9 !important; }
          .text-white { color: white !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-green-50 { background-color: #f0fdf4 !important; }
          .bg-yellow-50 { background-color: #fefce8 !important; }
          .bg-red-50 { background-color: #fef2f2 !important; }
          .bg-purple-50 { background-color: #f5f3ff !important; }
          
          h1 { font-size: 18px !important; margin-bottom: 6px !important; }
          h2 { font-size: 14px !important; margin-bottom: 8px !important; }
          h3 { font-size: 11px !important; margin-bottom: 4px !important; }
          
          /* Landscape-specific optimizations */
          .landscape-header { 
            text-align: center !important; 
            margin-bottom: 12px !important; 
          }
          
          .landscape-filters { 
            display: grid !important; 
            grid-template-columns: repeat(3, 1fr) !important; 
            gap: 6px !important; 
            font-size: 8px !important; 
          }
          
          .landscape-stats { 
            display: grid !important; 
            grid-template-columns: repeat(6, 1fr) !important; 
            gap: 6px !important; 
            margin-bottom: 12px !important;
          }
          
          .landscape-stat-box { 
            text-align: center !important; 
            padding: 6px 3px !important; 
            font-size: 8px !important; 
          }
          
          .landscape-stat-number { 
            font-size: 16px !important; 
            font-weight: 700 !important; 
            display: block !important; 
          }
          
          .landscape-chart { 
            display: grid !important; 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 15px !important; 
            margin-bottom: 12px !important;
          }
          
          .compact-text { 
            font-size: 7px !important; 
            line-height: 1.1 !important; 
          }
        }
        
        @page {
          margin: 0.4in;
          size: A4 landscape;
        }
      `}</style>
      
      <div
        ref={ref}
        className="w-full bg-white text-black print-page"
        style={{ 
          padding: "15px 20px",
          fontSize: "10px",
          lineHeight: "1.2",
          fontFamily: "'Poppins', sans-serif",
          pageBreakInside: "avoid"
        }}
      >
        {/* Header Section - Optimized for Landscape */}
        <div className="landscape-header" style={{ pageBreakAfter: "avoid", pageBreakInside: "avoid" }}>
          <h1 className="text-2xl font-bold text-[#123F7B] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            AGAPAY ALERT - COMPREHENSIVE REPORTS
          </h1>
          <div className="flex justify-center items-center gap-6 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <p className="text-sm text-gray-600">Generated on {datePrinted}</p>
            <p className="text-sm text-gray-500">Exported by: {finalExportedBy}</p>
          </div>
          
          {/* Applied Filters - Compact Layout */}
          <div className="bg-gray-50 p-3 rounded-lg" style={{ pageBreakInside: "avoid" }}>
            <h3 className="font-bold text-sm mb-2 text-[#123F7B]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Applied Filters:</h3>
            <div className="landscape-filters" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div><strong>Status:</strong> {getFilterLabel(filters?.status, "All Statuses")}</div>
              <div><strong>Type:</strong> {getFilterLabel(filters?.type, "All Types")}</div>
              <div><strong>City:</strong> {getFilterLabel(filters?.city, "All Cities")}</div>
              <div><strong>Barangay:</strong> {getFilterLabel(filters?.barangay, "All Barangays")}</div>
              <div><strong>Gender:</strong> {getFilterLabel(filters?.gender, "All Genders")}</div>
              <div><strong>Date Range:</strong> {filters?.startDate && filters?.endDate ? 
                `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}` : "All Dates"}</div>
            </div>
          </div>
        </div>

        {/* Key Statistics - Landscape Optimized */}
        <div className="mb-4" style={{ pageBreakBefore: "auto", pageBreakAfter: "avoid", pageBreakInside: "avoid" }}>
          <h2 className="text-xl font-bold text-[#123F7B] mb-3 border-b-2 border-[#123F7B] pb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            KEY STATISTICS
          </h2>
          <div className="landscape-stats">
            <div className="landscape-stat-box bg-blue-50 rounded-lg border border-blue-200">
              <span className="landscape-stat-number text-[#123F7B]">{exportReports.length}</span>
              <span className="text-xs text-gray-600">Total Reports</span>
            </div>
            <div className="landscape-stat-box bg-green-50 rounded-lg border border-green-200">
              <span className="landscape-stat-number text-green-600">{resolvedReports}</span>
              <span className="text-xs text-gray-600">Resolved</span>
            </div>
            <div className="landscape-stat-box bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="landscape-stat-number text-yellow-600">{pendingReports}</span>
              <span className="text-xs text-gray-600">Pending</span>
            </div>
            <div className="landscape-stat-box bg-blue-50 rounded-lg border border-blue-200">
              <span className="landscape-stat-number text-blue-600">{underInvestigation}</span>
              <span className="text-xs text-gray-600">Under Investigation</span>
            </div>
            <div className="landscape-stat-box bg-purple-50 rounded-lg border border-purple-200">
              <span className="landscape-stat-number text-purple-600">{assignedReports}</span>
              <span className="text-xs text-gray-600">Assigned</span>
            </div>
            <div className="landscape-stat-box bg-orange-50 rounded-lg border border-orange-200">
              <span className="landscape-stat-number text-orange-600">{transferredReports}</span>
              <span className="text-xs text-gray-600">Transferred</span>
            </div>
          </div>
        </div>

        {/* Data Distribution - Landscape Optimized */}
        <div className="mb-4" style={{ pageBreakBefore: "auto", pageBreakAfter: "avoid", pageBreakInside: "avoid" }}>
          <h2 className="text-xl font-bold text-[#123F7B] mb-3 border-b-2 border-[#123F7B] pb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            DATA DISTRIBUTION
          </h2>
          <div className="landscape-chart">
            {/* Status Distribution */}
            <div>
              <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>By Status</h3>
              <div className="space-y-1">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded border compact-text">
                    <span className="font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{status}</span>
                    <span className="bg-[#123F7B] text-white px-2 py-1 rounded compact-text font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <h3 className="font-bold mb-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Top Cities</h3>
              <div className="space-y-1">
                {topCities.map(([city, count]) => (
                  <div key={city} className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded border compact-text">
                    <span className="font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{city}</span>
                    <span className="bg-[#123F7B] text-white px-2 py-1 rounded compact-text font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table - Multiple Pages */}
        {tablePages.map((pageReports, pageIndex) => (
          <div 
            key={pageIndex} 
            className="mb-6" 
            style={{ 
              pageBreakBefore: pageIndex === 0 ? "always" : "always", 
              pageBreakAfter: "avoid", 
              pageBreakInside: "avoid" 
            }}
          >
            <h2 className="text-xl font-bold text-[#123F7B] mb-4 border-b-2 border-[#123F7B] pb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              REPORTS TABLE {tablePages.length > 1 ? `(Page ${pageIndex + 1} of ${tablePages.length})` : ''}
              <span className="text-sm font-normal text-gray-600 ml-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Showing {(pageIndex * rowsPerPage) + 1} - {Math.min((pageIndex + 1) * rowsPerPage, totalReportsCount)} of {totalReportsCount} reports
              </span>
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <thead>
                  <tr className="bg-[#123F7B] text-white">
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Case ID</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Name</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Age</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Gender</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Type</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Status</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">City</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Barangay</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Date Reported</th>
                    <th className="text-left p-2 text-xs font-semibold border border-gray-300">Last Known Location</th>
                  </tr>
                </thead>
                <tbody>
                  {pageReports.map((report, index) => (
                    <tr key={getReportField(report, 'id') || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'caseId')}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getPersonName(report)}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'age')}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'gender')}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'type')}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ['Found', 'Resolved', 'Closed'].includes(getReportField(report, 'status')) ? 'bg-green-100 text-green-800' :
                          getReportField(report, 'status') === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          ['Under Investigation', 'Investigating'].includes(getReportField(report, 'status')) ? 'bg-blue-100 text-blue-800' :
                          getReportField(report, 'status') === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                          getReportField(report, 'status') === 'Transferred' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getReportField(report, 'status')}
                        </span>
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'city')}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'barangay')}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'createdAt') ? formatDate(getReportField(report, 'createdAt')) : 'N/A'}
                      </td>
                      <td className="p-2 text-xs border border-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {getReportField(report, 'lastKnownLocation')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Export Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-t-4 border-[#123F7B]" style={{ pageBreakBefore: "avoid", pageBreakInside: "avoid" }}>
          <h3 className="font-bold text-sm mb-2 text-[#123F7B]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Export Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div><strong>Total Records:</strong> {totalReportsCount}</div>
            <div><strong>Pages Generated:</strong> {tablePages.length + 2}</div>
            <div><strong>Resolution Rate:</strong> {totalReportsCount > 0 ? ((resolvedReports / totalReportsCount) * 100).toFixed(1) : 0}%</div>
            <div><strong>Export Date:</strong> {datePrinted}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <p>This document was generated by the AGAPAY ALERT system for official use only.</p>
          <p>© {new Date().getFullYear()} AGAPAY ALERT - All rights reserved</p>
        </div>
      </div>
    </>
  );
});

ComprehensiveReportsExportView.displayName = "ComprehensiveReportsExportView";

export default ComprehensiveReportsExportView;
