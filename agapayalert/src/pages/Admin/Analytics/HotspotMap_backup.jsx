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
  const user = useSelector((state) => state.auth.user);

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

  // Role-based access control
  const getUserRole = () => user?.roles?.[0] || "";
  const isPoliceAdmin = () => getUserRole() === "police admin";
  const isPoliceOfficer = () => getUserRole() === "police officer";
  const isSuperAdmin = () => getUserRole() === "super admin";

  console.log("HotspotMap - User data:", {
    userId: user?._id,
    role: getUserRole(),
    city: user?.city,
    assignedOfficerId: user?.assignedOfficerId,
    user: user
  });

  // Initialize role-based filters when user data loads
  useEffect(() => {
    if (user && user._id) {
      console.log("HotspotMap - Initializing role-based filters for user:", getUserRole());
      
      if (isPoliceAdmin() && user.city) {
        // Lock city to police admin's assigned city
        const cityValue = user.city;
        setFilters(prev => ({
          ...prev,
          cityFilter: cityValue,
          cityName: cityValue
        }));
        console.log("HotspotMap - Police admin city filter set to:", cityValue);
      }
      
      // Initial load of data with role-based filters
      handleApplyFilters();
    }
  }, [user?._id, user?.city, user?.assignedOfficerId]);

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

  // Handle filter changes with role-based restrictions
  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (key === "cityFilter") {
          // Police admin cannot change city
          if (isPoliceAdmin()) {
            console.log("HotspotMap - Police admin attempted to change city, blocked");
            return prev;
          }
          
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
    [cities, barangays, user]
  );

  const handleApplyFilters = useCallback(async () => {
    // Don't send filters until user data is loaded
    if (!user || !user._id) {
      console.log("HotspotMap - User not loaded yet, skipping filter application");
      return;
    }

    const activeFilters = {};
    
    // Role-based filtering
    if (isPoliceAdmin() && user.city) {
      activeFilters.city = user.city;
      console.log("HotspotMap - Police admin city filter applied:", user.city);
    } else if (isPoliceOfficer() && user.assignedOfficerId) {
      activeFilters.assignedOfficerId = user.assignedOfficerId;
      console.log("HotspotMap - Police officer filter applied:", user.assignedOfficerId);
    }
    
    // Apply UI filters (respecting role restrictions)
    if (filters.cityName && isSuperAdmin()) {
      activeFilters.cityFilter = filters.cityName;
    }
    if (filters.barangayName) activeFilters.barangay = filters.barangayName;
    if (filters.reportType) activeFilters.reportType = filters.reportType;
    if (filters.startDate)
      activeFilters.startDate = filters.startDate.toISOString().substring(0, 10);
    if (filters.endDate)
      activeFilters.endDate = filters.endDate.toISOString().substring(0, 10);

    console.log("HotspotMap - Applying filters:", activeFilters);

    try {
      await dispatch(getLocationHotspots(activeFilters));
    } catch (error) {
      console.error("Filter error:", error);
    }
  }, [filters, dispatch, user]);

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
      
      {/* Role indicator */}
      {!isSuperAdmin() && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-medium">
              🔒 Role: {getUserRole()}
            </span>
            {isPoliceAdmin() && (
              <span className="text-blue-600">
                - Data restricted to {user.city} city
              </span>
            )}
            {isPoliceOfficer() && (
              <span className="text-blue-600">
                - Data restricted to your assignments
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">
            City
            {isPoliceAdmin() && (
              <span className="text-blue-600 ml-1" title="Locked to your assigned city">🔒</span>
            )}
          </label>
          <select
            className={`w-full border rounded p-2 ${
              isPoliceAdmin() ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            value={filters.cityFilter}
            onChange={(e) => handleFilterChange("cityFilter", e.target.value)}
            disabled={isPoliceAdmin() || isPoliceOfficer()}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
          {isPoliceAdmin() && (
            <p className="text-xs text-blue-600 mt-1">
              City is locked to your assignment: {user.city}
            </p>
          )}
          {isPoliceOfficer() && (
            <p className="text-xs text-blue-600 mt-1">
              Data filtered by your assignments
            </p>
          )}
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
