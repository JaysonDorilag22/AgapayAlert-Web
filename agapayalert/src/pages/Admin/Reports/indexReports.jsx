import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../../redux/actions/reportActions";
import AdminLayout from "../../../layouts/AdminLayout";
import ReportsTable from "./ReportTable/ReportsTable";
import axios from "axios";
import { server } from "../../../redux/store";

const IndexReports = () => {
  const dispatch = useDispatch();
  const { reports, totalPages, currentPage, totalReports, loading } = useSelector((state) => state.reports);
  const user = useSelector((state) => state.auth.user);
  
  // Get user role from roles array
  const userRole = user?.roles?.[0]; // Get first role from roles array
  
  // Initialize filters with role-based defaults
  const getInitialFilters = () => {
    const baseFilters = { page: 1, limit: 10 };
    
    console.log('=== DEBUG: Getting Initial Filters ===');
    console.log('- userRole:', userRole);
    console.log('- user?.city:', user?.city);
    console.log('- user?._id:', user?._id);
    
    if (userRole === 'police_admin' && user?.city) {
      // Police Admin: locked to their city
      const adminFilters = { ...baseFilters, city: user.city };
      console.log('🔒 Police Admin initial filters:', adminFilters);
      return adminFilters;
    } else if (userRole === 'police_officer' && user?._id) {
      // Police Officer: only their own reports
      const officerFilters = { ...baseFilters, assignedOfficerId: user._id };
      console.log('🔒 Police Officer initial filters:', officerFilters);
      return officerFilters;
    }
    
    console.log('👑 Super Admin initial filters:', baseFilters);
    return baseFilters;
  };
  
  const [filters, setFilters] = useState(() => getInitialFilters());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if user data is not yet loaded
      if (!user || !user.roles || !userRole) {
        console.log('⏳ User data not yet loaded, skipping fetch...');
        return;
      }
      
      // Debug: Log user data to see what we're working with
      console.log('=== DEBUG: User Role and Data ===');
      console.log('- Raw user object:', user);
      console.log('- User roles array:', user?.roles);
      console.log('- First role (userRole):', userRole);
      console.log('- User city:', user?.city);
      console.log('- User ID:', user?._id);
      console.log('- Is police admin?', userRole === 'police_admin');
      console.log('- Is police officer?', userRole === 'police_officer');
      
      // Apply role-based filtering before dispatching
      let roleBasedFilters = { ...filters };
      
      if (userRole === 'police_admin' && user?.city) {
        // Police Admin: ensure city is always set to their city
        roleBasedFilters.city = user.city;
        console.log('🔒 Police Admin detected - forcing city filter to:', user.city);
      } else if (userRole === 'police_officer' && user?._id) {
        // Police Officer: ensure only their reports are fetched
        roleBasedFilters.assignedOfficerId = user._id;
        console.log('🔒 Police Officer detected - forcing assignedOfficerId filter to:', user._id);
      }
      
      const cleanedFilters = Object.fromEntries(
        Object.entries(roleBasedFilters).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
      );
      
      console.log('📋 Final filters being sent to API:', cleanedFilters);
      
      const result = await dispatch(getReports(cleanedFilters));
      
      console.log('=== DEBUG: API Call Result ===');
      console.log('- Success:', result?.success);
      console.log('- Data keys:', result?.data ? Object.keys(result.data) : 'none');
      console.log('- Reports count:', result?.data?.reports?.length || 0);
      console.log('- Total reports:', result?.data?.totalReports || 0);
      console.log('- Has reports in result:', !!result?.data?.reports && result.data.reports.length > 0);
    };
    fetchData();
    console.log("Current filters: ", filters);
  }, [dispatch, filters, userRole, user?.city, user?._id, user]);

  // Reinitialize filters when user data becomes available
  useEffect(() => {
    if (user && userRole && user.roles && user.roles.length > 0) {
      console.log('=== DEBUG: User data changed, reinitializing filters ===');
      console.log('- userRole:', userRole);
      console.log('- user?.city:', user?.city);
      console.log('- user?._id:', user?._id);
      
      const newInitialFilters = getInitialFilters();
      console.log('- New initial filters:', newInitialFilters);
      
      // Only update filters if they're different from current ones
      const currentFiltersString = JSON.stringify(filters);
      const newFiltersString = JSON.stringify(newInitialFilters);
      
      if (currentFiltersString !== newFiltersString) {
        console.log('- Filters changed, updating...');
        setFilters(newInitialFilters);
      } else {
        console.log('- Filters unchanged, no update needed');
      }
    }
  }, [user, userRole]); // Re-run when user or userRole changes

  const handlePageChange = (page) => {
    setFilters((prevFilters) => ({ ...prevFilters, page }));
  };

  const handleFilterChange = (newFilters) => {
    console.log('=== DEBUG: Filter Change ===');
    console.log('- Original newFilters:', newFilters);
    console.log('- User role:', userRole);
    console.log('- User city:', user?.city);
    console.log('- User ID:', user?._id);
    
    // Apply role-based restrictions to filter changes
    let restrictedFilters = { ...newFilters };
    
    if (userRole === 'police_admin' && user?.city) {
      // Police Admin: cannot change city filter
      restrictedFilters.city = user.city;
      console.log('🔒 Police Admin - forcing city to:', user.city);
    } else if (userRole === 'police_officer' && user?._id) {
      // Police Officer: cannot change officer assignment
      restrictedFilters.assignedOfficerId = user._id;
      console.log('🔒 Police Officer - forcing assignedOfficerId to:', user._id);
    }
    
    console.log('- Final restrictedFilters:', restrictedFilters);
    
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...restrictedFilters,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleSearchChange = (query) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      query, // Use 'query' as the key for backend compatibility
      page: 1,
    }));
  };

  // Function to fetch ALL reports for export (without pagination)
  const handleFetchAllReports = useCallback(async (currentFilters) => {
    try {
      console.log('🚀 handleFetchAllReports called');
      console.log('📝 Original filters received:', JSON.stringify(currentFilters, null, 2));
      
      // Apply role-based filtering to export as well
      let roleBasedFilters = { ...currentFilters };
      
      if (userRole === 'police_admin' && user?.city) {
        // Police Admin: ensure city is set for export
        roleBasedFilters.city = user.city;
      } else if (userRole === 'police_officer' && user?._id) {
        // Police Officer: ensure only their reports are exported
        roleBasedFilters.assignedOfficerId = user._id;
      }
      
      // Create a copy of filters without pagination but preserve all other filters
      const exportFilters = { ...roleBasedFilters };
      delete exportFilters.page;
      delete exportFilters.limit;
      
      console.log('🧹 Cleaned filters (no page/limit):', JSON.stringify(exportFilters, null, 2));
      
      // First, try the normal getAllForExport flag
      let queryParams = new URLSearchParams({
        getAllForExport: 'true', // Special flag for backend
        // Preserve all current filters for the export
        ...(exportFilters.status && exportFilters.status !== 'all' && { status: exportFilters.status }),
        ...(exportFilters.type && exportFilters.type !== 'all' && { type: exportFilters.type }),
        ...(exportFilters.startDate && { startDate: exportFilters.startDate }),
        ...(exportFilters.endDate && { endDate: exportFilters.endDate }),
        ...(exportFilters.ageCategory && exportFilters.ageCategory !== 'all' && { ageCategory: exportFilters.ageCategory }),
        ...(exportFilters.city && exportFilters.city !== 'all' && { city: exportFilters.city }),
        ...(exportFilters.barangay && exportFilters.barangay !== 'all' && { barangay: exportFilters.barangay }),
        ...(exportFilters.policeStationId && exportFilters.policeStationId !== 'all' && { policeStationId: exportFilters.policeStationId }),
        ...(exportFilters.gender && exportFilters.gender !== 'all' && { gender: exportFilters.gender }),
        ...(exportFilters.assignedOfficerId && { assignedOfficerId: exportFilters.assignedOfficerId }),
        ...(exportFilters.query && { query: exportFilters.query }),
        ...(exportFilters.sortBy && { sortBy: exportFilters.sortBy }),
        ...(exportFilters.sortOrder && { sortOrder: exportFilters.sortOrder }),
      }).toString();

      let url = `${server}/report/getReports?${queryParams}`;
      console.log('📡 Making API call to:', url);
      console.log('🎯 Query parameters:', queryParams);

      let { data } = await axios.get(url, {
        withCredentials: true
      });

      let fetchedReports = data.data?.reports || [];
      console.log('📊 API Response structure:', {
        success: data.success,
        dataExists: !!data.data,
        reportsExists: !!data.data?.reports,
        reportsLength: fetchedReports.length,
        totalReports: data.data?.totalReports,
        totalCount: data.data?.totalCount,
        hasMorePages: data.data?.hasMorePages,
        message: data.message
      });
      
      // If the backend doesn't support getAllForExport properly, fetch all pages manually
      const totalReports = data.data?.totalReports || data.data?.totalCount || 0;
      if (fetchedReports.length < totalReports && fetchedReports.length > 0) {
        console.log('⚠️ Backend returned partial data, fetching all pages manually...');
        console.log(`📄 Need to fetch ${Math.ceil(totalReports / fetchedReports.length)} pages total`);
        
        const allReports = [...fetchedReports];
        const pageSize = fetchedReports.length; // Usually 10
        const totalPages = Math.ceil(totalReports / pageSize);
        
        // Fetch remaining pages
        for (let page = 2; page <= totalPages; page++) {
          console.log(`📄 Fetching page ${page} of ${totalPages}...`);
          
          const pageParams = new URLSearchParams({
            page: page.toString(),
            limit: pageSize.toString(),
            ...(exportFilters.status && exportFilters.status !== 'all' && { status: exportFilters.status }),
            ...(exportFilters.type && exportFilters.type !== 'all' && { type: exportFilters.type }),
            ...(exportFilters.startDate && { startDate: exportFilters.startDate }),
            ...(exportFilters.endDate && { endDate: exportFilters.endDate }),
            ...(exportFilters.ageCategory && exportFilters.ageCategory !== 'all' && { ageCategory: exportFilters.ageCategory }),
            ...(exportFilters.city && exportFilters.city !== 'all' && { city: exportFilters.city }),
            ...(exportFilters.barangay && exportFilters.barangay !== 'all' && { barangay: exportFilters.barangay }),
            ...(exportFilters.policeStationId && exportFilters.policeStationId !== 'all' && { policeStationId: exportFilters.policeStationId }),
            ...(exportFilters.gender && exportFilters.gender !== 'all' && { gender: exportFilters.gender }),
            ...(exportFilters.assignedOfficerId && { assignedOfficerId: exportFilters.assignedOfficerId }),
            ...(exportFilters.query && { query: exportFilters.query }),
            ...(exportFilters.sortBy && { sortBy: exportFilters.sortBy }),
            ...(exportFilters.sortOrder && { sortOrder: exportFilters.sortOrder }),
          }).toString();
          
          const pageUrl = `${server}/report/getReports?${pageParams}`;
          const pageResponse = await axios.get(pageUrl, { withCredentials: true });
          const pageReports = pageResponse.data.data?.reports || [];
          
          if (pageReports.length > 0) {
            allReports.push(...pageReports);
            console.log(`✅ Page ${page}: Added ${pageReports.length} reports (Total: ${allReports.length})`);
          } else {
            console.log(`⚠️ Page ${page}: No reports returned, stopping pagination`);
            break;
          }
        }
        
        fetchedReports = allReports;
        console.log(`🎉 Successfully fetched all ${fetchedReports.length} reports via pagination`);
      }
      
      if (fetchedReports.length === 0) {
        console.warn('⚠️ No reports returned from export fetch - this might indicate an issue');
        console.log('🔍 Full API response:', data);
      } else {
        console.log(`✅ Successfully fetched ${fetchedReports.length} reports for export`);
      }
      
      return fetchedReports;
    } catch (error) {
      console.error('❌ Error in handleFetchAllReports:', error);
      console.error('📋 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data
      });
      const message = error.response?.data?.msg || error.message;
      throw new Error(`Failed to fetch all reports: ${message}`);
    }
  }, [userRole, user?.city, user?._id]);

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ReportsTable
            reports={reports || []}
            totalPages={totalPages}
            currentPage={currentPage}
            totalReports={totalReports}
            loading={loading}
            user={user}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onFetchAllReports={handleFetchAllReports}
            filters={filters}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default IndexReports;