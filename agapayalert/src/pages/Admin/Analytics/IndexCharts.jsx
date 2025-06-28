import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "@/layouts/AdminLayout";
import { Bar, Pie, Line } from "react-chartjs-2";
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

const AdvancedFilters = ({ filters, setFilters, available, charts }) => {
  // Use backend chart labels for dynamic filter options
  const genders = charts?.byGender?.labels || [];
  const reportTypes = charts?.byReportType?.labels || [];
  const cities = charts?.byCity?.labels || [];

  return (
    <div className="flex flex-wrap gap-4 bg-white/80 rounded-lg p-4 mb-4 shadow items-end">
      {/* Age Category */}
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          Age Category
        </label>
        <select
          className="rounded border px-2 py-1 text-sm"
          value={filters.ageCategory || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              ageCategory: e.target.value || undefined,
            }))
          }
        >
          <option value="">All</option>
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
          className="rounded border px-2 py-1 text-sm"
          value={filters.gender || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              gender: e.target.value || undefined,
            }))
          }
        >
          <option value="">All</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      {/* Date Range */}
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          Start Date
        </label>
        <input
          type="date"
          className="rounded border px-2 py-1 text-sm"
          value={filters.startDate || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              startDate: e.target.value || undefined,
            }))
          }
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          End Date
        </label>
        <input
          type="date"
          className="rounded border px-2 py-1 text-sm"
          value={filters.endDate || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              endDate: e.target.value || undefined,
            }))
          }
        />
      </div>
      {/* City */}
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          City
        </label>
        <select
          className="rounded border px-2 py-1 text-sm"
          value={filters.city || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              city: e.target.value || undefined,
            }))
          }
        >
          <option value="">All</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {/* Barangay */}
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          Barangay
        </label>
        <input
          type="text"
          className="rounded border px-2 py-1 text-sm"
          placeholder="Barangay"
          value={filters.barangay || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              barangay: e.target.value || undefined,
            }))
          }
        />
      </div>
      {/* Report Type */}
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          Report Type
        </label>
        <select
          className="rounded border px-2 py-1 text-sm"
          value={filters.reportType || ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              reportType: e.target.value || undefined,
            }))
          }
        >
          <option value="">All</option>
          {reportTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {/* Police Station ID */}
      <div>
        <label className="block text-xs font-semibold text-[#123F7B] mb-1">
          Police Station ID
        </label>
        <input
          type="text"
          className="rounded border px-2 py-1 text-sm"
          placeholder="Station ID"
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
  const [demographicsFilters, setDemographicsFilters] = useState({});
  const [demographicsLoading, setDemographicsLoading] = useState(false);
  const exportedBy = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : role;

  console.log('role:', role);

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
    // Remove obsolete Redux actions
    // Only fetch demographics
    const fetchDemographics = async () => {
      setDemographicsLoading(true);
      await dispatch(getUserDemographics(demographicsFilters));
      setDemographicsLoading(false);
    };
    fetchDemographics();
  }, [dispatch, demographicsFilters]);

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
  const trendsSection = (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-[#123F7B] mb-4">Report Trends</h2>
      {(role === "super_admin" || role === "police_admin") && (
        <>
          {monthlyData.labels && monthlyData.labels.length > 0 && monthlyData.datasets && monthlyData.datasets[0] && monthlyData.datasets[0].data.length > 0 ? (
            <>
              <div className="mb-6">
                <Line
                  data={monthlyData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: { color: CHART_HIGHLIGHT_COLOR, font: { weight: "bold" } },
                      },
                    },
                    scales: {
                      x: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                      y: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                    },
                  }}
                />
              </div>
              <div>
                <Bar
                  data={typeData}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                      y: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                    },
                  }}
                />
              </div>
            </>
          ) : (
            <div className="text-gray-400 italic">No trend data available.</div>
          )}
        </>
      )}
      {role === "police_officer" && (
        <>
          {monthlyData.labels && monthlyData.labels.length > 0 && monthlyData.datasets && monthlyData.datasets[0] && monthlyData.datasets[0].data.length > 0 ? (
            <div className="mb-6">
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: { color: CHART_HIGHLIGHT_COLOR, font: { weight: "bold" } },
                    },
                  },
                  scales: {
                    x: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                    y: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                  },
                }}
              />
            </div>
          ) : (
            <div className="text-gray-400 italic">No trend data available.</div>
          )}
        </>
      )}
    </div>
  );

  // --- Section 3: Composition ---
  const compositionSection = (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-[#123F7B] mb-4">Report Composition</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Pie
            data={statusData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: CHART_HIGHLIGHT_COLOR, font: { weight: "bold" } },
                },
              },
            }}
          />
        </div>
        <div>
          <Bar
            data={typeData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              indexAxis: "y",
              scales: {
                x: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
                y: { ticks: { color: CHART_HIGHLIGHT_COLOR } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  // --- Section 4: Geolocation ---
  const geolocationSection = (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-[#123F7B] mb-4">Geolocation Insights</h2>
      <HotspotMap role={role} filters={demographicsFilters} />
    </div>
  );

  // --- Section 5: Relationships ---
  // Placeholder for scatter/dot plots, only for admin/super
  const relationshipsSection =
    (role === "super_admin" || role === "police_admin") && (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-[#123F7B] mb-4">
          Relationships & Distribution
        </h2>
        {/* Add scatter/dot plot components here as needed */}
        <div className="text-gray-500">(Scatter/Dot plots go here)</div>
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