import React, { useState, useEffect } from "react";
import { addressService } from '@/services/addressService';
import { useDispatch, useSelector } from 'react-redux';
import { getPoliceStationsByCity } from '@/redux/actions/policeStationActions';



const ReportsFilterModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialFilters,
  user,
  options // { statusOptions, typeOptions, cityOptions, barangayOptions, policeStationOptions, genderOptions }
}) => {
  const dispatch = useDispatch();
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [cityOptions, setCityOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);
  const [policeStationOptions, setPoliceStationOptions] = useState([]);
  const [policeStationLoading, setPoliceStationLoading] = useState(false);
  const [policeStationError, setPoliceStationError] = useState(null);
  const [citySearch, setCitySearch] = useState("");

  // Get police stations from Redux
  const policeStationList = useSelector(state => state.policeStationList);
  const { loading: policeStationReduxLoading, error: policeStationReduxError, data: policeStationData } = policeStationList || {};

  // Fetch city options on mount
  useEffect(() => {
    addressService.getCities().then(cities => {
      // Only allow Taguig, Makati, Paranaque, Pasay, Pateros
      const allowed = ["Taguig", "Makati", "Paranaque", "Pasay", "Pateros"];
      const filtered = cities.filter(city => allowed.includes(city.label));
      // Store both city name and PSGC code
      setCityOptions(filtered.map(city => ({ ...city, value: city.label, code: city.value })));
    });
  }, []);

  // Fetch barangays and police stations when city changes
  useEffect(() => {
    const fetchOptions = async () => {
      if (!localFilters.city || localFilters.city.length === 0) {
        setBarangayOptions([]);
        setPoliceStationOptions([]);
        console.log('[FilterModal] No city selected, cleared barangay and police station options.');
        return;
      }
      setPoliceStationLoading(true);
      setPoliceStationError(null);
      // Always split comma-separated city strings into an array
      const cityNames = Array.isArray(localFilters.city)
        ? localFilters.city
        : typeof localFilters.city === 'string'
          ? localFilters.city.split(',').map(s => s.trim())
          : [];
      let allBarangays = [];
      let allStations = [];
      try {
        for (const cityName of cityNames) {
          // Map city name to PSGC code for API
          const cityObj = cityOptions.find(c => c.value === cityName);
          const cityCode = cityObj ? cityObj.code : cityName;
          try {
            const barangays = await addressService.getBarangays(cityCode);
            console.log(`[FilterModal] Barangays fetched for city ${cityName} (code: ${cityCode}):`, barangays);
            allBarangays = [...allBarangays, ...barangays.map(b => b.label)];
          } catch (err) {
            console.error(`[FilterModal] Failed to fetch barangays for city ${cityName} (code: ${cityCode}):`, err);
          }
          try {
            const result = await dispatch(getPoliceStationsByCity(cityName));
            if (result && result.success && result.data && Array.isArray(result.data)) {
              console.log(`[FilterModal] Police stations fetched for city ${cityName}:`, result.data);
              allStations = [...allStations, ...result.data.map(station => station.name)];
            } else {
              console.warn(`[FilterModal] No police stations found for city ${cityName}`);
            }
          } catch (err) {
            setPoliceStationError('Failed to fetch police stations');
            console.error(`[FilterModal] Failed to fetch police stations for city ${cityName}:`, err);
          }
        }
        setBarangayOptions([...new Set(allBarangays)]);
        setPoliceStationOptions([...new Set(allStations)]);
      } catch (err) {
        setPoliceStationError('Failed to fetch police stations');
        console.error('[FilterModal] Error in fetching barangays or police stations:', err);
      } finally {
        setPoliceStationLoading(false);
      }
    };
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFilters.city, dispatch, cityOptions]);

  useEffect(() => {
    setLocalFilters({
      sortBy: initialFilters.sortBy || "createdAt",
      sortOrder: initialFilters.sortOrder || "desc",
      ...initialFilters,
    });
  }, [initialFilters, isOpen]);

  // Helper for multi-select
  const handleMultiSelect = (field, value) => {
    setLocalFilters((prev) => {
      const arr = Array.isArray(prev[field])
        ? prev[field]
        : prev[field]
          ? [prev[field]]
          : [];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  // Helper for single select
  const handleSingleSelect = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Date range
  const handleDateChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Search query
  const handleInputChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtersToSend = {
      ...localFilters,
      city: Array.isArray(localFilters.city) ? localFilters.city.join(',') : localFilters.city,
      policeStation: Array.isArray(localFilters.policeStation) ? localFilters.policeStation.join(',') : localFilters.policeStation,
      barangay: Array.isArray(localFilters.barangay) ? localFilters.barangay.join(',') : localFilters.barangay,
      gender: Array.isArray(localFilters.gender) ? localFilters.gender.join(',') : localFilters.gender,
    };
    onSubmit(filtersToSend);
    onClose();
  };

  if (!isOpen) return null;

  // For police station options, use local state
  const policeStationOptionsToUse = policeStationOptions.length > 0
    ? policeStationOptions
    : policeStationData?.data?.data
    ? policeStationData.data.data.map(station => station.name)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Filter Reports</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Multi-select */}
          <div>
            <label className="font-semibold">Status</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {options.statusOptions?.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={`px-3 py-1 rounded-full border ${localFilters.status?.includes(status) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                  onClick={() => handleMultiSelect("status", status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          {/* Type Multi-select */}
          <div>
            <label className="font-semibold">Type</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {options.typeOptions?.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`px-3 py-1 rounded-full border ${localFilters.type?.includes(type) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                  onClick={() => handleMultiSelect("type", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          {/* City Multi-select (searchable) */}
          <div>
            <label className="font-semibold">City</label>
            <input
              type="text"
              placeholder="Search city..."
              className="border rounded px-2 py-1 w-full mb-2"
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-1 max-h-32 overflow-y-auto">
              {cityOptions
                .filter(city => !citySearch || city.label.toLowerCase().includes(citySearch.toLowerCase()))
                .map(city => (
                  <button
                    type="button"
                    key={city.value}
                    className={`px-3 py-1 rounded-full border ${localFilters.city?.includes(city.value) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    onClick={() => handleMultiSelect("city", city.value)}
                  >
                    {city.label}
                  </button>
                ))}
            </div>
          </div>
          {/* Barangay Multi-select (searchable) */}
          <div>
            <label className="font-semibold">Barangay</label>
            <input
              type="text"
              placeholder="Search barangay..."
              className="border rounded px-2 py-1 w-full mb-2"
              value={localFilters.barangaySearch || ''}
              onChange={e => handleInputChange('barangaySearch', e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-1 max-h-32 overflow-y-auto">
              {barangayOptions
                .filter(b => !localFilters.barangaySearch || b.toLowerCase().includes(localFilters.barangaySearch.toLowerCase()))
                .map((barangay) => (
                  <button
                    type="button"
                    key={barangay}
                    className={`px-3 py-1 rounded-full border ${localFilters.barangay?.includes(barangay) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    onClick={() => handleMultiSelect("barangay", barangay)}
                  >
                    {barangay}
                  </button>
                ))}
            </div>
          </div>
          {/* Police Station Multi-select (searchable) */}
          <div>
            <label className="font-semibold">Police Station</label>
            <input
              type="text"
              placeholder="Search police station..."
              className="border rounded px-2 py-1 w-full mb-2"
              value={localFilters.policeStationSearch || ''}
              onChange={e => handleInputChange('policeStationSearch', e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-1 max-h-32 overflow-y-auto">
              {policeStationOptionsToUse
                .filter(station => !localFilters.policeStationSearch || station.toLowerCase().includes(localFilters.policeStationSearch.toLowerCase()))
                .map((station) => (
                  <button
                    type="button"
                    key={station}
                    className={`px-3 py-1 rounded-full border ${localFilters.policeStation?.includes(station) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                    onClick={() => handleMultiSelect("policeStation", station)}
                  >
                    {station}
                  </button>
                ))}
            </div>
          </div>
          {/* Gender Multi-select */}
          <div>
            <label className="font-semibold">Gender</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Male", "Female", "Non-binary", "Transgender", "Other"].map((gender) => (
                <button
                  type="button"
                  key={gender}
                  className={`px-3 py-1 rounded-full border ${Array.isArray(localFilters.gender) && localFilters.gender.includes(gender) ? "bg-blue-600 text-white" : "bg-gray-100"}`}
                  onClick={() => handleMultiSelect("gender", gender)}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
          {/* Age Category Single-select */}
          <div>
            <label className="font-semibold">Age Category</label>
            <select
              value={localFilters.ageCategory || ""}
              onChange={e => handleSingleSelect("ageCategory", e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Select Age Category</option>
              <option value="infant">Infant (0-2)</option>
              <option value="child">Child (3-12)</option>
              <option value="teen">Teen (13-19)</option>
              <option value="young_adult">Young Adult (20-35)</option>
              <option value="adult">Adult (36-59)</option>
              <option value="senior">Senior (60+)</option>
            </select>
          </div>
          {/* Date Range */}
          <div className="flex gap-2">
            <div>
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                value={localFilters.startDate || ""}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="font-semibold">End Date</label>
              <input
                type="date"
                value={localFilters.endDate || ""}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
          </div>
          {/* Search Query */}
          <div>
            <label className="font-semibold">Search</label>
            <input
              type="text"
              value={localFilters.query || ""}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="border rounded px-2 py-1 w-full"
              placeholder="Case ID, First/Last Name"
            />
          </div>
          {/* Sort By */}
          <div className="flex gap-2">
            <div>
              <label className="font-semibold">Sort By</label>
              <select
                value={localFilters.sortBy || "createdAt"}
                onChange={(e) => handleSingleSelect("sortBy", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="createdAt">Date Created</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
                {/* Add more fields as needed */}
              </select>
            </div>
            <div>
              <label className="font-semibold">Order</label>
              <select
                value={localFilters.sortOrder || "desc"}
                onChange={(e) => handleSingleSelect("sortOrder", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold">Apply Filters</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportsFilterModal;