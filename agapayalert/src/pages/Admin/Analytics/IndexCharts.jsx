import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "@/layouts/AdminLayout";
import { Bar, Pie, Line } from "react-chartjs-2";
import HotspotMap from "./HotspotMap";
import {
  getTypeDistribution,
  getStatusDistribution,
  getMonthlyTrend,
  // getLocationHotspots, // Temporarily removed
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
  const { typeDistribution, statusDistribution, monthlyTrend, /* locationHotspots, */ loading } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(getTypeDistribution());
    dispatch(getStatusDistribution());
    dispatch(getMonthlyTrend());
    // dispatch(getLocationHotspots()); // Temporarily removed
  }, [dispatch]);

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
      <div  ref={analyticsRef}
          id="analytics-section" className="flex flex-row w-full h-screen gap-2">
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