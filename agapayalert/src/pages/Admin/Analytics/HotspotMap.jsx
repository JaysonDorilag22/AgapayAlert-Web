import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { getLocationHotspots } from "@/redux/actions/dashboardActions";
import { REPORT_TYPE_OPTIONS } from "@/config/constants";
import { addressService } from "@/services/addressService";
import MapComponent from "@/components/MapComponent";

const HotspotMap = () => {
  const dispatch = useDispatch();
  const { locationHotspots, loading } = useSelector((state) => state.dashboard);

  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [filters, setFilters] = useState({
    barangay: "",
    barangayName: "",
    reportType: "",
    startDate: new Date(),
    endDate: new Date(),
    cityFilter: "",
    cityName: "",
  });

  // Fetch cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await addressService.getCities();
        setCities(response);
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    };
    loadCities();
  }, []);

  // Load barangays when city changes
  useEffect(() => {
    const loadBarangays = async () => {
      if (filters.cityFilter) {
        try {
          const response = await addressService.getBarangays(filters.cityFilter);
          setBarangays(response);
        } catch (error) {
          setBarangays([]);
        }
      } else {
        setBarangays([]);
      }
    };
    loadBarangays();
  }, [filters.cityFilter]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (key === "cityFilter") {
          const selectedCity = cities.find((city) => city.value === value);
          newFilters.cityFilter = value;
          newFilters.cityName = selectedCity?.label || "";
          newFilters.barangay = "";
          newFilters.barangayName = "";
        } else if (key === "barangay") {
          const selectedBarangay = barangays.find((b) => b.value === value);
          newFilters.barangay = value;
          newFilters.barangayName = selectedBarangay?.label || "";
        } else {
          newFilters[key] = value;
        }
        return newFilters;
      });
    },
    [cities, barangays]
  );

  const handleApplyFilters = useCallback(async () => {
    const activeFilters = {};
    if (filters.cityName) activeFilters.cityFilter = filters.cityName;
    if (filters.barangayName) activeFilters.barangay = filters.barangayName;
    if (filters.reportType) activeFilters.reportType = filters.reportType;
    if (filters.startDate)
      activeFilters.startDate = filters.startDate.toISOString().substring(0, 10);
    if (filters.endDate)
      activeFilters.endDate = filters.endDate.toISOString().substring(0, 10);

    try {
      await dispatch(getLocationHotspots(activeFilters));
    } catch (error) {
      console.error("Filter error:", error);
    }
  }, [filters, dispatch]);

  // Prepare chart data
  const current = locationHotspots?.current || {};
  const predictions = locationHotspots?.predictions || {};
  const analysis = locationHotspots?.analysis || [];

  const chartData = {
    labels: current.labels || [],
    datasets: [
      {
        label: "Current Incidents",
        data: current.datasets?.[0]?.data || [],
        backgroundColor: "#123F7B",
      },
    ],
  };

  const predictionsChartData = {
    labels: predictions.labels || [],
    datasets: [
      {
        label: "Predicted Next Month",
        data: predictions.datasets?.[0]?.data || [],
        backgroundColor: "#D46A79",
      },
    ],
  };

  // Map markers for web (adjust as needed for your MapComponent)
  const mapMarkers =
    analysis.map((item) => ({
      lat: item.latitude || 14.5176,
      lng: item.longitude || 121.0509,
      title: `${item.barangayName || item.barangay}\nRisk Level: ${item.riskLevel}\nCurrent Incidents: ${
        item.currentIncidents
      }\nPredicted: ${item.predictedNextMonth}`,
    })) || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Location Hotspots</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">City</label>
          <select
            className="w-full border rounded p-2"
            value={filters.cityFilter}
            onChange={(e) => handleFilterChange("cityFilter", e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Barangay</label>
          <select
            className="w-full border rounded p-2"
            value={filters.barangay}
            onChange={(e) => handleFilterChange("barangay", e.target.value)}
            disabled={!filters.cityFilter}
          >
            <option value="">All Barangays</option>
            {barangays.map((barangay) => (
              <option key={barangay.value} value={barangay.value}>
                {barangay.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Report Type</label>
          <select
            className="w-full border rounded p-2"
            value={filters.reportType}
            onChange={(e) => handleFilterChange("reportType", e.target.value)}
          >
            <option value="">All Types</option>
            {REPORT_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={filters.startDate.toISOString().substring(0, 10)}
            max={filters.endDate.toISOString().substring(0, 10)}
            onChange={(e) => handleFilterChange("startDate", new Date(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={filters.endDate.toISOString().substring(0, 10)}
            min={filters.startDate.toISOString().substring(0, 10)}
            max={new Date().toISOString().substring(0, 10)}
            onChange={(e) => handleFilterChange("endDate", new Date(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <button
            className="bg-[#123F7B] text-white px-4 py-2 rounded hover:bg-[#D46A79] transition"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="my-6">
        <MapComponent markers={mapMarkers} center={{ lat: 14.5176, lng: 121.0359 }} zoom={13} height={400} />
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">Current Incidents</h3>
        <Bar
          data={chartData}
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

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">Predicted Next Month</h3>
        <Bar
          data={predictionsChartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: "#D46A79" } },
              y: { ticks: { color: "#D46A79" } },
            },
          }}
        />
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">Area Analysis</h3>
        <div className="space-y-2">
          {analysis.map((item, index) => (
            <div key={index} className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-medium">{item.barangayName || item.barangay}</div>
                <div className="text-xs text-gray-500">
                  Trend: {item.trend} ({item.currentIncidents} incidents)
                </div>
                <div className="text-xs text-gray-500">
                  Cases:{" "}
                  {Object.entries(item.caseTypes)
                    .map(([type, count]) => `${type}(${count})`)
                    .join(", ")}
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.riskLevel === "High"
                      ? "bg-red-100 text-red-700"
                      : item.riskLevel === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.riskLevel}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {item.predictedNextMonth} predicted
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotspotMap;