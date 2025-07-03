import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOfficerRankings } from '@/redux/actions/dashboardActions';
import { FaTrophy, FaMedal, FaStar, FaChartLine, FaFilter, FaDownload, FaSort, FaBullseye } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown, MdOutlineSpeed, MdOutlineAssignment } from 'react-icons/md';
import { BiTime } from 'react-icons/bi';
import { BsAward, BsBarChart } from 'react-icons/bs';

const OfficerRankings = () => {
  const dispatch = useDispatch();
  const { officerRankings, loading, error } = useSelector((state) => ({
    officerRankings: state.dashboard.officerRankings,
    loading: state.dashboard.loading.rankings,
    error: state.dashboard.error.rankings
  }));
  
  // Get current user info for role-based access control
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.roles?.[0] || 'user';
  const userCity = user?.address?.city;
  const userId = user?._id;
  
  const [filters, setFilters] = useState({
    sortBy: 'performanceScore',
    sortOrder: 'desc',
    city: userRole === 'police_admin' ? userCity || '' : '', // Pre-set city for police admin
    policeStation: '',
    reportType: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  // Role-based access control
  const hasAccess = () => {
    return ['super_admin', 'police_admin'].includes(userRole);
  };

  const canViewOfficer = (officer) => {
    if (userRole === 'super_admin') return true;
    if (userRole === 'police_admin') return officer.address?.city === userCity;
    if (userRole === 'police_officer') return officer._id === userId;
    return false;
  };

  const getFilteredOfficers = (officers) => {
    if (!officers) return [];
    
    // Only apply role-based access control since backend handles police station filtering
    return officers.filter(officer => canViewOfficer(officer));
  };

  // Get officers data early so we can use it in filter functions
  const getCurrentOfficers = () => officerRankings?.officers || [];

  const exportToCSV = () => {
    const filteredOfficers = getFilteredOfficers(getCurrentOfficers());
    const headers = [
      'Rank',
      'Officer Name',
      'City',
      'Police Station',
      'Performance Score',
      'Total Assigned',
      'Resolved',
      'Under Investigation',
      'Pending',
      'Resolution Rate (%)',
      'Avg Resolution Time (h)',
      'Workload Efficiency',
      'Specialization Type',
      'Specialization Rate (%)'
    ];

    const csvData = filteredOfficers.map((officer, index) => [
      index + 1,
      `${officer.firstName} ${officer.lastName}`,
      officer.address?.city || '',
      officer.policeStation?.name || '',
      officer.performanceScore,
      officer.totalAssigned,
      officer.resolved,
      officer.underInvestigation,
      officer.pending,
      officer.resolutionRate,
      officer.avgResolutionTime,
      officer.workloadEfficiency,
      officer.specialization?.type || 'None',
      officer.specialization?.rate || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `officer_rankings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCityOptions = () => {
    const allCities = ["Taguig", "Makati", "Pasay", "Paranaque", "Pateros"];
    
    if (userRole === 'super_admin') {
      return [
        { value: "", label: "All Cities" },
        ...allCities.map(city => ({ value: city, label: city }))
      ];
    } else if (userRole === 'police_admin' && userCity) {
      return [{ value: userCity, label: userCity }];
    }
    return [];
  };

  const getPoliceStationOptions = () => {
    // Extract unique police stations from officers data based on current city filter
    const currentCity = filters.city || userCity;
    const officers = getCurrentOfficers();
    const filteredByCity = officers.filter(officer => 
      !currentCity || officer.address?.city === currentCity
    );
    
    const stations = [...new Set(
      filteredByCity
        .map(officer => officer.policeStation?.name)
        .filter(station => station)
    )].sort();

    const options = [{ value: "", label: "All Stations" }];
    
    // Add stations based on role
    if (userRole === 'super_admin') {
      return [...options, ...stations.map(station => ({ value: station, label: station }))];
    } else if (userRole === 'police_admin') {
      // Police admin can see all stations in their city
      return [...options, ...stations.map(station => ({ value: station, label: station }))];
    }
    return options;
  };

  const fetchRankings = async () => {
    const queryParams = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
    );
    
    // Map policeStation to policeStationName for backend compatibility
    if (queryParams.policeStation) {
      queryParams.policeStationName = queryParams.policeStation;
      delete queryParams.policeStation;
    }
    
    console.log('Fetching officer rankings with params:', queryParams);
    const result = await dispatch(getOfficerRankings(queryParams));
    console.log('Officer rankings result:', result?.success ? 'Success' : 'Failed');
  };

  useEffect(() => {
    fetchRankings();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key, value) => {
    // Prevent police admins from changing city filter
    if (key === 'city' && userRole === 'police_admin') {
      return;
    }
    
    // Reset police station when city changes
    if (key === 'city') {
      setFilters(prev => ({ ...prev, [key]: value, policeStation: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { color: 'bg-green-500', text: 'Excellent', icon: <FaTrophy /> };
    if (score >= 70) return { color: 'bg-blue-500', text: 'Good', icon: <FaMedal /> };
    if (score >= 50) return { color: 'bg-yellow-500', text: 'Average', icon: <FaStar /> };
    return { color: 'bg-red-500', text: 'Needs Improvement', icon: <BsBarChart /> };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-yellow-500" />;
    if (index === 1) return <FaMedal className="text-gray-400" />;
    if (index === 2) return <BsAward className="text-orange-500" />;
    return <span className="text-[#123F7B] font-bold">#{index + 1}</span>;
  };

  if (!hasAccess()) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-2">Access Denied</div>
        <div className="text-gray-600 text-sm mb-4 text-center max-w-md">
          {userRole === 'police_officer' 
            ? "Police officers can view their individual performance through the Profile section. Rankings are only available to administrators." 
            : "You don't have permission to access officer rankings. Contact your administrator for access."
          }
        </div>
        {userRole === 'police_officer' && (
          <button 
            onClick={() => window.location.href = '/profile'} // Navigate to profile
            className="bg-[#123F7B] text-white px-4 py-2 rounded-lg hover:bg-[#0f2f5a] transition-colors"
          >
            View My Performance
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#123F7B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-lg mb-2">Error loading officer rankings</div>
        <div className="text-gray-600 text-sm mb-4">{error}</div>
        <button 
          onClick={() => fetchRankings()}
          className="bg-[#123F7B] text-white px-4 py-2 rounded-lg hover:bg-[#0f2f5a]"
        >
          Retry
        </button>
      </div>
    );
  }

  const officers = officerRankings?.officers || [];
  const filteredOfficers = getFilteredOfficers(officers);
  const departmentSummary = officerRankings?.departmentSummary || {};

  console.log('Officer Rankings Component State:', { 
    loading, 
    error, 
    officers: officers.length,
    filteredOfficers: filteredOfficers.length,
    userRole,
    userCity,
    filters
  });

  // If not loading, not in error, but no data, show a message
  if (!loading && !error && filteredOfficers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 text-lg mb-2">No officer data available</div>
        <div className="text-gray-400 text-sm mb-4">Make sure officers are assigned to cases</div>
        <button 
          onClick={() => fetchRankings()}
          className="bg-[#123F7B] text-white px-4 py-2 rounded-lg hover:bg-[#0f2f5a]"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#123F7B] to-[#1e4d72] rounded-lg p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold font-['Poppins']">Officer Performance Rankings</h1>
            <p className="text-blue-100 mt-1">
              {userRole === 'super_admin' && 'Comprehensive performance analytics and rankings'}
              {userRole === 'police_admin' && `Performance analytics for ${userCity || 'your city'}`}
            </p>
            {userRole === 'police_admin' && userCity && (
              <p className="text-blue-200 text-sm mt-1">
                📍 Viewing data for: {userCity}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <FaFilter /> Filters
            </button>
            <button 
              onClick={exportToCSV}
              disabled={filteredOfficers.length === 0}
              className="flex items-center gap-2 bg-[#D46A79] hover:bg-[#c55a6a] disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors text-white"
            >
              <FaDownload /> Export ({filteredOfficers.length})
            </button>
          </div>
        </div>

        {/* Department Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MdOutlineAssignment className="text-2xl" />
              <div>
                <p className="text-sm opacity-80">Total Officers</p>
                <p className="text-xl font-bold">{departmentSummary.totalOfficers || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaBullseye className="text-2xl" />
              <div>
                <p className="text-sm opacity-80">Avg Resolution Rate</p>
                <p className="text-xl font-bold">{departmentSummary.avgResolutionRate || 0}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <BiTime className="text-2xl" />
              <div>
                <p className="text-sm opacity-80">Avg Resolution Time</p>
                <p className="text-xl font-bold">{departmentSummary.avgResolutionTime || 0}h</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-2xl" />
              <div>
                <p className="text-sm opacity-80">Top Performer</p>
                <p className="text-sm font-bold truncate">
                  {departmentSummary.topPerformer?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#123F7B]">Filter & Sort Options</h3>
            {userRole === 'police_admin' && (
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
                🔒 City filter locked to your jurisdiction
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent"
              >
                <option value="performanceScore">Performance Score</option>
                <option value="resolutionRate">Resolution Rate</option>
                <option value="totalAssigned">Total Cases</option>
                <option value="avgResolutionTime">Avg Resolution Time</option>
                <option value="workloadEfficiency">Workload Efficiency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent"
              >
                <option value="desc">Highest to Lowest</option>
                <option value="asc">Lowest to Highest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                disabled={userRole === 'police_admin'} // Disable for police admins
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent ${
                  userRole === 'police_admin' ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                {getCityOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Police Station</label>
              <select
                value={filters.policeStation}
                onChange={(e) => handleFilterChange('policeStation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent"
              >
                {getPoliceStationOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={filters.reportType}
                onChange={(e) => handleFilterChange('reportType', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#123F7B] focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Missing">Missing</option>
                <option value="Found">Found</option>
                <option value="Kidnapped">Kidnapped</option>
                <option value="Abducted">Abducted</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(filters.city || filters.policeStation || filters.reportType || filters.startDate || filters.endDate) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#123F7B]" />
              <span className="text-sm font-medium text-[#123F7B]">Active Filters:</span>
              <div className="flex flex-wrap gap-2">
                {filters.city && (
                  <span className="bg-[#123F7B] text-white text-xs px-2 py-1 rounded-full">
                    City: {filters.city}
                  </span>
                )}
                {filters.policeStation && (
                  <span className="bg-[#123F7B] text-white text-xs px-2 py-1 rounded-full">
                    Station: {filters.policeStation}
                  </span>
                )}
                {filters.reportType && (
                  <span className="bg-[#123F7B] text-white text-xs px-2 py-1 rounded-full">
                    Type: {filters.reportType}
                  </span>
                )}
                {filters.startDate && (
                  <span className="bg-[#123F7B] text-white text-xs px-2 py-1 rounded-full">
                    From: {filters.startDate}
                  </span>
                )}
                {filters.endDate && (
                  <span className="bg-[#123F7B] text-white text-xs px-2 py-1 rounded-full">
                    To: {filters.endDate}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setFilters({
                sortBy: 'performanceScore',
                sortOrder: 'desc',
                city: userRole === 'police_admin' ? userCity || '' : '',
                policeStation: '',
                reportType: '',
                startDate: '',
                endDate: ''
              })}
              className="text-xs text-gray-600 hover:text-[#123F7B] transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Top Performers Podium */}
      {filteredOfficers.length >= 3 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#123F7B] mb-6 text-center">🏆 Top Performers</h3>
          <div className="flex justify-center items-end gap-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src={filteredOfficers[1]?.avatar?.url || '/api/placeholder/80/80'}
                  alt={filteredOfficers[1]?.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="bg-gray-100 p-4 rounded-lg h-24 flex flex-col justify-center">
                <FaMedal className="text-2xl text-gray-400 mx-auto mb-1" />
                <p className="font-bold text-sm">{filteredOfficers[1]?.firstName} {filteredOfficers[1]?.lastName}</p>
                <p className="text-xs text-gray-600">{filteredOfficers[1]?.performanceScore} pts</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src={filteredOfficers[0]?.avatar?.url || '/api/placeholder/96/96'}
                  alt={filteredOfficers[0]?.firstName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg h-28 flex flex-col justify-center border-2 border-yellow-300">
                <FaTrophy className="text-3xl text-yellow-500 mx-auto mb-1" />
                <p className="font-bold">{filteredOfficers[0]?.firstName} {filteredOfficers[0]?.lastName}</p>
                <p className="text-sm text-yellow-700">{filteredOfficers[0]?.performanceScore} pts</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src={filteredOfficers[2]?.avatar?.url || '/api/placeholder/80/80'}
                  alt={filteredOfficers[2]?.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="bg-orange-50 p-4 rounded-lg h-24 flex flex-col justify-center">
                <BsAward className="text-2xl text-orange-500 mx-auto mb-1" />
                <p className="font-bold text-sm">{filteredOfficers[2]?.firstName} {filteredOfficers[2]?.lastName}</p>
                <p className="text-xs text-orange-700">{filteredOfficers[2]?.performanceScore} pts</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[#123F7B] mb-4">Performance Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Excellent', count: departmentSummary.performanceDistribution?.excellent || 0, color: 'bg-green-500', icon: <FaTrophy /> },
            { label: 'Good', count: departmentSummary.performanceDistribution?.good || 0, color: 'bg-blue-500', icon: <FaMedal /> },
            { label: 'Average', count: departmentSummary.performanceDistribution?.average || 0, color: 'bg-yellow-500', icon: <FaStar /> },
            { label: 'Needs Improvement', count: departmentSummary.performanceDistribution?.needsImprovement || 0, color: 'bg-red-500', icon: <FaChartLine /> }
          ].map((item, index) => (
            <div key={index} className="text-center p-4 rounded-lg border border-gray-100">
              <div className={`${item.color} text-white rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center`}>
                {item.icon}
              </div>
              <p className="font-bold text-lg">{item.count}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Officers Rankings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#123F7B]">Officer Rankings</h3>
            <div className="text-sm text-gray-600">
              Showing {filteredOfficers.length} 
              {userRole === 'police_admin' ? ` officers in ${userCity}` : ' officers'}
              {filters.policeStation && ` from ${filters.policeStation}`}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer</th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
                <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
                <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOfficers.map((officer, index) => {
                const badge = getPerformanceBadge(officer.performanceScore);
                return (
                  <tr key={officer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={officer.avatar?.url || '/api/placeholder/40/40'}
                          alt={officer.firstName}
                          className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {officer.firstName} {officer.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{officer.rank || 'Officer'}</p>
                          <p className="text-xs text-gray-400 truncate">{officer.policeStation?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color} w-fit`}>
                          {badge.icon}
                          {officer.performanceScore}
                        </span>
                        <span className="text-xs text-gray-500">
                          {officer.performancePercentile}th %ile
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{officer.totalAssigned}</p>
                        <div className="flex gap-1 text-xs">
                          <span className="text-green-600">{officer.resolved}R</span>
                          <span className="text-blue-600">{officer.underInvestigation}I</span>
                          <span className="text-yellow-600">{officer.pending}P</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{officer.resolutionRate}%</p>
                        <p className="text-xs text-gray-500">{officer.avgResolutionTime}h avg</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MdOutlineSpeed className="text-[#123F7B] text-sm" />
                        <div className="text-sm">
                          <span className="font-medium">{officer.workloadEfficiency}</span>
                          <span className="text-xs text-gray-500 block">cases/mo</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {officer.specialization?.type ? (
                        <div className="text-sm">
                          <p className="font-medium text-[#123F7B] truncate">{officer.specialization.type}</p>
                          <p className="text-xs text-gray-500">{officer.specialization.rate}% rate</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No specialization</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOfficer(officer)}
                        className="text-[#123F7B] hover:text-[#0f2f5a] text-xs font-medium px-2 py-1 rounded border border-[#123F7B] hover:bg-[#123F7B] hover:text-white transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Officer Detail Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedOfficer.avatar?.url || '/api/placeholder/80/80'}
                  alt={selectedOfficer.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-[#123F7B]">
                    {selectedOfficer.firstName} {selectedOfficer.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedOfficer.rank || 'Officer'}</p>
                  <p className="text-sm text-gray-500">{selectedOfficer.policeStation?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfficer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Detailed metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedOfficer.performanceScore}</p>
                <p className="text-sm text-blue-700">Performance Score</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{selectedOfficer.resolutionRate}%</p>
                <p className="text-sm text-green-700">Resolution Rate</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">{selectedOfficer.avgResolutionTime}h</p>
                <p className="text-sm text-yellow-700">Avg Resolution Time</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{selectedOfficer.workloadEfficiency}</p>
                <p className="text-sm text-purple-700">Cases/Month</p>
              </div>
            </div>

            {/* Case Type Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#123F7B] mb-3">Case Type Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(selectedOfficer.byType || {}).map(([type, data]) => (
                  <div key={type} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-sm">{type}</p>
                    <p className="text-xs text-gray-600">
                      {data.resolved}/{data.assigned} cases
                    </p>
                    <p className="text-xs text-[#123F7B]">
                      {Math.round((data.resolved / data.assigned) * 100)}% rate
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerRankings;
