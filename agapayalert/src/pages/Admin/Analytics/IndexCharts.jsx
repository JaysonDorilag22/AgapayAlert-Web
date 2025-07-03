import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "@/layouts/AdminLayout";
import { Bar, Pie, Line, Scatter } from "react-chartjs-2";
import HotspotMap from "./HotspotMap";
import AnalyticsExportPDFView from "@/components/AnalyticsExportPDFView";
import {
  getUserDemographics,
} from "@/redux/actions/dashboardActions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import html2pdf from "html2pdf.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// --- Chart Color Palettes ---
// Accessible, sequential, and highlight-friendly palette
const CHART_BASE_COLOR = "#7B9ACC"; // blue for main data
const CHART_HIGHLIGHT_COLOR = "#123F7B"; // dark blue for highlight
const CHART_NEGATIVE_COLOR = "#D46A79"; // red for negative/alert
const CHART_NEUTRAL_COLOR = "#BEE3F8"; // light blue/grey for background/other
const CHART_GREY_SCALE = [
  "#E5E7EB", // lightest
  "#D1D5DB",
  "#9CA3AF",
  "#6B7280",
  "#374151", // darkest
];

// --- Pie Chart Color Palette ---
// Use a set of high-contrast, color-blind friendly colors for pie charts
const PIE_COLORS = [
  "#7B9ACC", // blue
  "#123F7B", // dark blue
  "#D46A79", // red
  "#FBB13C", // orange
  "#3CAEA3", // teal
  "#ED553B", // coral
  "#20639B", // navy
  "#F6D55C", // yellow
  "#173F5F", // deep blue
  "#A1C349", // green
  "#FF6F61", // salmon
  "#B4656F", // mauve
  "#6B5B95", // purple
  "#FFA500", // vivid orange
  "#2E8B57", // sea green
];

// --- Dashboard Card ---
const DashboardCard = ({ title, value, icon, color, subtext }) => (
  <div
    className={`flex flex-col items-start justify-between bg-white rounded-xl shadow p-4 min-w-[180px] min-h-[110px] border-l-8 ${color}`}
    style={{ borderColor: color }}
  >
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-lg font-semibold text-[#123F7B]">{title}</span>
    </div>
    <div className="text-3xl font-bold text-[#123F7B]">{value}</div>
    {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
  </div>
);

// --- Advanced Filters ---
const AGE_CATEGORY_MAP = [
  { key: "infant", label: "Infant (0-2)" },
  { key: "child", label: "Child (3-12)" },
  { key: "teen", label: "Teen (13-19)" },
  { key: "young_adult", label: "Young Adult (20-35)" },
  { key: "adult", label: "Adult (36-59)" },
  { key: "senior", label: "Senior (60+)" },
];

const AdvancedFilters = ({ filters, setFilters, available, charts, user, userRole }) => {
  // Role-based access control
  const isPoliceOfficer = userRole === 'police_officer';
  const isPoliceAdmin = userRole === 'police_admin';
  const isSuperAdmin = userRole === 'super_admin';
  
  // Use backend chart labels for dynamic filter options
  const genders = charts?.byGender?.labels || [];
  const reportTypes = charts?.byReportType?.labels || [];
  const cities = charts?.byCity?.labels || [];

  // Count active filters for visual feedback (excluding role-based locked filters)
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (value === undefined || value === "" || value === null) {
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
  }).length;

  // Clear all filters (but maintain role-based restrictions)
  const handleClearFilters = () => {
    let baseFilters = {};
    
    if (isPoliceAdmin && user?.city) {
      // Police Admin: maintain city restriction
      baseFilters.city = user.city;
    } else if (isPoliceOfficer && user?._id) {
      // Police Officer: maintain officer assignment restriction
      baseFilters.assignedOfficerId = user._id;
    }
    
    setFilters(baseFilters);
  };

  // Validate date range
  const handleDateChange = (field, value) => {
    const newFilters = { ...filters, [field]: value || undefined };
    
    // Validate date range
    if (newFilters.startDate && newFilters.endDate) {
      const start = new Date(newFilters.startDate);
      const end = new Date(newFilters.endDate);
      if (start > end) {
        // If start date is after end date, clear the conflicting date
        if (field === 'startDate') {
          newFilters.endDate = undefined;
        } else {
          newFilters.startDate = undefined;
        }
      }
    }
    
    setFilters(newFilters);
  };

  // Handle filter changes with role-based restrictions
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value || undefined };
    
    // Apply role-based restrictions
    if (isPoliceAdmin && user?.city) {
      // Police Admin: cannot change city filter
      newFilters.city = user.city;
    } else if (isPoliceOfficer && user?._id) {
      // Police Officer: cannot change officer assignment
      newFilters.assignedOfficerId = user._id;
    }
    
    setFilters(newFilters);
  };

  // Helper to get input classes with active state
  const getInputClasses = (hasValue, isLocked = false) => 
    `rounded border px-2 py-1 text-sm transition-colors ${
      isLocked 
        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 cursor-not-allowed'
        : hasValue 
          ? 'border-[#123F7B] bg-blue-50 font-medium' 
          : 'border-gray-300 hover:border-[#123F7B]'
    }`;

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow border">
      {/* Header with title and clear button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#123F7B]">🔍 Advanced Filters</h3>
          {/* Role-based access indicator */}
          {isPoliceOfficer && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              Your Data Only
            </span>
          )}
          {isPoliceAdmin && user?.city && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {user.city} City
            </span>
          )}
          {activeFilterCount > 0 && (
            <span className="bg-[#123F7B] text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-[#D46A79] hover:text-red-700 font-medium transition-colors"
          >
            {isPoliceAdmin || isPoliceOfficer ? 'Clear User Filters' : 'Clear All Filters'}
          </button>
        )}
      </div>

      {/* Role-based access information */}
      {(isPoliceAdmin || isPoliceOfficer) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              {isPoliceOfficer && (
                <p>You can only view analytics for data assigned to you. Some filters may be restricted.</p>
              )}
              {isPoliceAdmin && user?.city && (
                <p>You can only view analytics for <strong>{user.city}</strong>. The city filter is automatically set and cannot be changed.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Demographics Group */}
        <div className="space-y-4 md:col-span-2 lg:col-span-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Demographics</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Age Category */}
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                Age Category
              </label>
              <select
                className={getInputClasses(filters.ageCategory)}
                value={filters.ageCategory || ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    ageCategory: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All Ages</option>
                {AGE_CATEGORY_MAP.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                Gender
              </label>
              <select
                className={getInputClasses(filters.gender)}
                value={filters.gender || ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    gender: e.target.value || undefined,
                  }))
                }
                disabled={genders.length === 0}
              >
                <option value="">All Genders</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {genders.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Date Range Group */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Date Range</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                From Date
              </label>
              <input
                type="date"
                className={getInputClasses(filters.startDate)}
                value={filters.startDate || ""}
                max={filters.endDate || undefined}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                To Date
              </label>
              <input
                type="date"
                className={getInputClasses(filters.endDate)}
                value={filters.endDate || ""}
                min={filters.startDate || undefined}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Location Group */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Location</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                  City
                </label>
                {isPoliceAdmin && user?.city && (
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    🔒 Locked to {user.city}
                  </span>
                )}
              </div>
              
              {isPoliceAdmin && user?.city ? (
                // Police Admin: Show locked city filter
                <div className="mt-1">
                  <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{user.city}</span>
                      <span className="text-xs opacity-75">(automatically applied)</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Super Admin: Show normal city filter
                <select
                  className={getInputClasses(filters.city)}
                  value={filters.city || ""}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  disabled={cities.length === 0}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              )}
              {cities.length === 0 && !isPoliceAdmin && (
                <p className="text-xs text-gray-400 mt-1">No data available</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                Barangay
              </label>
              <input
                type="text"
                className={getInputClasses(filters.barangay)}
                placeholder="Enter barangay name"
                value={filters.barangay || ""}
                onChange={(e) => handleFilterChange('barangay', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Report & Police Group */}
        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Report & Police</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                Report Type
              </label>
              <select
                className={getInputClasses(filters.reportType)}
                value={filters.reportType || ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    reportType: e.target.value || undefined,
                  }))
                }
                disabled={reportTypes.length === 0}
              >
                <option value="">All Types</option>
                {reportTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {reportTypes.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">No data available</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#123F7B] mb-1">
                Police Station ID
              </label>
              <input
                type="text"
                className={getInputClasses(filters.policeStationId)}
                placeholder="Enter station ID"
                value={filters.policeStationId || ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    policeStationId: e.target.value || undefined,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IndexCharts = () => {
  const dispatch = useDispatch();
  const analyticsRef = useRef();
  const exportRef = useRef();
  const roleArr = useSelector((state) => state.auth.user?.roles);
  const role = Array.isArray(roleArr) ? roleArr[0] : roleArr || "user";
  const userDemographics = useSelector((state) => state.dashboard.userDemographics);
  const user = useSelector((state) => state.auth.user);
  
  // Role-based access control
  const userRole = user?.roles?.[0]; // Get first role from roles array
  const isPoliceOfficer = userRole === 'police_officer';
  const isPoliceAdmin = userRole === 'police_admin';
  const isSuperAdmin = userRole === 'super_admin';
  
  // Initialize filters with role-based defaults
  const getInitialFilters = () => {
    const baseFilters = {};
    
    if (isPoliceAdmin && user?.city) {
      // Police Admin: locked to their city
      return { ...baseFilters, city: user.city };
    } else if (isPoliceOfficer && user?._id) {
      // Police Officer: only their own data
      return { ...baseFilters, assignedOfficerId: user._id };
    }
    
    return baseFilters;
  };
  
  const [demographicsFilters, setDemographicsFilters] = useState(() => getInitialFilters());
  const [demographicsLoading, setDemographicsLoading] = useState(false);
  const exportedBy = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : role;

  console.log('=== Analytics Debug ===');
  console.log('- Role:', role);
  console.log('- User role:', userRole);
  console.log('- User city:', user?.city);
  console.log('- Is Police Admin:', isPoliceAdmin);
  console.log('- Is Police Officer:', isPoliceOfficer);
  console.log('- Initial filters:', demographicsFilters);

  // --- Data Preparation ---
  function getPieBarData(chart, highlightIndex = null, isPie = false) {
    if (!chart) return { labels: [], datasets: [] };
    // Use PIE_COLORS for both pie and bar charts in composition section
    const baseColors = chart.labels.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]);
    return {
      labels: chart.labels,
      datasets: [
        {
          label: "Reports",
          data: chart.values,
          backgroundColor: baseColors,
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    };
  }
  function getMonthlyLineData(monthlyTrend, highlightIndex = null) {
    if (!monthlyTrend) return { labels: [], datasets: [] };
    // Highlight the last point if needed
    const pointColors = monthlyTrend.labels.map((_, i) =>
      highlightIndex !== null && i === highlightIndex
        ? CHART_HIGHLIGHT_COLOR
        : CHART_BASE_COLOR
    );
    return {
      labels: monthlyTrend.labels,
      datasets: [
        {
          label: "Reports per Month",
          data: monthlyTrend.values,
          fill: false,
          borderColor: CHART_BASE_COLOR,
          backgroundColor: CHART_NEUTRAL_COLOR,
          tension: 0.4,
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }
  const charts = userDemographics?.charts || {};
  // Highlight the max value in typeData and the last point in monthlyData
  const typeHighlight = charts.byReportType?.values
    ? charts.byReportType.values.indexOf(Math.max(...charts.byReportType.values))
    : null;
  const monthlyHighlight = charts.monthlyTrend?.values
    ? charts.monthlyTrend.values.length - 1
    : null;
  const typeData = getPieBarData(charts.byReportType, null, true); // use PIE_COLORS for bar in composition
  const statusData = getPieBarData(charts.byStatus, null, true); // use PIE_COLORS for pie
  const monthlyData = getMonthlyLineData(charts.monthlyTrend, monthlyHighlight);

  // Debug: Log all relevant data for troubleshooting
  console.log('userDemographics:', userDemographics);
  

  useEffect(() => {
    // Don't fetch if user data is not yet loaded
    if (!user || !user.roles || !userRole) {
      console.log('⏳ User data not yet loaded, skipping analytics fetch...');
      return;
    }
    
    // Apply role-based filtering before dispatching
    const fetchDemographics = async () => {
      setDemographicsLoading(true);
      
      // Apply role-based restrictions to analytics filters
      let roleBasedFilters = { ...demographicsFilters };
      
      if (isPoliceAdmin && user?.city) {
        // Police Admin: ensure city is always set to their city
        roleBasedFilters.city = user.city;
        console.log('🔒 Police Admin detected - forcing city filter to:', user.city);
      } else if (isPoliceOfficer && user?._id) {
        // Police Officer: ensure only their data is fetched
        roleBasedFilters.assignedOfficerId = user._id;
        console.log('🔒 Police Officer detected - forcing assignedOfficerId filter to:', user._id);
      }
      
      console.log('📋 Final analytics filters being sent to API:', roleBasedFilters);
      
      await dispatch(getUserDemographics(roleBasedFilters));
      setDemographicsLoading(false);
    };
    fetchDemographics();
  }, [dispatch, demographicsFilters, userRole, user?.city, user?._id, user]);

  // --- Export Handlers ---
  const handleExportAnalyticsPDF = () => {
    if (!exportRef.current) return;
    html2pdf()
      .from(exportRef.current)
      .set({
        margin: 0.5,
        filename: "analytics-export.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }, // <-- set to portrait
      })
      .save();
  };

  // --- Section 1: Summary Panel ---
  const summary = userDemographics?.summary || {};
  const summaryCards = [
    {
      title: "Total Reports",
      value: summary.overview?.totalReports ?? "-",
      icon: "📊",
      color: "border-[#123F7B]",
    },
    {
      title: "Trend",
      value: summary.overview?.trendDirection ?? "-",
      icon: "📈",
      color: "border-[#A3BFFA]",
      subtext: summary.overview?.trend || "",
    },
    {
      title: "Avg. Resolution Time",
      value: summary.overview?.avgResolutionTime
        ? `${summary.overview.avgResolutionTime} hrs`
        : "-",
      icon: "⏱️",
      color: "border-[#BEE3F8]",
    },
    {
      title: "Most Common Type",
      value: summary.mostCommonType?.label || "-",
      icon: "📄",
      color: "border-[#FBB6CE]",
    },
    {
      title: "Unresolved %",
      value: summary.unresolvedPercent ? `${summary.unresolvedPercent}%` : "-",
      icon: "❗",
      color: "border-[#D46A79]",
    },
    (role === "super_admin" || role === "police_admin") && summary.topBarangays?.length
      ? {
          title: "Top Barangay",
          value: summary.topBarangays[0]?.label || "-",
          icon: "🏘️",
          color: "border-[#7B9ACC]",
        }
      : null,
  ].filter(Boolean);

  // --- Section 2: Trends ---
  const getTrendChartOptions = (title, showLegend = true) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: CHART_HIGHLIGHT_COLOR,
        font: { size: 14, weight: "bold" },
        padding: { bottom: 20 }
      },
      legend: {
        display: showLegend,
        labels: { 
          color: CHART_HIGHLIGHT_COLOR, 
          font: { weight: "bold" },
          usePointStyle: true,
          padding: 15
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: CHART_HIGHLIGHT_COLOR,
        bodyColor: '#374151',
        borderColor: CHART_HIGHLIGHT_COLOR,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: { 
        ticks: { color: CHART_HIGHLIGHT_COLOR },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: {
          display: true,
          text: 'Time Period',
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold' }
        }
      },
      y: { 
        ticks: { color: CHART_HIGHLIGHT_COLOR },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: {
          display: true,
          text: 'Number of Reports',
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold' }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  });

  const getBarChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: CHART_HIGHLIGHT_COLOR,
        font: { size: 14, weight: "bold" },
        padding: { bottom: 20 }
      },
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: CHART_HIGHLIGHT_COLOR,
        bodyColor: '#374151',
        borderColor: CHART_HIGHLIGHT_COLOR,
        borderWidth: 1,
        cornerRadius: 8
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: CHART_HIGHLIGHT_COLOR,
        font: { weight: 'bold', size: 10 }
      }
    },
    scales: {
      x: { 
        ticks: { color: CHART_HIGHLIGHT_COLOR },
        grid: { display: false },
        title: {
          display: true,
          text: 'Report Type',
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold' }
        }
      },
      y: { 
        ticks: { color: CHART_HIGHLIGHT_COLOR },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: {
          display: true,
          text: 'Count',
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold' }
        }
      },
    }
  });

  const EmptyState = ({ message, icon = "📊" }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
      <p className="text-sm text-gray-400 max-w-sm">{message}</p>
    </div>
  );

  const hasMonthlyData = monthlyData.labels && monthlyData.labels.length > 0 && 
                        monthlyData.datasets && monthlyData.datasets[0] && 
                        monthlyData.datasets[0].data.length > 0;
  const hasTypeData = typeData.labels && typeData.labels.length > 0;

  const trendsSection = (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#123F7B]">📈 Report Trends</h2>
        <div className="text-xs text-gray-500">
          {hasMonthlyData ? `${monthlyData.labels.length} months of data` : 'No data period'}
        </div>
      </div>
      
      {(role === "super_admin" || role === "police_admin") && (
        <div className="space-y-8">
          {/* Monthly Trend Chart */}
          <div className="border rounded-lg p-4 bg-gray-50/50">
            <div className="h-80">
              {hasMonthlyData ? (
                <Line
                  data={monthlyData}
                  options={getTrendChartOptions("Monthly Report Trends", true)}
                />
              ) : (
                <EmptyState 
                  message="No monthly trend data available for the selected filters. Try adjusting your date range or removing some filters."
                  icon="📈"
                />
              )}
            </div>
          </div>
          
          {/* Report Type Distribution */}
          <div className="border rounded-lg p-4 bg-gray-50/50">
            <div className="h-80">
              {hasTypeData ? (
                <Bar
                  data={typeData}
                  options={getBarChartOptions("Report Type Distribution")}
                />
              ) : (
                <EmptyState 
                  message="No report type data available. This could indicate no reports match your current filters."
                  icon="📊"
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {role === "police_officer" && (
        <div className="border rounded-lg p-4 bg-gray-50/50">
          <div className="h-80">
            {hasMonthlyData ? (
              <Line
                data={monthlyData}
                options={getTrendChartOptions("Your Department's Monthly Trends", true)}
              />
            ) : (
              <EmptyState 
                message="No trend data available for your department. Reports may not have been filed recently or may not match your current filters."
                icon="📈"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Data Insights Panel */}
      {(hasMonthlyData || hasTypeData) && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-[#123F7B]">
          <h4 className="font-semibold text-[#123F7B] mb-2">📊 Key Insights</h4>
          <div className="text-sm text-gray-700 space-y-1">
            {hasMonthlyData && (
              <p>• Peak reporting period: {monthlyData.labels[monthlyData.datasets[0].data.indexOf(Math.max(...monthlyData.datasets[0].data))]}</p>
            )}
            {hasTypeData && typeData.labels.length > 0 && (
              <p>• Most common report type: {typeData.labels[typeData.datasets[0].data.indexOf(Math.max(...typeData.datasets[0].data))]}</p>
            )}
            {hasMonthlyData && (
              <p>• Total reports in period: {monthlyData.datasets[0].data.reduce((a, b) => a + b, 0)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // --- Section 3: Composition ---
  const getPieChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        color: CHART_HIGHLIGHT_COLOR,
        font: { size: 14, weight: "bold" },
        padding: { bottom: 20 }
      },
      legend: {
        position: 'bottom',
        labels: { 
          color: CHART_HIGHLIGHT_COLOR, 
          font: { weight: "bold" },
          usePointStyle: true,
          padding: 15,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label}: ${percentage}%`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor || '#fff',
                  lineWidth: 1,
                  pointStyle: 'circle'
                };
              });
            }
            return [];
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: CHART_HIGHLIGHT_COLOR,
        bodyColor: '#374151',
        borderColor: CHART_HIGHLIGHT_COLOR,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  });

  const getHorizontalBarOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      title: {
        display: true,
        text: title,
        color: CHART_HIGHLIGHT_COLOR,
        font: { size: 14, weight: "bold" },
        padding: { bottom: 20 }
      },
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: CHART_HIGHLIGHT_COLOR,
        bodyColor: '#374151',
        borderColor: CHART_HIGHLIGHT_COLOR,
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: { 
        ticks: { color: CHART_HIGHLIGHT_COLOR },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: {
          display: true,
          text: 'Count',
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold' }
        }
      },
      y: { 
        ticks: { color: CHART_HIGHLIGHT_COLOR },
        grid: { display: false }
      },
    }
  });

  const hasStatusData = statusData.labels && statusData.labels.length > 0;

  const compositionSection = (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#123F7B]">🧩 Report Composition</h2>
        <div className="text-xs text-gray-500">
          Distribution analysis
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution Pie Chart */}
        <div className="border rounded-lg p-4 bg-gray-50/50">
          <div className="h-80">
            {hasStatusData ? (
              <Pie
                data={statusData}
                options={getPieChartOptions("Report Status Distribution")}
              />
            ) : (
              <EmptyState 
                message="No status data available. This might indicate that reports haven't been processed yet or don't match current filters."
                icon="🥧"
              />
            )}
          </div>
        </div>
        
        {/* Type Distribution Horizontal Bar */}
        <div className="border rounded-lg p-4 bg-gray-50/50">
          <div className="h-80">
            {hasTypeData ? (
              <Bar
                data={typeData}
                options={getHorizontalBarOptions("Report Types Breakdown")}
              />
            ) : (
              <EmptyState 
                message="No report type breakdown available. Try adjusting your filters or check if reports have been categorized."
                icon="📊"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      {(hasStatusData || hasTypeData) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasStatusData && (
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-700 mb-2">📊 Status Summary</h4>
              <div className="text-sm text-green-600">
                <p>Total categories: {statusData.labels.length}</p>
                <p>Most common: {statusData.labels[statusData.datasets[0].data.indexOf(Math.max(...statusData.datasets[0].data))]}</p>
              </div>
            </div>
          )}
          {hasTypeData && (
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-700 mb-2">📋 Type Summary</h4>
              <div className="text-sm text-purple-600">
                <p>Total types: {typeData.labels.length}</p>
                <p>Highest volume: {typeData.labels[typeData.datasets[0].data.indexOf(Math.max(...typeData.datasets[0].data))]}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // --- Section 4: Geolocation ---
  const geolocationSection = (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-[#123F7B] mb-4">Geolocation Insights</h2>
      <HotspotMap />
    </div>
  );

  // --- Section 5: Relationships ---
  // Enhanced scatter plot for Age Category vs Resolution Time
  const ageCategoryScatterData = charts.ageCategoryVsResolutionTimeScatter;
  const hasScatterData = ageCategoryScatterData?.datasets?.[0]?.data?.length > 0;
  
  const scatterData = hasScatterData
    ? {
        datasets: [
          {
            label: "Age Category vs. Resolution Time",
            data: ageCategoryScatterData.datasets[0].data || [],
            backgroundColor: CHART_HIGHLIGHT_COLOR,
            borderColor: CHART_HIGHLIGHT_COLOR,
            pointRadius: 8,
            pointHoverRadius: 12,
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            pointBackgroundColor: CHART_HIGHLIGHT_COLOR,
          },
        ],
      }
    : { datasets: [] };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Relationship: Age Category vs. Resolution Time",
        color: CHART_HIGHLIGHT_COLOR,
        font: { size: 16, weight: "bold" },
        padding: { bottom: 30 }
      },
      legend: { 
        display: true,
        position: 'top',
        labels: { 
          color: CHART_HIGHLIGHT_COLOR, 
          font: { weight: "bold" },
          usePointStyle: true,
          padding: 20
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: CHART_HIGHLIGHT_COLOR,
        bodyColor: '#374151',
        borderColor: CHART_HIGHLIGHT_COLOR,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (ctx) => {
            const xValue = ctx[0].parsed.x;
            const labels = ageCategoryScatterData?.labels || [];
            return labels[xValue - 1] || `Age Category ${xValue}`;
          },
          label: (ctx) => [
            `Resolution Time: ${ctx.parsed.y} hours`,
            `Data Point: ${ctx.dataIndex + 1} of ${ctx.dataset.data.length}`
          ],
          afterLabel: (ctx) => {
            // Add correlation insight
            if (ctx.dataIndex === 0) {
              return '\n💡 Hover over points to see patterns';
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        type: "linear",
        min: 0.5,
        max: 6.5,
        title: {
          display: true,
          text: ageCategoryScatterData?.xAxis?.label || "Age Category",
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold', size: 12 }
        },
        ticks: {
          callback: function (value) {
            const labels = ageCategoryScatterData?.labels || [];
            return labels[value - 1] || '';
          },
          color: CHART_HIGHLIGHT_COLOR,
          stepSize: 1,
          font: { size: 10 }
        },
        grid: { 
          color: 'rgba(0,0,0,0.1)',
          lineWidth: 1
        }
      },
      y: {
        title: {
          display: true,
          text: ageCategoryScatterData?.yAxis?.label || "Resolution Time (hours)",
          color: CHART_HIGHLIGHT_COLOR,
          font: { weight: 'bold', size: 12 }
        },
        ticks: { 
          color: CHART_HIGHLIGHT_COLOR,
          callback: function(value) {
            return value + 'h';
          }
        },
        grid: { 
          color: 'rgba(0,0,0,0.1)',
          lineWidth: 1
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'point'
    }
  };

  const relationshipsSection =
    (role === "super_admin" || role === "police_admin") && (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#123F7B]">🔗 Relationships & Distribution</h2>
          <div className="text-xs text-gray-500">
            {hasScatterData ? `${ageCategoryScatterData.datasets[0].data.length} data points` : 'No correlation data'}
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50/50">
          <div className="h-96">
            {hasScatterData ? (
              <Scatter data={scatterData} options={scatterOptions} />
            ) : (
              <EmptyState 
                message="No correlation data available between age categories and resolution times. This analysis requires sufficient historical data with both age and resolution information."
                icon="🔗"
              />
            )}
          </div>
        </div>
        
        {/* Correlation Insights */}
        {hasScatterData && (
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-700 mb-2">🧠 Correlation Insights</h4>
            <div className="text-sm text-indigo-600 space-y-1">
              <p>• Each point represents a report case with its age category and resolution time</p>
              <p>• Look for patterns: Do certain age groups tend to have faster/slower resolutions?</p>
              <p>• Clusters may indicate systematic processing differences</p>
              <p>• Total data points analyzed: {ageCategoryScatterData.datasets[0].data.length}</p>
            </div>
          </div>
        )}
      </div>
    );

  // --- Export Data for PDF ---
  const summaryExport = { cards: summaryCards };
  const trendsExport = {
    line: monthlyData.labels.length
      ? { data: monthlyData, options: { responsive: false } }
      : null,
    bar: typeData.labels.length
      ? { data: typeData, options: { responsive: false } }
      : null,
  };
  const compositionExport = {
    pie: statusData.labels.length
      ? { data: statusData, options: { responsive: false } }
      : null,
    stackedBar: typeData.labels.length
      ? { data: typeData, options: { responsive: false, indexAxis: "y" } }
      : null,
  };
  const filtersExport = demographicsFilters;
  const filters = userDemographics?.filters?.appliedFilters || {};

  // --- Main Render ---
  return (
    <AdminLayout>
      <div className="flex flex-row mb-4 space-x-2">
        <button
          onClick={handleExportAnalyticsPDF}
          className="bg-[#7B9ACC] text-white px-4 py-2 rounded shadow font-semibold"
        >
          Export Analytics (Full) as PDF
        </button>
      </div>
      <AdvancedFilters
        filters={demographicsFilters}
        setFilters={setDemographicsFilters}
        available={userDemographics?.filters?.availableCategories || {}}
        charts={charts}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((card, idx) => (
          <DashboardCard key={idx} {...card} />
        ))}
      </div>
      {trendsSection}
      {compositionSection}
      {geolocationSection}
      {relationshipsSection}
      {/* Hidden export view for PDF generation */}
      <div style={{ display: "none" }}>
        <AnalyticsExportPDFView
          ref={exportRef}
          summary={summary}
          exportedBy={exportedBy}
          filters={filters}
        />
      </div>
    </AdminLayout>
  );
};

export default IndexCharts;