import React, { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  getPoliceStations,
  createPoliceStation,
  updatePoliceStation,
  deletePoliceStation,
} from "@/redux/actions/policeStationActions";
import { getReports } from "@/redux/actions/reportActions";
import toastUtils from "@/utils/toastUtils";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBuilding, FaFileAlt, FaInfoCircle, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";

// Modal component for create/edit
function PoliceStationModal({
  open,
  onClose,
  title,
  onSubmit,
  submitLoading,
  formData,
  setFormData,
}) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Station name is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (formData.zipCode && !/^\d{4}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(f => ({ ...f, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <FaBuilding className="text-[#123F7B] text-xl" aria-hidden="true" />
          <h2 id="modal-title" className="text-xl font-bold text-[#123F7B]">{title}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Station Name */}
            <div className="group relative">
              <label htmlFor="station-name" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                Station Name
                <div className="relative">
                  <FaInfoCircle className="text-gray-400 hover:text-[#123F7B] cursor-help text-sm" aria-hidden="true" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                    Enter the official name of the police station
                  </div>
                </div>
              </label>
              <input
                id="station-name"
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent transition-all ${
                  errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Taguig City Police Station"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                required
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">{errors.name}</p>
              )}
            </div>

            {/* City */}
            <div className="group relative">
              <label htmlFor="station-city" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                City
                <div className="relative">
                  <FaInfoCircle className="text-gray-400 hover:text-[#123F7B] cursor-help text-sm" aria-hidden="true" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                    Select from: Taguig, Makati, Pasay, Paranaque, Pateros
                  </div>
                </div>
              </label>
              <select
                id="station-city"
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent transition-all ${
                  errors.city ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
                required
                aria-describedby={errors.city ? 'city-error' : undefined}
              >
                <option value="">Select City</option>
                <option value="Taguig">Taguig</option>
                <option value="Makati">Makati</option>
                <option value="Pasay">Pasay</option>
                <option value="Paranaque">Paranaque</option>
                <option value="Pateros">Pateros</option>
              </select>
              {errors.city && (
                <p id="city-error" className="text-red-600 text-sm mt-1" role="alert">{errors.city}</p>
              )}
            </div>

            {/* Street Address */}
            <div className="group relative">
              <label htmlFor="street-address" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                Street Address
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                id="street-address"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent transition-all"
                placeholder="e.g., 123 Main Street"
                value={formData.streetAddress}
                onChange={e => handleInputChange('streetAddress', e.target.value)}
              />
            </div>

            {/* Barangay */}
            <div className="group relative">
              <label htmlFor="barangay" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                Barangay
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                id="barangay"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent transition-all"
                placeholder="e.g., Barangay 1"
                value={formData.barangay}
                onChange={e => handleInputChange('barangay', e.target.value)}
              />
            </div>

            {/* Zip Code */}
            <div className="group relative">
              <label htmlFor="zip-code" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                ZIP Code
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                id="zip-code"
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent transition-all ${
                  errors.zipCode ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 1630"
                value={formData.zipCode}
                onChange={e => handleInputChange('zipCode', e.target.value)}
                pattern="[0-9]{4}"
                maxLength="4"
                aria-describedby={errors.zipCode ? 'zip-error' : undefined}
              />
              {errors.zipCode && (
                <p id="zip-error" className="text-red-600 text-sm mt-1" role="alert">{errors.zipCode}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#123F7B] focus:ring-offset-2 ${
                submitLoading 
                  ? "bg-[#123F7B]/50 cursor-not-allowed" 
                  : "bg-[#123F7B] hover:bg-[#0f2f5a] transform hover:scale-105"
              }`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  Saving...
                </div>
              ) : (
                "Save Station"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const IndexPolice = () => {
  const dispatch = useDispatch();
  const {
    policeStations = [],
    loading,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useSelector((state) => state.policeStation);
  
  const { reports = [], loading: reportsLoading } = useSelector((state) => state.reports);

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    streetAddress: "",
    barangay: "",
    zipCode: "",
  });

  useEffect(() => {
    console.log('=== POLICE STATION DEBUG ===');
    console.log('Fetching police stations and reports...');
    
    dispatch(getPoliceStations());
    dispatch(getReports({ page: 1, limit: 1000 })); // Get all reports for counting
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('=== REPORT COUNTING DEBUG ===');
    console.log('Total reports loaded:', reports.length);
    console.log('Total police stations:', policeStations.length);
    
    if (reports.length > 0) {
      console.log('Sample report structure:', reports[0]);
      console.log('Report police station fields to check:');
      reports.slice(0, 5).forEach((report, i) => {
        console.log(`Report ${i + 1}:`, {
          id: report._id,
          assignedPoliceStation: report.assignedPoliceStation,
          policeStation: report.policeStation,
          policeStationId: report.policeStationId,
        });
      });
    }
    
    if (policeStations.length > 0) {
      console.log('Sample police station structure:', policeStations[0]);
    }
  }, [reports, policeStations]);

  // Enhanced filtering with better search
  const filteredStations = policeStations.filter((station) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      (station.name || "").toLowerCase().includes(searchTerm) ||
      (station.address?.city || "").toLowerCase().includes(searchTerm) ||
      (station.address?.barangay || "").toLowerCase().includes(searchTerm) ||
      (station.address?.streetAddress || "").toLowerCase().includes(searchTerm)
    );
  });

  // Enhanced stats calculation with better report counting logic
  const calculateStationStats = () => {
    const stationStats = policeStations.map((station) => {
      // Try multiple possible field paths for police station assignment
      const reportCount = reports.filter((report) => {
        // Check various possible field structures
        const stationIds = [
          report.assignedPoliceStation?._id,
          report.assignedPoliceStation,
          report.policeStation?._id,
          report.policeStation,
          report.policeStationId,
        ].filter(Boolean);
        
        // Also check string comparisons for IDs
        const stationStringIds = [
          typeof report.assignedPoliceStation === 'string' ? report.assignedPoliceStation : null,
          typeof report.policeStation === 'string' ? report.policeStation : null,
          report.policeStationId,
        ].filter(Boolean);
        
        return stationIds.includes(station._id) || stationStringIds.includes(station._id);
      }).length;

      return {
        ...station,
        reportCount,
      };
    });

    const totalStations = policeStations.length;
    const totalReports = reports.length;
    const totalAssignedReports = stationStats.reduce((sum, station) => sum + station.reportCount, 0);
    const unassignedReports = totalReports - totalAssignedReports;

    console.log('=== ENHANCED STATS CALCULATION ===');
    console.log('Total stations:', totalStations);
    console.log('Total reports:', totalReports);
    console.log('Total assigned reports:', totalAssignedReports);
    console.log('Unassigned reports:', unassignedReports);
    console.log('Station report counts:', stationStats.map(s => ({ name: s.name, count: s.reportCount })));
    
    // Debug unassigned reports
    if (unassignedReports > 0) {
      const unassigned = reports.filter(report => {
        const hasStation = policeStations.some(station => {
          const stationIds = [
            report.assignedPoliceStation?._id,
            report.assignedPoliceStation,
            report.policeStation?._id,
            report.policeStation,
            report.policeStationId,
          ].filter(Boolean);
          
          const stationStringIds = [
            typeof report.assignedPoliceStation === 'string' ? report.assignedPoliceStation : null,
            typeof report.policeStation === 'string' ? report.policeStation : null,
            report.policeStationId,
          ].filter(Boolean);
          
          return stationIds.includes(station._id) || stationStringIds.includes(station._id);
        });
        return !hasStation;
      });
      console.log('Sample unassigned reports:', unassigned.slice(0, 3).map(r => ({
        id: r._id,
        assignedPoliceStation: r.assignedPoliceStation,
        policeStation: r.policeStation,
        policeStationId: r.policeStationId,
      })));
    }

    return {
      stationStats,
      totalStations,
      totalReports,
      totalAssignedReports,
      unassignedReports,
    };
  };

  const { stationStats, totalStations, totalReports, totalAssignedReports, unassignedReports } = calculateStationStats();

  // CRUD handlers with enhanced validation
  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      streetAddress: "",
      barangay: "",
      zipCode: "",
    });
  };

  const handleCreate = async () => {
    try {
      if (!formData.name.trim() || !formData.city.trim()) {
        toastUtils("Station name and city are required", "error");
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("city", formData.city.trim());
      formDataToSend.append(
        "address",
        JSON.stringify({
          streetAddress: formData.streetAddress.trim(),
          barangay: formData.barangay.trim(),
          city: formData.city.trim(),
          zipCode: formData.zipCode.trim(),
        })
      );
      
      const result = await dispatch(createPoliceStation(formDataToSend));
      if (result.success) {
        setShowCreateModal(false);
        resetForm();
        toastUtils("Police station created successfully", "success");
        // Refresh reports to get updated counts
        dispatch(getReports({ page: 1, limit: 1000 }));
      } else {
        toastUtils(result.error || "Failed to create police station", "error");
      }
    } catch (error) {
      console.error('Create station error:', error);
      toastUtils("An unexpected error occurred", "error");
    }
  };

  const handleEdit = (station) => {
    setSelectedStation(station);
    setFormData({
      name: station.name || "",
      city: station.address?.city || "",
      streetAddress: station.address?.streetAddress || "",
      barangay: station.address?.barangay || "",
      zipCode: station.address?.zipCode || "",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      if (!formData.name.trim() || !formData.city.trim()) {
        toastUtils("Station name and city are required", "error");
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("city", formData.city.trim());
      formDataToSend.append(
        "address",
        JSON.stringify({
          streetAddress: formData.streetAddress.trim(),
          barangay: formData.barangay.trim(),
          city: formData.city.trim(),
          zipCode: formData.zipCode.trim(),
        })
      );
      
      const result = await dispatch(updatePoliceStation(selectedStation._id, formDataToSend));
      if (result.success) {
        setShowEditModal(false);
        setSelectedStation(null);
        resetForm();
        toastUtils("Police station updated successfully", "success");
        // Refresh reports to get updated counts
        dispatch(getReports({ page: 1, limit: 1000 }));
      } else {
        toastUtils(result.error || "Failed to update police station", "error");
      }
    } catch (error) {
      console.error('Update station error:', error);
      toastUtils("An unexpected error occurred", "error");
    }
  };

  const handleDelete = async (station) => {
    if (window.confirm(`Are you sure you want to delete "${station.name}"? This action cannot be undone.`)) {
      try {
        const result = await dispatch(deletePoliceStation(station._id));
        if (result.success) {
          toastUtils("Police station deleted successfully", "success");
          // Refresh reports to get updated counts
          dispatch(getReports({ page: 1, limit: 1000 }));
        } else {
          toastUtils(result.error || "Failed to delete police station", "error");
        }
      } catch (error) {
        console.error('Delete station error:', error);
        toastUtils("An unexpected error occurred", "error");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#123F7B] to-[#1e4d72] rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-['Poppins'] mb-2">Police Stations Management</h1>
              <p className="text-blue-100">Manage police stations and monitor report assignments</p>
            </div>
            <button
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all transform hover:scale-105"
              onClick={() => {
                setShowCreateModal(true);
                resetForm();
              }}
              disabled={createLoading}
            >
              <FaPlus className="text-sm" /> 
              {createLoading ? "Creating..." : "Add Station"}
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Stations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaBuilding className="text-[#123F7B] text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Stations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? (
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      totalStations
                    )}
                  </p>
                </div>
              </div>
              <div className="relative">
                <FaInfoCircle className="text-gray-300 group-hover:text-[#123F7B] cursor-help transition-colors" />
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                  Active police stations in the system
                </div>
              </div>
            </div>
          </div>

          {/* Total Reports */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaFileAlt className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportsLoading ? (
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      totalReports
                    )}
                  </p>
                </div>
              </div>
              <div className="relative">
                <FaInfoCircle className="text-gray-300 group-hover:text-green-600 cursor-help transition-colors" />
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                  All reports in the system
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Reports */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaUsers className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Assigned Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportsLoading ? (
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      totalAssignedReports
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {totalReports > 0 ? Math.round((totalAssignedReports / totalReports) * 100) : 0}% of total
                  </p>
                </div>
              </div>
              <div className="relative">
                <FaInfoCircle className="text-gray-300 group-hover:text-purple-600 cursor-help transition-colors" />
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                  Reports assigned to police stations
                </div>
              </div>
            </div>
          </div>

          {/* Unassigned Reports */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`bg-${unassignedReports > 0 ? 'orange' : 'gray'}-100 p-3 rounded-lg`}>
                  <HiInformationCircle className={`text-${unassignedReports > 0 ? 'orange' : 'gray'}-600 text-xl`} />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Unassigned Reports</p>
                  <p className={`text-2xl font-bold ${unassignedReports > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {reportsLoading ? (
                      <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      unassignedReports
                    )}
                  </p>
                  {unassignedReports > 0 && (
                    <p className="text-xs text-orange-500 font-medium">Needs attention</p>
                  )}
                </div>
              </div>
              <div className="relative">
                <FaInfoCircle className={`text-gray-300 group-hover:text-${unassignedReports > 0 ? 'orange' : 'gray'}-600 cursor-help transition-colors`} />
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                  Reports not yet assigned to any station
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <label htmlFor="search-stations" className="sr-only">Search police stations</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="search-stations"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#123F7B] focus:border-transparent transition-all"
                  placeholder="Search stations by name, city, or address..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-describedby="search-help"
                />
              </div>
              {searchQuery && (
                <p id="search-help" className="text-sm text-gray-500 mt-2" role="status" aria-live="polite">
                  Found {filteredStations.length} of {totalStations} stations
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600" role="status" aria-live="polite">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#123F7B] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    Loading stations...
                  </span>
                ) : (
                  `${filteredStations.length} station${filteredStations.length !== 1 ? 's' : ''}`
                )}
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-[#123F7B] hover:text-[#0f2f5a] font-medium focus:outline-none focus:ring-2 focus:ring-[#123F7B] focus:ring-offset-2 rounded-md px-2 py-1"
                  aria-label="Clear search"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full" role="table" aria-label="Police stations management table">
              <thead className="bg-[#123F7B] text-white">
                <tr>
                  <th scope="col" className="py-3 px-4 text-left font-semibold">Name</th>
                  <th scope="col" className="py-3 px-4 text-left font-semibold">Address</th>
                  <th scope="col" className="py-3 px-4 text-left font-semibold">
                    <div className="flex items-center gap-2">
                      Reports
                      <div className="relative group">
                        <FaInfoCircle className="text-white/70 hover:text-white cursor-help text-sm" aria-hidden="true" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                          Number of reports assigned to this station
                        </div>
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="py-3 px-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-[#123F7B] border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                        <span>Loading police stations...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <FaBuilding className="text-4xl text-gray-300" aria-hidden="true" />
                        <div>
                          <p className="font-medium">No police stations found</p>
                          {searchQuery ? (
                            <p className="text-sm mt-1">Try adjusting your search terms</p>
                          ) : (
                            <p className="text-sm mt-1">Click "Add Station" to create your first police station</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStations.map((station) => {
                    const reportCount = stationStats.find((s) => s._id === station._id)?.reportCount || 0;
                    return (
                      <tr key={station._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900">{station.name}</div>
                          <div className="text-sm text-gray-500 mt-1">ID: {station._id.slice(-8)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-900">
                            {[
                              station.address?.streetAddress,
                              station.address?.barangay,
                              station.address?.city
                            ].filter(Boolean).join(', ') || 'No address provided'}
                          </div>
                          {station.address?.zipCode && (
                            <div className="text-sm text-gray-500 mt-1">ZIP: {station.address.zipCode}</div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              reportCount === 0 
                                ? 'bg-gray-100 text-gray-700' 
                                : reportCount < 5 
                                  ? 'bg-green-100 text-green-700' 
                                  : reportCount < 10 
                                    ? 'bg-yellow-100 text-yellow-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                              {reportCount} report{reportCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleEdit(station)}
                              disabled={updateLoading}
                              aria-label={`Edit ${station.name}`}
                            >
                              <FaEdit className="text-xs" aria-hidden="true" /> 
                              Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDelete(station)}
                              disabled={deleteLoading}
                              aria-label={`Delete ${station.name}`}
                            >
                              <FaTrash className="text-xs" aria-hidden="true" /> 
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-gray-900">Quick Summary</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>📊 {totalStations} police stations total</span>
                <span>📋 {totalReports} reports in system</span>
                <span>✅ {totalAssignedReports} reports assigned</span>
                {unassignedReports > 0 && (
                  <span className="text-orange-600 font-medium">⚠️ {unassignedReports} reports need assignment</span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>💡 Tip: Regular monitoring ensures efficient case management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <PoliceStationModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create Police Station"
        onSubmit={handleCreate}
        submitLoading={createLoading}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Edit Modal */}
      <PoliceStationModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStation(null);
          resetForm();
        }}
        title="Edit Police Station"
        onSubmit={handleUpdate}
        submitLoading={updateLoading}
        formData={formData}
        setFormData={setFormData}
      />
    </AdminLayout>
  );
};

export default IndexPolice;