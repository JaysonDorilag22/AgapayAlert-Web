import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReportFeed } from '../../redux/actions/reportActions';
import { format, differenceInDays, differenceInHours } from 'date-fns';
import { FaSearch, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logowhite from '../../assets/AGAPAYALERTwhite.svg';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../components/ui/hover-card';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import IndexCreateReport from '../../components/CreateReport/IndexCreateReport';

const ReportMainPage = () => {
  const dispatch = useDispatch();
  const { feed, loading, error } = useSelector((state) => state.reports);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    searchName: '',
    city: '',
    type: '',
  });
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        const result = await dispatch(getReportFeed({ page, limit: 10, ...searchParams }));
        console.log("Fetched Reports:", result.data);
      };

      fetchData();
    }
  }, [dispatch, isAuthenticated, page, searchParams]);

  const formatDateTime = (date, time) => {
    const dateStr = format(new Date(date), 'MMM dd, yyyy');
    let timeStr = '';
    if (time) {
      try {
        timeStr = format(new Date(`2000-01-01T${time}`), 'hh:mm a');
      } catch (error) {
        console.error('Invalid time value:', time);
      }
    }
    return timeStr ? `${dateStr} at ${timeStr}` : dateStr;
  };

  const timeSinceLastSeen = (date) => {
    const lastSeen = new Date(date);
    const now = new Date();
    const days = differenceInDays(now, lastSeen);
    const hours = differenceInHours(now, lastSeen) % 24;
    return `${days} days and ${hours} hours ago`;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    setSearchParams({
      ...searchParams,
      searchName: e.target.search.value,
    });
  };

  const handleFilterChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

    const handleReportClick = (reportId) => {
    setSelectedReportId(reportId);
  };
    const handleCloseModal = () => {
    setSelectedReportId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-4xl font-bold mb-4">Sign in to view the list of reports</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="h-full w-full place-items-center">
        <div className="Container bg-[#123F7B] h-3/6 lg:h-2/6 w-full rounded-sf overflow-hidden content-center shadow-lg px-8 py-2">
          <div className='grid grid-cols-2 justify-between gap-4'>
            <div className='grid grid-row-3 gap-6 justify-start pl-16'>
              <div className='text-wrap w-full max-w-xl'>
                <h1 className='text-xl lg:text-4xl font-extrabold text-white tracking-wide'>Are you looking for someone?</h1>
              </div>
              <div className='w-full'>
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by First Name or Last Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#123F7B] focus:border-white"
                  />
                  <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 bg-[#123F7B] text-white px-4 py-2 rounded-full">
                    <FaSearch />
                  </button>
                </form>
              </div>
              <div className='flex flex-row w-full'>
                <p className='text-md font-light text-white'>Haven't found them yet?</p>
                <button onClick={() => handleReportClick('new')} className="flex items-center justify-center">
                    <p className="text-[#D46A79] text-md font-base pl-1">Report here.</p>
                </button>
              </div>
            </div>
            <div className='relative'>
              <img src={logowhite} className='absolute hidden lg:inline overflow-visible object-cover h-full w-full' />
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full px-8 pt-4 space-x-2">
          <div className="flex flex-col justify-start pl-4 lg:pl-16">
            <h1 className="text-2xl font-bold">List of Missing Persons</h1>
          </div>
          <div className="flex flex-col justify-end pr-4lg:pr-16">
            <div className="flex flex-col lg:flex-row items-end lg:place-items-center space-y-2 lg:space-y-0">
              <label htmlFor="city" className="mr-2">City:</label>
              <select id="city" name="city" value={searchParams.city} onChange={handleFilterChange} className="border border-[#123F7B] rounded-full px-2 py-1">
                <option value="">All</option>
                <option value="Taguig">Taguig</option>
                {/* Add more cities as needed */}
              </select>
              <label htmlFor="type" className="mr-2 ml-4">Type:</label>
              <select id="type" name="type" value={searchParams.type} onChange={handleFilterChange} className="border border-[#123F7B] rounded-full px-2 py-1">
                <option value="">All</option>
                <option value="Missing">Missing</option>
                <option value="Abducted">Abducted</option>
                <option value="Kidnapped">Kidnapped</option>
                <option value="Hit-and-Run">Hit-and-Run</option>
                {/* Add more types as needed */}
              </select>
            </div>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {feed.reports && feed.reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {feed.reports.map((report) => (
              <motion.div
                key={report.id}
                className="bg-[#123F7B]/5 p-4 rounded-md shadow-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
              >
                <div className='relative'>
                  <img src={report.photo} alt={report.personName} className="w-full h-48 object-cover rounded-3xl" />
                  <div className='absolute bottom-4 left-2 bg-white px-2 py-2 rounded-md border border-[#D46A79]'>
                    <p className='text-[#D46A79] text-xs font-base'>{report.type}</p>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <HoverCard>
                    <HoverCardTrigger>
                      <p className="cursor-context-menu text-[#D46A79] text-sm font-extralight flex items-center"><FaClock className="mr-1" /> {timeSinceLastSeen(report.lastSeen.date)}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-[#123F7B] text-xs font-extralight">Last seen: {formatDateTime(report.lastSeen.date, report.lastSeen.time)}</p>
                    </HoverCardContent>
                  </HoverCard>
                  <h2 className="text-2xl font-semibold">{report.personName}</h2>
                  <HoverCard>
                    <HoverCardTrigger>
                      <p className="cursor-context-menu text-[#123F7B] text-sm font-light flex items-center pb-2"><FaMapMarkerAlt className="mr-1" /> {report.lastKnownLocation}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-[#123F7B] text-xs font-extralight place-self-center">Last known location</p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="pt-4">
                  <div className="flex flex-row justify-start space-x-2 place-items-center">
                    <div className=''>
                      <img src={report.reporter?.avatar} alt='Missing' className="h-10 w-10 rounded-full" />
                    </div>
                    <div className='flex flex-col space-y-0 place-items-center'>
                      <p className="text-xs font-semibold">{report.reporter?.name}</p>
                      <HoverCard>
                        <HoverCardTrigger>
                          <p className="cursor-context-menu text-[#123F7B] text-xs font-extralight">{formatDateTime(report.reportedAt)}</p>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <p className="text-[#123F7B] text-xs font-extralight place-self-center">Date reported</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !loading && <p>No reports found.</p>
        )}
        <div className="flex justify-center mt-4 mb-24 pb-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {feed.currentPage} of {feed.totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === feed.totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      {selectedReportId && (
        <IndexCreateReport
          reportId={selectedReportId}
          onClose={handleCloseModal}
          user={user} // Pass user as a prop
        />
      )}
    </div>
  );
};

export default ReportMainPage;