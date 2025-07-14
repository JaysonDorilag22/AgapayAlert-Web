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

  // Role-based access control
  const userRole = user?.roles?.[0]; // Get first role from roles array
  const isPoliceOfficer = userRole === 'police_officer';
  const isPoliceAdmin = userRole === 'police_admin';
  const isSuperAdmin = userRole === 'super_admin';

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
    // Convert comma-separated strings back to arrays for UI display
    const processedFilters = { ...initialFilters };
    
    // Convert string filters back to arrays for multi-select UI
    const arrayFields = ['status', 'type', 'city', 'policeStation', 'barangay', 'gender'];
    arrayFields.forEach(field => {
      if (processedFilters[field] && typeof processedFilters[field] === 'string') {
        processedFilters[field] = processedFilters[field].split(',').map(s => s.trim()).filter(s => s);
      }
    });
    
    setLocalFilters({
      sortBy: processedFilters.sortBy || "createdAt",
      sortOrder: processedFilters.sortOrder || "desc",
      ...processedFilters,
    });
    
    console.log('=== FILTER MODAL INIT DEBUG ===');
    console.log('Initial filters received:', initialFilters);
    console.log('Processed filters for UI:', processedFilters);
  }, [initialFilters, isOpen]);

  // Helper for multi-select
  const handleMultiSelect = (field, value) => {
    setLocalFilters((prev) => {
      // Ensure we always work with arrays
      let currentArray = [];
      if (Array.isArray(prev[field])) {
        currentArray = prev[field];
      } else if (prev[field] && typeof prev[field] === 'string') {
        currentArray = prev[field].split(',').map(s => s.trim()).filter(s => s);
      }
      
      const newArray = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
      
      console.log(`[FilterModal] Multi-select ${field}:`, {
        value,
        currentArray,
        newArray,
        action: currentArray.includes(value) ? 'remove' : 'add'
      });
      
      return {
        ...prev,
        [field]: newArray,
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
    
    // Apply role-based restrictions before submitting
    let filtersToSend = { ...localFilters };
    
    if (isPoliceAdmin && user?.city) {
      // Police Admin: force city to their assigned city
      filtersToSend.city = user.city;
    } else if (isPoliceOfficer && user?._id) {
      // Police Officer: force assigned officer filter
      filtersToSend.assignedOfficerId = user._id;
    }
    
    // Format arrays as comma-separated strings for backend compatibility
    filtersToSend = {
      ...filtersToSend,
      // Convert all multi-select arrays to comma-separated strings
      status: Array.isArray(filtersToSend.status) && filtersToSend.status.length > 0 
        ? filtersToSend.status.join(',') 
        : undefined,
      type: Array.isArray(filtersToSend.type) && filtersToSend.type.length > 0 
        ? filtersToSend.type.join(',') 
        : undefined,
      city: Array.isArray(filtersToSend.city) && filtersToSend.city.length > 0 
        ? filtersToSend.city.join(',') 
        : filtersToSend.city,
      policeStation: Array.isArray(filtersToSend.policeStation) && filtersToSend.policeStation.length > 0 
        ? filtersToSend.policeStation.join(',') 
        : undefined,
      barangay: Array.isArray(filtersToSend.barangay) && filtersToSend.barangay.length > 0 
        ? filtersToSend.barangay.join(',') 
        : undefined,
      gender: Array.isArray(filtersToSend.gender) && filtersToSend.gender.length > 0 
        ? filtersToSend.gender.join(',') 
        : undefined,
    };
    
    // Remove undefined/empty values to clean up the request
    Object.keys(filtersToSend).forEach(key => {
      if (filtersToSend[key] === undefined || filtersToSend[key] === '' || 
          (Array.isArray(filtersToSend[key]) && filtersToSend[key].length === 0)) {
        delete filtersToSend[key];
      }
    });
    
    // Debug: Log the formatted filters
    console.log('=== FILTER MODAL DEBUG ===');
    console.log('Original localFilters:', localFilters);
    console.log('Formatted filtersToSend:', filtersToSend);
    
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Filter Reports</h2>
          {/* Role-based access indicator */}
          {isPoliceOfficer && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              Your Reports Only
            </span>
          )}
          {isPoliceAdmin && user?.city && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {user.city} City Only
            </span>
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
                  <p>You can only view and filter reports that are assigned to you. Some filters may be restricted.</p>
                )}
                {isPoliceAdmin && user?.city && (
                  <p>You can only view and filter reports from <strong>{user.city}</strong>. The city filter is automatically set and cannot be changed.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
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
          {/* City Multi-select (searchable) - Role-based restrictions */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-semibold">City</label>
              {isPoliceAdmin && user?.city && (
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  🔒 Locked to {user.city}
                </span>
              )}
            </div>
            
            {isPoliceAdmin && user?.city ? (
              // Police Admin: Show locked city filter
              <div className="mt-2">
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
              <>
                <input
                  type="text"
                  placeholder="Search city..."
                  className="border rounded px-2 py-1 w-full mb-2 mt-1"
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
              </>
            )}
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
          
          {/* Role-based footer information */}
          {(isPoliceAdmin || isPoliceOfficer) && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  {isPoliceOfficer 
                    ? "Filters will be applied to your assigned reports only"
                    : `Filters will be applied to ${user?.city || 'your city'} reports only`
                  }
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold">
              Apply Filters
              {(isPoliceAdmin || isPoliceOfficer) && (
                <span className="ml-1 text-xs opacity-75">
                  ({isPoliceOfficer ? 'Your Reports' : user?.city || 'City'})
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportsFilterModal;