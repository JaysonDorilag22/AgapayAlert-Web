// filepath: /c:/agapayalert/AgapayAlert-Web/agapayalert/src/pages/Reports/ReportMainPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUnderInvestigationReports } from '../../redux/actions/reportActions';
import { format, differenceInDays, differenceInHours  } from 'date-fns';
import { FaSearch, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logowhite from '../../assets/AGAPAYALERTwhite.svg';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../../components/ui/hover-card';
import {motion} from 'framer-motion';

const ReportMainPage = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((state) => state.reports);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUnderInvestigationReports());
    }
  }, [dispatch, isAuthenticated]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Perform search action here if needed
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedReports = [...reports].sort((a, b) => {
    console.log(`lastSeenDate A: ${a.personInvolved.lastSeenDate}`);
    console.log(`lastSeenDate B: ${b.personInvolved.lastSeenDate}`);
    
    const dateA = new Date(a.personInvolved.lastSeenDate);
    const dateB = new Date(b.personInvolved.lastSeenDate);
    console.log(`Comparing ${dateA} and ${dateB}`);
    if (sortOption === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const filteredReports = sortedReports.filter((report) =>
    `${report.personInvolved.firstName} ${report.personInvolved.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        <div className="Container bg-[#123F7B] h-2/6 w-full rounded-sf overflow-hidden content-center shadow-lg px-8 py-2">
          <div className='grid grid-cols-2 justify-between gap-4'>
            <div className='grid grid-row-3 gap-6 justify-start'>
              <div className='pl-16 text-wrap w-full max-w-xl'>
                <h1 className='text-4xl font-extrabold text-white tracking-wide'>Are you looking for someone?</h1>
              </div>
              <div className='pl-16 w-full'>
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#123F7B] focus:border-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 bg-[#123F7B] text-white px-4 py-2 rounded-full">
                      <FaSearch />
                    </button>
                  </form>
              </div>
              <div className='flex flex-row pl-16 w-full'>
                <p className='text-md font-light text-white'>Haven't found them yet?</p>
                <Link to="/" className="text-[#D46A79] text-md font-base pl-1">Report here.</Link>
              </div>
            </div>
            <div className='relative'>
              <img src={logowhite} className='absolute overflow-visible object-cover h-full w-full'/>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full px-8 pt-4">
          <div className="flex flex-col justify-start pl-16">
          <h1 className="text-2xl font-bold">Reports</h1>
          </div>
          <div className="flex flex-col justify-end pr-16"> 
            <div className="flex flex-row place-items-center">
              <label htmlFor="sort" className="mr-2">Sort by:</label>
              <select id="sort" value={sortOption} onChange={handleSortChange} className="border border-[#123F7B] rounded-full px-2 py-1">
                <option value="newest" className='border border-[#123F7B] rounded-full px-2 py-1'>Newest</option>
                <option value="oldest" className='border border-[#123F7B] rounded-full px-2 py-1'>Oldest</option>
              </select>
            </div>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {filteredReports && filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredReports.map((report) => (
              <motion.div
              key={report._id}
              className="bg-[#123F7B]/5 p-4 rounded-md shadow-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className='relative'>
                <img src={report.personInvolved.mostRecentPhoto.url} alt={`${report.personInvolved.firstName} ${report.personInvolved.lastName}`} className="w-full h-48 object-cover rounded-3xl" />
                <div className='absolute bottom-4 left-2 bg-white px-2 py-2 rounded-md border border-[#D46A79]'>
                  <p className='text-[#D46A79] text-xs font-base'>{report.type}</p>
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <HoverCard>
                    <HoverCardTrigger>
                      <p className="cursor-context-menu text-[#D46A79] text-sm font-extralight flex items-center"><FaClock className="mr-1" /> {timeSinceLastSeen(report.personInvolved.lastSeenDate)}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-[#123F7B] text-xs font-extralight">Last seen: {formatDateTime(report.personInvolved.lastSeenDate, report.personInvolved.lastSeentime)}</p>
                    </HoverCardContent>
                </HoverCard>
                <h2 className="text-2xl font-semibold">{`${report.personInvolved.firstName} ${report.personInvolved.lastName}`}</h2>
                <HoverCard>
                    <HoverCardTrigger>
                      <p className="cursor-context-menu text-[#123F7B] text-sm font-light flex items-center pb-2"><FaMapMarkerAlt className="mr-1" /> {report.personInvolved.lastKnownLocation}</p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-[#123F7B] text-xs font-extralight place-self-center">Last known location</p>
                    </HoverCardContent>
                </HoverCard>
              </div>
              <div className="pt-4">
                <div className="flex flex-row justify-start space-x-2 place-items-center">
                  <div className=''>
                    <img src={report.reporter?.avatar?.url} alt='Missing' className="h-10 w-10 rounded-full" />
                  </div>
                  <div className='flex flex-col space-y-0 place-items-center'>
                    <p className="text-xs font-semibold">{report.reporter?.firstName} {report.reporter?.lastName}</p>
                    <HoverCard>
                      <HoverCardTrigger>
                      <p className="cursor-context-menu text-[#123F7B] text-xs font-extralight">{formatDateTime(report.createdAt)}</p>
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
      )  : (
          !loading && <p>No reports found.</p>
        )}
      </div>

    </div>
  );
};

export default ReportMainPage;