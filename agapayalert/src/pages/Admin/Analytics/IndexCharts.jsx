import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "@/layouts/AdminLayout";
import { Bar, Pie, Line } from "react-chartjs-2";
import HotspotMap from "./HotspotMap";
import {
  getTypeDistribution,
  getStatusDistribution,
  getMonthlyTrend,
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

const COLORS = [
  "#123F7B", // blue
  "#D46A79", // pink
  "#F5E6E9", // light pink
  "#A3BFFA", // light blue
  "#FBB6CE", // lighter pink
  "#7B9ACC", // muted blue
  "#F9A8D4", // pastel pink
  "#BEE3F8", // very light blue
];

const DEMO_COLORS = [
  "#123F7B", // blue
  "#D46A79", // pink
  "#A3BFFA", // light blue
  "#FBB6CE", // lighter pink
  "#7B9ACC", // muted blue
  "#F9A8D4", // pastel pink
  "#BEE3F8", // very light blue
  "#F5E6E9", // lightest pink
];

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

const IndexCharts = () => {
  const dispatch = useDispatch();
  const analyticsRef = useRef();

  // Fetch data from Redux store
  const {
    typeDistribution,
    statusDistribution,
    monthlyTrend,
    loading,
    userDemographics,
  } = useSelector((state) => state.dashboard);

  const [demographicsFilters, setDemographicsFilters] = useState({});
  const [demographicsLoading, setDemographicsLoading] = useState(false);

  // Chart data formatting
  const typeData = typeDistribution
    ? {
        labels: typeDistribution.labels,
        datasets: [
          {
            label: "Reports",
            data: typeDistribution.datasets[0].data,
            backgroundColor: typeDistribution.labels.map((_, i) =>
              i % 2 === 0 ? "#123F7B" : "#D46A79"
            ),
          },
        ],
      }
    : { labels: [], datasets: [] };

  const statusData = statusDistribution
    ? {
        labels: statusDistribution.labels,
        datasets: [
          {
            label: "Reports",
            data: statusDistribution.datasets[0].data,
            backgroundColor: statusDistribution.labels.map((_, i) =>
              i % 2 === 0 ? "#D46A79" : "#123F7B"
            ),
          },
        ],
      }
    : { labels: [], datasets: [] };

  const monthlyData = monthlyTrend
    ? {
        labels: monthlyTrend.labels,
        datasets: [
          {
            label: "Reports per Month",
            data: monthlyTrend.datasets[0].data,
            fill: false,
            borderColor: "#123F7B",
            backgroundColor: "#D46A79",
            tension: 0.4,
            pointBackgroundColor: "#D46A79",
            pointBorderColor: "#123F7B",
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Demographics data formatting
  const demographicsData =
    userDemographics && userDemographics.labels && userDemographics.datasets
      ? {
          labels: userDemographics.labels,
          datasets: [
            {
              label: "Reports",
              data: userDemographics.datasets[0]?.data || [],
              backgroundColor: userDemographics.labels.map((_, i) =>
                i % 2 === 0 ? "#123F7B" : "#D46A79"
              ),
            },
          ],
        }
      : { labels: [], datasets: [] };

  useEffect(() => {
    dispatch(getTypeDistribution());
    dispatch(getStatusDistribution());
    dispatch(getMonthlyTrend());
  }, [dispatch]);

  // Fetch demographics on mount and when filters change
  useEffect(() => {
    const fetchDemographics = async () => {
      setDemographicsLoading(true);
      await dispatch(getUserDemographics(demographicsFilters));
      setDemographicsLoading(false);
    };
    fetchDemographics();
  }, [dispatch, demographicsFilters]);

  // Export as PDF handler
  const handleExportPDF = () => {
    if (!analyticsRef.current) return;
    html2pdf()
      .from(analyticsRef.current)
      .set({
        margin: 0.5,
        filename: "analytics.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      })
      .save();
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Export summary as PDF handler
  const handleExportSummaryPDF = () => {
    const summaryElement = document.getElementById("summary-section");
    if (!summaryElement) return;
    html2pdf()
      .from(summaryElement)
      .set({
        margin: 0.5,
        filename: "analytics-summary.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  // Demographics filter controls
  const renderDemographicsFilters = () => {
    const available = userDemographics?.filters?.availableCategories || {};
    return (
      <div className="flex flex-wrap gap-4 bg-white/80 rounded-lg p-4 mb-4 shadow items-end">
        {/* Age Category */}
        <div>
          <label className="block text-xs font-semibold text-[#123F7B] mb-1">
            Age Category
          </label>
          <select
            className="rounded border px-2 py-1 text-sm"
            value={demographicsFilters.ageCategory || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
                ...f,
                ageCategory: e.target.value || undefined,
              }))
            }
          >
            <option value="">All</option>
            {available.ageCategories?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
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
            value={demographicsFilters.gender || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
                ...f,
                gender: e.target.value || undefined,
              }))
            }
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
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
            value={demographicsFilters.startDate || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
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
            value={demographicsFilters.endDate || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
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
          <input
            type="text"
            className="rounded border px-2 py-1 text-sm"
            placeholder="City"
            value={demographicsFilters.city || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
                ...f,
                city: e.target.value || undefined,
              }))
            }
          />
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
            value={demographicsFilters.barangay || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
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
          <input
            type="text"
            className="rounded border px-2 py-1 text-sm"
            placeholder="Type"
            value={demographicsFilters.reportType || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
                ...f,
                reportType: e.target.value || undefined,
              }))
            }
          />
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
            value={demographicsFilters.policeStationId || ""}
            onChange={(e) =>
              setDemographicsFilters((f) => ({
                ...f,
                policeStationId: e.target.value || undefined,
              }))
            }
          />
        </div>
      </div>
    );
  };

  // Demographics summary
  const renderDemographicsSummary = () => {
    if (demographicsLoading)
      return <div className="text-center py-8">Loading summary...</div>;
    if (!userDemographics || !userDemographics.summary) return null;
    const {
      overview,
      trend,
      gender,
      genderDifferential,
      ageCategory,
      city,
      barangay,
      policeStation,
      topCities,
      topBarangays,
      topStations,
      mostCommonType,
      status,
      unresolvedPercent,
      alarmingChildText,
      crossCategory,
      summaryParagraph,
    } = userDemographics.summary;
    return (
      <div
        id="summary-section"
        className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-[#123F7B]/20 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-[#123F7B] mb-4">
          Analytical Report Summary
        </h2>
        {/* 1. Total Reports Overview */}
        <div className="mb-2">
          <b>Total number of reports:</b> {overview?.totalReports}
        </div>
        {trend && (
          <div className="mb-2">
            <b>Trend:</b> {trend}
          </div>
        )}
        {/* 2. Age Category Analysis */}
        <div className="mb-2">
          <b>Age Category Distribution:</b>
          <ul className="list-disc ml-6">
            {ageCategory?.map((a) => (
              <li key={a.label}>
                {a.label}: {a.percent}% ({a.count})
              </li>
            ))}
          </ul>
        </div>
        {alarmingChildText && (
          <div className="mb-2 text-[#D46A79]">
            <b>Alarming/Good Numbers:</b> {alarmingChildText}
          </div>
        )}
        {/* 3. Gender Analysis */}
        <div className="mb-2">
          <b>Gender Distribution:</b>
          <ul className="list-disc ml-6">
            {gender?.map((g) => (
              <li key={g.label}>
                {g.label}: {g.percent}% ({g.count})
              </li>
            ))}
          </ul>
        </div>
        {genderDifferential && (
          <div className="mb-2">
            <b>Differential:</b> {genderDifferential}
          </div>
        )}
        {/* 4. City/Barangay/Police Station Analysis */}
        <div className="mb-2">
          <b>Top Cities:</b>{" "}
          {topCities?.map((c) => `${c.label} (${c.count})`).join(", ")}
        </div>
        <div className="mb-2">
          <b>Top Barangays:</b>{" "}
          {topBarangays?.map((b) => `${b.label} (${b.count})`).join(", ")}
        </div>
        <div className="mb-2">
          <b>Top Police Stations:</b>{" "}
          {topStations?.map((s) => `${s.label} (${s.count})`).join(", ")}
        </div>
        {/* 5. Report Type & Status */}
        <div className="mb-2">
          <b>Most Common Report Type:</b> {mostCommonType?.label} (
          {mostCommonType?.percent}%)
        </div>
        <div className="mb-2">
          <b>Status Differential:</b> {unresolvedPercent}% of reports are unresolved.
        </div>
        {/* 6. Comparative & Differential Insights */}
        {/* (Trend already shown above) */}
        {/* 7. Alarming/Good Numbers */}
        {/* (Alarming child text already shown above) */}
        {/* 8. Relation of Data */}
        {crossCategory?.childrenByBarangay &&
          Object.keys(crossCategory.childrenByBarangay).length > 0 && (
            <div className="mb-2">
              <b>Most Reports Involving Children (3-12) by Barangay:</b>
              <ul className="list-disc ml-6">
                {Object.entries(crossCategory.childrenByBarangay).map(
                  ([barangay, count]) => (
                    <li key={barangay}>
                      {barangay}: {count}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        {/* 9. Summary Paragraph */}
        {summaryParagraph && (
          <div className="mt-4 text-gray-700 text-base leading-relaxed border-t pt-4">
            {summaryParagraph}
          </div>
        )}
        <div className="mt-6 text-right">
          <button
            onClick={handleExportSummaryPDF}
            className="bg-[#123F7B] text-white px-4 py-2 rounded shadow font-semibold"
          >
            Export Summary as PDF
          </button>
        </div>
      </div>
    );
  };

  // Demographics charts
  const renderDemographicsCharts = () => {
    if (demographicsLoading)
      return <div className="text-center py-8">Loading demographics...</div>;
    if (!userDemographics || !userDemographics.charts) return null;
    const { overview, charts } = userDemographics;
    return (
      <div className="bg-[#123F7B]/10 rounded-2xl p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#123F7B] mb-2">
          User Demographics Analysis
        </h2>
        <div className="text-[#123F7B] text-lg font-semibold mb-4">
          Total Reports: {overview?.totalReports}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Age Category Bar */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By Age Category</h3>
            <div className="w-full h-[220px]">
              <Bar
                data={{
                  labels: charts.byAgeCategory?.labels || [],
                  datasets: [
                    {
                      label: "Reports",
                      data: charts.byAgeCategory?.values || [],
                      backgroundColor: DEMO_COLORS.slice(
                        0,
                        charts.byAgeCategory?.labels?.length || 0
                      ),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { ticks: { color: "#123F7B" } },
                    y: { ticks: { color: "#123F7B" } },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* Gender Pie */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By Gender</h3>
            <div className="w-full h-[220px]">
              <Pie
                data={{
                  labels: charts.byGender?.labels || [],
                  datasets: [
                    {
                      data: charts.byGender?.values || [],
                      backgroundColor: ["#A3BFFA", "#D46A79", "#FBB6CE"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: { color: "#123F7B", font: { weight: "bold" } },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* City Bar */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By City</h3>
            <div className="w-full h-[220px]">
              <Bar
                data={{
                  labels: charts.byCity?.labels || [],
                  datasets: [
                    {
                      label: "Reports",
                      data: charts.byCity?.values || [],
                      backgroundColor: DEMO_COLORS.slice(
                        0,
                        charts.byCity?.labels?.length || 0
                      ),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  indexAxis: "y",
                  scales: {
                    x: { ticks: { color: "#123F7B" } },
                    y: { ticks: { color: "#123F7B" } },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* Barangay Bar */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By Barangay</h3>
            <div className="w-full h-[220px]">
              <Bar
                data={{
                  labels: charts.byBarangay?.labels || [],
                  datasets: [
                    {
                      label: "Reports",
                      data: charts.byBarangay?.values || [],
                      backgroundColor: DEMO_COLORS.slice(
                        0,
                        charts.byBarangay?.labels?.length || 0
                      ),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  indexAxis: "y",
                  scales: {
                    x: { ticks: { color: "#123F7B" } },
                    y: { ticks: { color: "#123F7B" } },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* Police Station Bar */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By Police Station</h3>
            <div className="w-full h-[220px]">
              <Bar
                data={{
                  labels: charts.byPoliceStation?.labels || [],
                  datasets: [
                    {
                      label: "Reports",
                      data: charts.byPoliceStation?.values || [],
                      backgroundColor: DEMO_COLORS.slice(
                        0,
                        charts.byPoliceStation?.labels?.length || 0
                      ),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  indexAxis: "y",
                  scales: {
                    x: { ticks: { color: "#123F7B" } },
                    y: { ticks: { color: "#123F7B" } },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* Report Type Bar */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By Report Type</h3>
            <div className="w-full h-[220px]">
              <Bar
                data={{
                  labels: charts.byReportType?.labels || [],
                  datasets: [
                    {
                      label: "Reports",
                      data: charts.byReportType?.values || [],
                      backgroundColor: DEMO_COLORS.slice(
                        0,
                        charts.byReportType?.labels?.length || 0
                      ),
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  indexAxis: "y",
                  scales: {
                    x: { ticks: { color: "#123F7B" } },
                    y: { ticks: { color: "#123F7B" } },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
          {/* Status Pie */}
          <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center h-[320px]">
            <h3 className="font-bold text-[#123F7B] mb-2">By Status</h3>
            <div className="w-full h-[220px]">
              <Pie
                data={{
                  labels: charts.byStatus?.labels || [],
                  datasets: [
                    {
                      data: charts.byStatus?.values || [],
                      backgroundColor: ["#123F7B", "#D46A79", "#A3BFFA", "#FBB6CE"],
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      labels: { color: "#123F7B", font: { weight: "bold" } },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-row mb-4 space-x-2">
        <button
          onClick={handleExportPDF}
          className="bg-[#123F7B] text-white px-4 py-2 rounded shadow font-semibold"
        >
          Export as PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-[#D46A79] text-white px-4 py-2 rounded shadow font-semibold"
        >
          Print
        </button>
      </div>
      {/* Demographics Filters and Summary */}
      <div className="mb-8">
        {renderDemographicsFilters()}
        {renderDemographicsCharts()}
        {renderDemographicsSummary()}
      </div>
      <div
        ref={analyticsRef}
        id="analytics-section"
        className="flex flex-row w-full h-screen gap-2"
      >
        <div className="flex-col w-1/3 h-max">
          <div className="bg-[#123F7B]/10 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Type Distribution</h2>
            <Bar
              data={typeData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#123F7B" } },
                  y: { ticks: { color: "#123F7B" } },
                },
              }}
            />
          </div>
          <div className="bg-[#123F7B]/10 p-4 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
            <Pie
              data={statusData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: "#123F7B",
                      font: { weight: "bold" },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="flex-col w-2/3 h-max overflow-y-auto">
          <div className="flex flex-row gap-4">
            <div className="bg-[#123F7B]/10 p-4 rounded-lg shadow-lg w-full">
              <h2 className="text-xl font-bold mb-4">Monthly Trend</h2>
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: "#123F7B",
                        font: { weight: "bold" },
                      },
                    },
                  },
                  scales: {
                    x: { ticks: { color: "#123F7B" } },
                    y: { ticks: { color: "#123F7B" } },
                  },
                }}
              />
            </div>
          </div>
          {/* Hotspot Map Section */}
          <div className="bg-[#123F7B]/10 p-4 rounded-lg shadow-lg w-full mt-6">
            <HotspotMap />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IndexCharts;