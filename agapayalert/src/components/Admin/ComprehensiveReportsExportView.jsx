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
    city: [
      report.city, 
      report.personInvolved?.city, 
      report.location?.city,
      report.assignedPoliceStation?.address?.city,
      report.policeStation?.address?.city
    ],
    barangay: [
      report.barangay, 
      report.personInvolved?.barangay, 
      report.location?.barangay,
      report.assignedPoliceStation?.address?.barangay,
      report.policeStation?.address?.barangay
    ],
    
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
          
          /* Enhanced print-specific styles for better visual hierarchy */
          .bg-gray-50 { background-color: #f9f9f9 !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-white { background-color: white !important; }
          .text-white { color: white !important; }
          .bg-blue-50 { background-color: #eff6ff !important; }
          .bg-blue-100 { background-color: #dbeafe !important; }
          .bg-green-50 { background-color: #f0fdf4 !important; }
          .bg-green-100 { background-color: #dcfce7 !important; }
          .bg-yellow-50 { background-color: #fefce8 !important; }
          .bg-yellow-100 { background-color: #fef3c7 !important; }
          .bg-red-50 { background-color: #fef2f2 !important; }
          .bg-purple-50 { background-color: #f5f3ff !important; }
          .bg-purple-100 { background-color: #e9d5ff !important; }
          .bg-orange-50 { background-color: #fff7ed !important; }
          .bg-orange-100 { background-color: #fed7aa !important; }
          
          /* Gradient support for print */
          .bg-gradient-to-r { background: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
          .bg-gradient-to-br { background: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important; }
          .from-gray-50 { --tw-gradient-from: #f9fafb; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
          .to-blue-50 { --tw-gradient-to: #eff6ff; }
          .from-blue-50 { --tw-gradient-from: #eff6ff; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
          .to-blue-100 { --tw-gradient-to: #dbeafe; }
          .from-green-50 { --tw-gradient-from: #f0fdf4; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, transparent); }
          .to-green-100 { --tw-gradient-to: #dcfce7; }
          
          /* Enhanced typography hierarchy */
          h1 { font-size: 20px !important; margin-bottom: 8px !important; line-height: 1.2 !important; }
          h2 { font-size: 16px !important; margin-bottom: 10px !important; line-height: 1.3 !important; }
          h3 { font-size: 12px !important; margin-bottom: 6px !important; line-height: 1.3 !important; }
          h4 { font-size: 10px !important; margin-bottom: 4px !important; line-height: 1.3 !important; }
          
          /* Visual elements */
          .border-l-4 { border-left-width: 4px !important; }
          .border-t-4 { border-top-width: 4px !important; }
          .border-b-2 { border-bottom-width: 2px !important; }
          .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
          .rounded-lg { border-radius: 8px !important; }
          .rounded-full { border-radius: 50% !important; }
          
          /* Print-specific fixes for alignment */
          .flex { display: block !important; }
          .flex-row { display: block !important; }
          .items-center { vertical-align: middle !important; }
          .justify-between { text-align: left !important; }
          .justify-center { text-align: center !important; }
          .gap-2 { margin: 0 !important; }
          .space-x-2 > * + * { margin-left: 0 !important; }
          .space-y-2 > * + * { margin-top: 8px !important; }
          
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
            gap: 8px !important; 
            margin-bottom: 12px !important;
          }
          
          .landscape-stat-box { 
            text-align: center !important; 
            padding: 8px 4px !important; 
            font-size: 8px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 60px !important;
          }
          
          .landscape-stat-number { 
            font-size: 18px !important; 
            font-weight: 700 !important; 
            display: block !important; 
            margin-bottom: 2px !important;
            line-height: 1 !important;
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
        {/* Enhanced Header Section with Better Information Architecture */}
        <div className="landscape-header" style={{ pageBreakAfter: "avoid", pageBreakInside: "avoid" }}>
          {/* Main Title with Visual Hierarchy */}
          <div className="text-center mb-4 space-y-2">
            <h1 className="text-3xl font-bold text-[#123F7B] mb-2 tracking-wide" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              🛡️ AGAPAY ALERT
            </h1>
            <div className="text-xl font-semibold text-gray-700 mb-8" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              Comprehensive Reports Dashboard
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-[#123F7B] to-[#7B9ACC] mx-auto rounded"></div>
          </div>
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4 bg-white rounded-lg p-3 border shadow-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="text-center">
              <div className="text-sm font-semibold text-[#123F7B]">📅 Generated</div>
              <div className="text-xs text-gray-600">{datePrinted}</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-sm font-semibold text-[#123F7B]">👤 Exported By</div>
              <div className="text-xs text-gray-600">{finalExportedBy}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-[#123F7B]">📊 Records</div>
              <div className="text-xs text-gray-600">{totalReportsCount} Reports</div>
            </div>
          </div>
          
          {/* Enhanced Applied Filters with Visual Indicators */}
          <div style={{ 
            background: "linear-gradient(to right, #f9fafb, #eff6ff)", 
            padding: "16px", 
            borderRadius: "8px", 
            borderLeft: "4px solid #123F7B",
            pageBreakInside: "avoid"
          }}>
            <h3 style={{ 
              fontWeight: "600", 
              fontSize: "14px", 
              marginBottom: "12px", 
              color: "#123F7B",
              fontFamily: "'Poppins', sans-serif"
            }}>
              🔍 Applied Filters & Scope
            </h3>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "24px", 
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px"
            }}>
              {/* Left Column */}
              <div style={{ 
                flex: "1", 
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  minHeight: "20px",
                  lineHeight: "1.2"
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    backgroundColor: "#123F7B", 
                    borderRadius: "50%", 
                    marginRight: "12px",
                    marginTop: "6px",
                    flexShrink: 0
                  }}></div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "6px",
                    width: "100%"
                  }}>
                    <strong style={{ color: "#123F7B", minWidth: "60px" }}>Status:</strong>
                    <span style={{ color: "#4B5563" }}>{getFilterLabel(filters?.status, "All Statuses")}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  minHeight: "20px",
                  lineHeight: "1.2"
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    backgroundColor: "#123F7B", 
                    borderRadius: "50%", 
                    marginRight: "12px",
                    marginTop: "6px",
                    flexShrink: 0
                  }}></div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "6px",
                    width: "100%"
                  }}>
                    <strong style={{ color: "#123F7B", minWidth: "60px" }}>Type:</strong>
                    <span style={{ color: "#4B5563" }}>{getFilterLabel(filters?.type, "All Types")}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  minHeight: "20px",
                  lineHeight: "1.2"
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    backgroundColor: "#123F7B", 
                    borderRadius: "50%", 
                    marginRight: "12px",
                    marginTop: "6px",
                    flexShrink: 0
                  }}></div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "6px",
                    width: "100%"
                  }}>
                    <strong style={{ color: "#123F7B", minWidth: "60px" }}>City:</strong>
                    <span style={{ color: "#4B5563" }}>{getFilterLabel(filters?.city, "All Cities")}</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div style={{ 
                flex: "1", 
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  minHeight: "20px",
                  lineHeight: "1.2"
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    backgroundColor: "#123F7B", 
                    borderRadius: "50%", 
                    marginRight: "12px",
                    marginTop: "6px",
                    flexShrink: 0
                  }}></div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "6px",
                    width: "100%"
                  }}>
                    <strong style={{ color: "#123F7B", minWidth: "80px" }}>Barangay:</strong>
                    <span style={{ color: "#4B5563" }}>{getFilterLabel(filters?.barangay, "All Barangays")}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  minHeight: "20px",
                  lineHeight: "1.2"
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    backgroundColor: "#123F7B", 
                    borderRadius: "50%", 
                    marginRight: "12px",
                    marginTop: "6px",
                    flexShrink: 0
                  }}></div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "6px",
                    width: "100%"
                  }}>
                    <strong style={{ color: "#123F7B", minWidth: "70px" }}>Gender:</strong>
                    <span style={{ color: "#4B5563" }}>{getFilterLabel(filters?.gender, "All Genders")}</span>
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "flex-start", 
                  minHeight: "20px",
                  lineHeight: "1.2"
                }}>
                  <div style={{ 
                    width: "8px", 
                    height: "8px", 
                    backgroundColor: "#123F7B", 
                    borderRadius: "50%", 
                    marginRight: "12px",
                    marginTop: "6px",
                    flexShrink: 0
                  }}></div>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "flex-start", 
                    gap: "6px",
                    width: "100%"
                  }}>
                    <strong style={{ color: "#123F7B", minWidth: "100px" }}>Date Range:</strong>
                    <span style={{ color: "#4B5563" }}>
                      {filters?.startDate && filters?.endDate ? 
                        `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}` : "All Dates"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Statistics - Landscape Optimized */}
        <div className="mb-4" style={{ pageBreakBefore: "auto", pageBreakAfter: "avoid", pageBreakInside: "avoid" }}>
          <h2 className="text-xl font-bold text-[#123F7B] mb-3 border-b-2 border-[#123F7B] pb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            📈 KEY PERFORMANCE METRICS
          </h2>
          
          {/* Primary Metrics Row */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(6, 1fr)", 
            gap: "8px", 
            marginBottom: "12px" 
          }}>
            <div style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px",
              background: "linear-gradient(to bottom right, #eff6ff, #dbeafe)",
              borderRadius: "8px",
              borderLeft: "4px solid #123F7B",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                display: "block", 
                marginBottom: "2px",
                lineHeight: "1",
                color: "#123F7B",
                fontFamily: "'Poppins', sans-serif"
              }}>{exportReports.length}</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", fontFamily: "'Poppins', sans-serif" }}>Total Reports</span>
              <div style={{ fontSize: "8px", color: "#6b7280", marginTop: "1px", fontFamily: "'Poppins', sans-serif" }}>📊 Dataset Size</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px",
              background: "linear-gradient(to bottom right, #f0fdf4, #dcfce7)",
              borderRadius: "8px",
              borderLeft: "4px solid #10b981",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                display: "block", 
                marginBottom: "2px",
                lineHeight: "1",
                color: "#059669",
                fontFamily: "'Poppins', sans-serif"
              }}>{resolvedReports}</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", fontFamily: "'Poppins', sans-serif" }}>Resolved</span>
              <div style={{ fontSize: "8px", color: "#6b7280", marginTop: "1px", fontFamily: "'Poppins', sans-serif" }}>✅ {totalReportsCount > 0 ? ((resolvedReports / totalReportsCount) * 100).toFixed(0) : 0}% Success</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px",
              background: "linear-gradient(to bottom right, #fefce8, #fef3c7)",
              borderRadius: "8px",
              borderLeft: "4px solid #eab308",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                display: "block", 
                marginBottom: "2px",
                lineHeight: "1",
                color: "#ca8a04",
                fontFamily: "'Poppins', sans-serif"
              }}>{pendingReports}</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", fontFamily: "'Poppins', sans-serif" }}>Pending</span>
              <div style={{ fontSize: "8px", color: "#6b7280", marginTop: "1px", fontFamily: "'Poppins', sans-serif" }}>⏳ Awaiting Action</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px",
              background: "linear-gradient(to bottom right, #eff6ff, #dbeafe)",
              borderRadius: "8px",
              borderLeft: "4px solid #3b82f6",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                display: "block", 
                marginBottom: "2px",
                lineHeight: "1",
                color: "#2563eb",
                fontFamily: "'Poppins', sans-serif"
              }}>{underInvestigation}</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", fontFamily: "'Poppins', sans-serif" }}>Under Investigation</span>
              <div style={{ fontSize: "8px", color: "#6b7280", marginTop: "1px", fontFamily: "'Poppins', sans-serif" }}>🔍 Active Cases</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px",
              background: "linear-gradient(to bottom right, #f5f3ff, #e9d5ff)",
              borderRadius: "8px",
              borderLeft: "4px solid #8b5cf6",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                display: "block", 
                marginBottom: "2px",
                lineHeight: "1",
                color: "#7c3aed",
                fontFamily: "'Poppins', sans-serif"
              }}>{assignedReports}</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", fontFamily: "'Poppins', sans-serif" }}>Assigned</span>
              <div style={{ fontSize: "8px", color: "#6b7280", marginTop: "1px", fontFamily: "'Poppins', sans-serif" }}>👮 Officers Assigned</div>
            </div>
            <div style={{
              textAlign: "center",
              padding: "8px 4px",
              fontSize: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60px",
              background: "linear-gradient(to bottom right, #fff7ed, #fed7aa)",
              borderRadius: "8px",
              borderLeft: "4px solid #f97316",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}>
              <span style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                display: "block", 
                marginBottom: "2px",
                lineHeight: "1",
                color: "#ea580c",
                fontFamily: "'Poppins', sans-serif"
              }}>{transferredReports}</span>
              <span style={{ fontSize: "10px", color: "#6b7280", fontWeight: "500", fontFamily: "'Poppins', sans-serif" }}>Transferred</span>
              <div style={{ fontSize: "8px", color: "#6b7280", marginTop: "1px", fontFamily: "'Poppins', sans-serif" }}>🔄 Jurisdiction Change</div>
            </div>
          </div>
          
          {/* Summary Analytics Row */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border">
            <h3 className="font-bold text-sm text-[#123F7B] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              📋 Report Distribution Summary
            </h3>
            <div className="grid grid-cols-4 gap-4 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="text-center">
                <div className="font-bold text-lg text-[#123F7B]">{totalCities}</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-[#123F7B]">{totalBarangays}</div>
                <div className="text-gray-600">Barangays</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-[#123F7B]">{Object.keys(typeCounts).length}</div>
                <div className="text-gray-600">Report Types</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-[#123F7B]">{Object.keys(statusCounts).length}</div>
                <div className="text-gray-600">Status Categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Distribution - Enhanced with Visual Elements */}
        <div className="mb-4" style={{ pageBreakBefore: "auto", pageBreakAfter: "avoid", pageBreakInside: "avoid" }}>
          <h2 className="text-xl font-bold text-[#123F7B] mb-3 border-b-2 border-[#123F7B] pb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
            📊 DATA DISTRIBUTION & INSIGHTS
          </h2>
          <div className="landscape-chart">
            {/* Enhanced Status Distribution */}
            <div className="bg-gray-50 p-3 rounded-lg border">
              <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                🔄 Status Breakdown
                <span className="text-xs font-normal text-gray-500"> ({Object.values(statusCounts).reduce((a, b) => a + b, 0)} total)</span>
              </h3>
              <div className="space-y-2">
                {Object.entries(statusCounts)
                  .sort(([,a], [,b]) => b - a) // Sort by count descending
                  .map(([status, count]) => {
                    const percentage = ((count / totalReportsCount) * 100).toFixed(1);
                    return (
                      <div key={status} className="bg-white px-3 py-2 rounded border shadow-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className={`${
                            ['Found', 'Resolved', 'Closed'].includes(status) ? 'bg-green-500' :
                            status === 'Pending' ? 'bg-yellow-500' :
                            ['Under Investigation', 'Investigating'].includes(status) ? 'bg-blue-500' :
                            status === 'Assigned' ? 'bg-purple-500' :
                            status === 'Transferred' ? 'bg-orange-500' : 'bg-gray-500'
                          }`} style={{ width: "12px", height: "12px", borderRadius: "50%", marginRight: "8px" }}></div>
                          <span className="font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{status}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="text-xs text-gray-600" style={{ fontFamily: "'Poppins', sans-serif", marginRight: "8px" }}>{percentage}%</span>
                          <span className="bg-[#123F7B] text-white px-2 py-1 rounded text-xs font-bold" style={{ 
                            fontFamily: "'Poppins', sans-serif",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "24px",
                            minHeight: "20px",
                            lineHeight: "1",
                            textAlign: "center"
                          }}>{count}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Enhanced Geographic Distribution */}
            <div className="bg-gray-50 p-3 rounded-lg border">
              <h3 className="font-bold mb-3 text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                🏙️ Geographic Hotspots
                <span className="text-xs font-normal text-gray-500"> ({totalCities} cities, {totalBarangays} barangays)</span>
              </h3>
              <div className="space-y-2">
                {topCities.map(([city, count], index) => {
                  const percentage = ((count / totalReportsCount) * 100).toFixed(1);
                  return (
                    <div key={city} className="bg-white px-3 py-2 rounded border shadow-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className={`text-xs font-bold text-white ${
                          index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : index === 2 ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "8px" }}>
                          {index + 1}
                        </span>
                        <span className="font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{city}</span>
                      </div>                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="text-xs text-gray-600" style={{ fontFamily: "'Poppins', sans-serif", marginRight: "8px" }}>{percentage}%</span>
                          <span className="bg-[#123F7B] text-white px-2 py-1 rounded text-xs font-bold" style={{ 
                            fontFamily: "'Poppins', sans-serif", 
                            display: "inline-flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            minWidth: "24px",
                            textAlign: "center"
                          }}>{count}</span>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Quick Insights Panel */}
          <div className="mt-3 bg-blue-50 border-l-4 border-[#123F7B] p-3 rounded-r-lg">
            <h4 className="font-bold text-sm text-[#123F7B] mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              💡 Key Insights
            </h4>
            <div className="grid grid-cols-3 gap-4 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div>
                <strong>Resolution Rate:</strong> {totalReportsCount > 0 ? ((resolvedReports / totalReportsCount) * 100).toFixed(1) : 0}%
              </div>
              <div>
                <strong>Most Active City:</strong> {topCities[0]?.[0] || 'N/A'}
              </div>
              <div>
                <strong>Primary Status:</strong> {Object.entries(statusCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
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
              📋 DETAILED REPORTS TABLE {tablePages.length > 1 ? `(Page ${pageIndex + 1} of ${tablePages.length})` : ''}
              <span className="text-sm font-normal text-gray-600" style={{ fontFamily: "'Poppins', sans-serif", float: "right" }}>
                Records {(pageIndex * rowsPerPage) + 1} - {Math.min((pageIndex + 1) * rowsPerPage, totalReportsCount)} of {totalReportsCount}
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

        {/* Enhanced Export Summary with Analytics */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-t-4 border-[#123F7B] p-4 shadow-sm" style={{ pageBreakBefore: "avoid", pageBreakInside: "avoid" }}>
          <h3 className="font-bold text-lg mb-3 text-[#123F7B]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            📊 Export Summary & Analytics
          </h3>
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#123F7B] border-b border-gray-300 pb-1">📈 Report Metrics</h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Total Records:</span>
                  <strong className="text-[#123F7B]">{totalReportsCount}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Resolution Rate:</span>
                  <strong className={`${((resolvedReports / totalReportsCount) * 100) >= 70 ? 'text-green-600' : 'text-orange-600'}`}>
                    {totalReportsCount > 0 ? ((resolvedReports / totalReportsCount) * 100).toFixed(1) : 0}%
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Pending Cases:</span>
                  <strong className="text-yellow-600">{pendingReports}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Active Investigations:</span>
                  <strong className="text-blue-600">{underInvestigation}</strong>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-[#123F7B] border-b border-gray-300 pb-1">🗂️ Document Info</h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Pages Generated:</span>
                  <strong className="text-[#123F7B]">{tablePages.length + 2}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Export Date:</span>
                  <strong className="text-[#123F7B]">{datePrinted}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Geographic Coverage:</span>
                  <strong className="text-[#123F7B]">{totalCities} cities</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Report Types:</span>
                  <strong className="text-[#123F7B]">{Object.keys(typeCounts).length}</strong>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Distribution Bar */}
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-[#123F7B] mb-2">Status Distribution Overview</h4>
            <div className="flex rounded-lg overflow-hidden border h-6" style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc", height: "24px" }}>
              {Object.entries(statusCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([status, count]) => {
                  const percentage = (count / totalReportsCount) * 100;
                  return (
                    <div
                      key={status}
                      className={`text-xs font-medium text-white ${
                        ['Found', 'Resolved', 'Closed'].includes(status) ? 'bg-green-500' :
                        status === 'Pending' ? 'bg-yellow-500' :
                        ['Under Investigation', 'Investigating'].includes(status) ? 'bg-blue-500' :
                        status === 'Assigned' ? 'bg-purple-500' :
                        status === 'Transferred' ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ 
                        width: `${percentage}%`, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "500",
                        color: "white",
                        backgroundColor: 
                          ['Found', 'Resolved', 'Closed'].includes(status) ? '#10b981' :
                          status === 'Pending' ? '#eab308' :
                          ['Under Investigation', 'Investigating'].includes(status) ? '#3b82f6' :
                          status === 'Assigned' ? '#8b5cf6' :
                          status === 'Transferred' ? '#f97316' : '#6b7280'
                      }}
                      title={`${status}: ${count} (${percentage.toFixed(1)}%)`}
                    >
                      {percentage >= 8 ? `${percentage.toFixed(0)}%` : ''}
                    </div>
                  );
                })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6b7280", marginTop: "4px", fontFamily: "'Poppins', sans-serif" }} className="text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Footer with Better Branding */}
        <div className="mt-8 pt-4 border-t-2 border-[#123F7B] text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="bg-gradient-to-r from-[#123F7B] to-[#7B9ACC] text-white p-3 rounded-lg">
            <div className="mb-2" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="text-lg" style={{ marginRight: "8px" }}>🛡️</span>
              <p className="text-sm font-semibold">AGAPAY ALERT - Official Document</p>
            </div>
            <div className="text-xs opacity-90">
              <p>This comprehensive report was generated for official law enforcement use only.</p>
              <p className="mt-1">© {new Date().getFullYear()} AGAPAY ALERT System - All rights reserved | Confidential</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ComprehensiveReportsExportView.displayName = "ComprehensiveReportsExportView";

export default ComprehensiveReportsExportView;
