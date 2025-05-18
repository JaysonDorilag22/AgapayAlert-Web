import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tileblue from '../../assets/tilelogoblue.png';
import { IoLocationOutline } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GrInProgress } from "react-icons/gr";
import { FaUserCheck } from "react-icons/fa6";
import { PiDetectiveFill } from "react-icons/pi";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { formatDateToMonthYear } from '../../utils/dateUtils';
import ProfileLayout from '@/layouts/ProfileLayout';
import { getRoleDisplayName } from '@/utils/userroles';
import { getUserReports, getReportDetails } from '../../redux/actions/reportActions';

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending":
      return <GrInProgress className="text-yellow-500 text-md" />;
    case "Assigned":
      return <FaUserCheck className="text-blue-500 text-md" />;
    case "Under Investigation":
      return <PiDetectiveFill className="text-orange-400 text-md" />;
    case "Resolved":
      return <IoMdCheckmarkCircleOutline className="text-white text-md font-light" />;
    default:
      return <GrInProgress className="text-gray-400 text-md" />;
  }
};

const getStatusTooltip = (status) => {
  switch (status) {
    case "Pending":
      return "Pending: Waiting for review";
    case "Assigned":
      return "Assigned: Officer assigned";
    case "Under Investigation":
      return "Under Investigation: Case is being investigated";
    case "Resolved":
      return "Resolved: Report closed";
    default:
      return "Status unknown";
  }
};

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffDay > 0) {
    return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
  } else if (diffHr > 0) {
    const mins = diffMin % 60;
    return mins > 0
      ? `${diffHr} hour${diffHr > 1 ? "s" : ""} and ${mins} minute${mins > 1 ? "s" : ""} ago`
      : `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else {
    return "just now";
  }
}

const ProfileCard = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [userReports, setUserReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showAll, setShowAll] = useState(false);

    // Fetch user reports on mount
    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            const result = await dispatch(getUserReports({ limit: 100 }));
            setUserReports(result?.data?.reports || []);
            setLoading(false);
        };
        if (user?._id) fetchReports();
    }, [dispatch, user?._id]);

    // Fetch full details for a selected report
    const handleViewDetails = async (reportId) => {
        setLoading(true);
        const result = await dispatch(getReportDetails(reportId));
        setSelectedReport(result?.data || null);
        setLoading(false);
    };

    const handleCloseDetails = () => setSelectedReport(null);

    // Sort and slice for recent
    const sortedReports = [...userReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentReports = sortedReports.slice(0, 5);
    
    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          console.log('Copied to clipboard: ', text);
        }).catch((err) => {
          console.error('Failed to copy text: ', err);
        });
      };

    return (
    <ProfileLayout>
        <div className='relative flex flex-row justify-center place-items-center'>
            <div className='relative w-[620px] h-[530px] mx-[10px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                <div className='relative h-[150px] w-full overflow-hidden'>
                    <div className='absolute top-0 left-0 h-[150px] w-full bg-cover bg-center  blur-sm' style={{ backgroundImage: `url(${tileblue})`}}></div>
                    <div className='absolute top-0 left-0 h-[180px] w-[650px] bg-[#123F7B] opacity-75 mix-blend-multiply'></div>
                </div>
                <div className='absolute top-0 left-0 py-8 px-6 h-full w-full flex flex-row items-center justify-start space-x-4'>
                    <div className='flex flex-col w-[200px] h-[450px] space-y-4 bg-white shadow-lg shadow-[#123f7b]/25 rounded-tr-[45px] rounded-bl-[45px] overflow-hidden place-items-center pb-4'>
                    <img src={user?.avatar?.url} alt='tilelogo' className='h-3/5 w-full rounded-bl-[45px] object-cover'/>
                    <div className='flex flex-col border-2 border-[#123F7B] space-y-2 w-[180px] h-2/5 m-4 rounded-tr-[45px] rounded-bl-[45px] place-items-center justify-center content-center'>
                        <p className='text-[#D46A79] text-3xl font-semibold'>
                        {loading ? '...' : userReports.length}
                        </p>
                        <p className='text-[#123F7B] text-md font-semibold'>REPORTS CREATED</p>
                    </div>
                    </div>
                    <div className='flex flex-col h-[450px] grow pt-12 place-items-start justify-start space-y-4'>
                    <div className='flex flex-col place-items-start justify-start pb-1'>
                        <p className='text-2xl font-extrabold'>{user?.firstName} {user?.lastName}</p>
                        <div className='bg-white rounded-full py-0.5 px-2 place-items-center border border-[#D46A79]'>
                        <p className='text-[#D46A79] text-xs font-medium'>{getRoleDisplayName(user?.roles[0])}</p>
                        </div>
                    </div>
                    <div className='flex flex-col place-items-start w-full space-y-4'>
                        <div className='flex flex-row w-full place-items-center justify-start space-x-8'> 
                        <div className='flex flex-row place-items-center space-x-1.5'>
                            <IoCalendarClearOutline className='text-[#D46A79] text-2xl' />
                            <p className='text-[#123F7B] text-sm font-normal'>Joined {formatDateToMonthYear(user?.createdAt)}</p>
                        </div>
                        <div className='flex flex-row place-items-center space-x-1'>
                            <IoLocationOutline className='text-[#D46A79] text-2xl' />
                            <p className='text-[#123F7B] text-sm font-normal'>{user?.address?.city}</p>
                        </div>
                        </div>
                        <div className='flex flex-col place-items-start justify-start space-y-2'>
                        <div className='flex flex-row place-items-center justify-start space-x-2'>
                            <p className='text-[#D46A79] text-sm font-normal'>Email:</p>
                            <p className='text-[#123F7B] text-sm font-semibold'>{user?.email}</p>
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(user?.email)} /></TooltipTrigger>
                                <TooltipContent>
                                <p className='text-[#123F7B] text-xs font-light'>Copy to clipboard</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className='flex flex-row place-items-center justify-start space-x-2'>
                            <p className='text-[#D46A79] text-sm font-normal'>Contact No.:</p>
                            <p className='text-[#123F7B] text-sm font-semibold'>{user?.number}</p>
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(user?.number)} /></TooltipTrigger>
                                <TooltipContent>
                                <p className='text-[#123F7B] text-xs font-light'>Copy to clipboard</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </div>
                        </div>
                        <div className='flex flex-col place-items-start space-y-2 w-full'>
                        <p className='text-[#123F7B] text-md font-semibold'>Recent Activities</p>
                        <div className='flex flex-col place-items-center justify-start space-y-2 w-full'>
                            {loading ? (
                            <p>Loading...</p>
                            ) : recentReports.length === 0 ? (
                            <p className="text-gray-400 italic">No reports yet.</p>
                            ) : recentReports.map((report) =>
                            report.status === "Resolved" ? (
                                <div
                                key={report._id}
                                className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] bg-[#123F7B] px-2 py-1 rounded-xl'
                                >
                                <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                    <p className='text-xs font-semibold text-white'>Report closed</p>
                                    <p className='text-[10px] font-light text-white'>
                                    {Math.round((Date.now() - new Date(report.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                                    </p>
                                </div>
                                <div className='flex flex-col place-items-end justify-end'>
                                    <IoMdCheckmarkCircleOutline className='text-white text-xl font-light' />
                                </div>
                                </div>
                            ) : (
                                <div
                                key={report._id}
                                className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] px-2 py-1 rounded-xl bg-white'
                                >
                                <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                    <p className='text-[#123F7B] text-xs font-semibold'>
                                    {report.status === "Pending"
                                        ? "Created a report"
                                        : report.status === "Assigned"
                                        ? "Report assigned"
                                        : report.status === "Under Investigation"
                                        ? "Report under investigation"
                                        : "Report updated"}
                                    </p>
                                    <p className='text-[#D46A79] text-[10px] font-light'>
                                    {getTimeAgo(report.createdAt)}
                                    </p>
                                </div>
                                <div className='flex flex-col place-items-end justify-end'>
                                    <TooltipProvider>
                                        <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>
                                            {getStatusIcon(report.status)}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <span className="text-xs text-[#123F7B] font-light">
                                            {report.status === "Pending" && "Pending: Waiting for review"}
                                            {report.status === "Assigned" && "Assigned: Officer assigned"}
                                            {report.status === "Under Investigation" && "Under Investigation: Case is being investigated"}
                                            {report.status === "Resolved" && "Resolved: Report closed"}
                                            {!["Pending", "Assigned", "Under Investigation", "Resolved"].includes(report.status) && "Status unknown"}
                                            </span>
                                        </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                </div>
                            )
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className='relative w-[250px] h-[530px] mx-[40px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                <div className='flex flex-col place-items-start px-4 py-6 space-y-4 h-full text-[#123F7B]'>
                    <p className='text-xl font-semibold'>Reports</p>
                    <div className='flex flex-col content-around space-y-2 h-full w-full overflow-auto'>
                        <div className='flex flex-col place-items-center space-y-2 w-full'>
                            {loading ? (
                                <p>Loading...</p>
                            ) : sortedReports.length === 0 ? (
                                <p className="text-gray-400 italic">No reports yet.</p>
                            ) : (showAll ? sortedReports : recentReports).map((report) => (
                                <div key={report._id} className='flex flex-row place-items-center justify-start space-x-2 w-full h-full bg-[#123F7B] p-2 rounded-xl cursor-pointer'
                                    onClick={() => handleViewDetails(report._id)}>
                                    <img src={report.personInvolved.mostRecentPhoto?.url || tileblue} alt='report' className='h-[100px] w-[90px] rounded-xl object-cover'/>
                                    <div className='flex flex-col place-items-start justify-start space-y-3 w-full h-full'>
                                        <div className='flex flex-col place-items-start justify-start space-y-1'>
                                            <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                <span>
                                                    {getStatusIcon(report.status)}
                                                </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                <span className="text-xs text-[#123F7B] font-light">
                                                    {getStatusTooltip(report.status)}
                                                </span>
                                                </TooltipContent>
                                            </Tooltip>
                                            </TooltipProvider>
                                            <div className='bg-white rounded-full px-2 place-items-center border border-[#D46A79]'>
                                            <p className='text-[#D46A79] text-xs font-normal'>{report.type}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                            <p className='text-white text-xs font-semibold'>{report.personInvolved?.firstName} {report.personInvolved?.lastName}</p>
                                            <p className='text-white text-[10px] font-light'>{getTimeAgo(report.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col place-items-center w-full'>
                            <button
                                className='bg-[#123F7B] text-white rounded-xl px-4 py-1'
                                onClick={() => setShowAll((prev) => !prev)}
                            >
                                {showAll ? "Show Recent" : "View All"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ProfileLayout>
    );
};

export default ProfileCard;