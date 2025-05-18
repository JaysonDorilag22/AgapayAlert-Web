import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import tileblue from '../../assets/tilelogoblue.png';
import { GoClock } from "react-icons/go";
import { FaCheck, FaSearch } from "react-icons/fa";
import ProfileLayout from '@/layouts/ProfileLayout';
import { CiLocationOn } from "react-icons/ci";
import { IoCalendarClearOutline, IoCallOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { PiWarningCircle } from 'react-icons/pi';
import { GrInProgress } from "react-icons/gr";
import { FaUserCheck } from "react-icons/fa6";
import { PiDetectiveFill } from "react-icons/pi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaUserTag } from "react-icons/fa";
import { TbCalendarUser } from "react-icons/tb";
import { PiGenderIntersexLight } from "react-icons/pi";
import { GiClothes } from "react-icons/gi";
import { MdOutlineContactPhone } from "react-icons/md";
import { getUserReports, getReportDetails } from '../../redux/actions/reportActions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

// Helper to get icon based on status
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-[#FBBC05]";
    case "Assigned":
      return "bg-[#2D9CDB]";
    case "Under Investigation":
      return "bg-[#F2994A]";
    case "Resolved":
      return "bg-[#27AE60]";
    case "Archived":
      return "bg-[#A0AEC0]"; // gray-blue for archived
    default:
      return "bg-gray-300";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Pending":
      return <GrInProgress className="text-yellow-500 text-xl" />;
    case "Assigned":
      return <FaUserCheck className="text-blue-500 text-xl" />;
    case "Under Investigation":
      return <PiDetectiveFill className="text-orange-400 text-xl" />;
    case "Resolved":
      return <IoMdCheckmarkCircleOutline className="text-green-600 text-xl font-light" />;
    case "Archived":
      return <IoMdCheckmarkCircleOutline className="text-gray-400 text-xl font-light" />;
    default:
      return <GrInProgress className="text-gray-400 text-xl" />;
  }
};


// Helper to get tooltip text based on status
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
    case "Archived":
      return "Archived: Report is no longer active";
    default:
      return "Status unknown";
  }
};

// Helper to get "x days ago" or "x hours and y minutes ago"
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

function formatDateToMonthDayYear(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}


const ReportCard = () => {

const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const result = await dispatch(getUserReports({ limit: 100 }));
      setUserReports(result?.data?.reports || []);
      setLoading(false);
    };
    if (user?._id) fetchReports();
  }, [dispatch, user?._id]);

  useEffect(() => {
  const fetchDetails = async () => {
    if (selectedReportId) {
      setSelectedReport(null); // Optional: show loading state
      const result = await dispatch(getReportDetails(selectedReportId));
      console.log('getReportDetails result:', result); // <-- Add this line
      setSelectedReport(result?.data || null);
    }
  };
  fetchDetails();
}, [dispatch, selectedReportId]);

  // You can add search/filter logic here if needed
  const sortedReports = [...userReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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
            <div className='relative w-[620px] h-[530px] mx-[10px] bg-white rounded-[45px] py-4 px-6 shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                
                <div className='flex flex-col place-items-start space-y-4 w-full h-full text-[#123F7B]'>
                    <div className='w-full'>
                        <div className='w-full'>
                            <form className="relative w-full">
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
                    </div>
                    <div className='flex flex-col place-items-start space-y-2 w-full flex-1 min-h-0'>
                        <div className='w-full'>
                            <p className='text-2xl font-bold'>Reports</p>
                        </div>
                        <div className='flex flex-row w-max place-items-center space-x-4'>
                            <div className='border border-[#123F7B] bg-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal text-white font-normal'>All</p>
                            </div>
                            <div className='border border-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal font-normal'>Pending</p>
                            </div>
                            <div className='border border-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal font-normal'>Under Investigation</p>
                            </div>
                            <div className='border border-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal font-normal'>Resolved</p>
                            </div>
                        </div>
                        <div className='flex flex-col flex-1 min-h-0 w-full space-y-4 overflow-y-auto pb-8 pt-2 px-4 mb-4'>
                            {loading ? (
                            <p>Loading...</p>
                            ) : sortedReports.length === 0 ? (
                            <p className="text-gray-400 italic">No reports yet.</p>
                            ) : sortedReports.map((report) => (
                            <div
                                key={report._id}
                                className={`flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between shadow-md shadow-[#123f7b]/25 cursor-pointer transition-all duration-200
                                ${selectedReportId === report._id ? "bg-[#E3ECF7] scale-[1.02] shadow-xl" : "hover:scale-[1.01] hover:shadow-lg"}
                                `}
                                style={{ transitionProperty: 'background, box-shadow, transform, border-color' }}
                                onClick={() => setSelectedReportId(report._id)}
                            >
                                <div className={`${getStatusColor(report.status)} w-1.5 rounded-l-md`}></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                <div className='flex flex-row place-items-center space-x-1.5'>
                                    <img src={report.personInvolved?.mostRecentPhoto?.url || tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                    <div className='flex flex-col h-full w-max justify-between'>
                                    <div className='-space-y-1'>
                                        <p className='text-md font-bold'>{report.personInvolved?.firstName} {report.personInvolved?.lastName}</p>
                                        <p className='text-sm font-light'>
                                        Last seen {report.personInvolved?.lastKnownLocation ? `at ${report.personInvolved.lastKnownLocation}` : ""} {getTimeAgo(report.createdAt)}
                                        </p>
                                    </div>
                                    <div className='-space-y-0.5'>
                                        <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                        <p className='text-[#D46A79] font-extralight text-xs'>{report.type}</p>
                                        </div>
                                        <p className='font-semibold text-sm'>{getTimeAgo(report.createdAt)}</p>
                                    </div>
                                    </div>
                                </div>
                                <div className='flex flex-col place-content-end'>
                                    <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <div className={`rounded-full w-max px-2 py-0.5 flex items-center ${getStatusColor(report.status)}`}>
                                            <p className='text-white font-normal text-sm'>{report.status}</p>
                                        </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                        <span className="text-xs text-[#123F7B] font-light">
                                            {getStatusTooltip(report.status)}
                                        </span>
                                        </TooltipContent>
                                    </Tooltip>
                                    </TooltipProvider>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                
            </div>
            <div className='relative w-[250px] h-[530px] mx-[40px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
            <div className='flex flex-col content-start justify-start px-4 py-6 space-y-2 h-full text-[#123F7B] overflow-auto'>
                {selectedReportId && !selectedReport && (
                <div className="flex flex-col items-center justify-center h-full w-full text-center text-[#123F7B]/60">
                    <p className="text-lg font-semibold">Loading details...</p>
                </div>
                )}
                {selectedReport ? (
                <>
                    <div>
                    <p className='text-lg font-semibold'>Report Progress</p>
                    </div>
                    <div className='flex flex-col space-y-2 h-max w-full overflow-auto pb-4 px-1'>
                    {/* Status Section */}
                    <div className='flex flex-col w-full h-max bg-[#F5F5F5] rounded-lg justify-between shadow-md shadow-[#123f7b]/25 space-y-2 p-2'>
                        <div>
                        <p className='text-md font-semibold'>Status</p>
                        </div>
                        {/* Status Progress Steps */}
                        <div className='flex flex-row place-items-center justify-center space-x-2 text-white transition-all duration-200'>
                        {/* Step 1: Pending */}
                        <div className={
                            `rounded-md px-4 py-1 flex items-center justify-center
                            ${selectedReport.status === "Pending"
                            ? "bg-[#123F7B] ring-2 ring-[#123F7B]"
                            : ["Assigned", "Under Investigation", "Resolved", "Archived"].includes(selectedReport.status)
                                ? "bg-[#123F7B]"
                                : "bg-[#123F7B]/25"}`
                        }>
                            {["Assigned", "Under Investigation", "Resolved", "Archived"].includes(selectedReport.status)
                            ? <FaCheck className='text-xs' />
                            : <span className='text-xs'>1</span>
                            }
                        </div>
                        {/* Step 2: Assigned */}
                        <div className={
                            `rounded-md px-4 py-1 flex items-center justify-center
                            ${selectedReport.status === "Assigned"
                            ? "bg-[#123F7B] ring-2 ring-[#123F7B]"
                            : ["Under Investigation", "Resolved", "Archived"].includes(selectedReport.status)
                                ? "bg-[#123F7B]"
                                : "bg-[#123F7B]/25"}`
                        }>
                            {["Under Investigation", "Resolved", "Archived"].includes(selectedReport.status)
                            ? <FaCheck className='text-xs' />
                            : <span className='text-xs'>2</span>
                            }
                        </div>
                        {/* Step 3: Under Investigation */}
                        <div className={
                            `rounded-md px-4 py-1 flex items-center justify-center
                            ${selectedReport.status === "Under Investigation"
                            ? "bg-[#123F7B] ring-2 ring-[#123F7B]"
                            : ["Resolved", "Archived"].includes(selectedReport.status)
                                ? "bg-[#123F7B]"
                                : "bg-[#123F7B]/25"}`
                        }>
                            {["Resolved", "Archived"].includes(selectedReport.status)
                            ? <FaCheck className='text-xs' />
                            : <span className='text-xs'>3</span>
                            }
                        </div>
                        {/* Step 4: Resolved */}
                        <div className={
                            `rounded-md px-4 py-1 flex items-center justify-center
                            ${selectedReport.status === "Resolved"
                            ? "bg-[#123F7B] ring-2 ring-[#123F7B]"
                            : selectedReport.status === "Archived"
                                ? "bg-[#123F7B]"
                                : "bg-[#123F7B]/25"}`
                        }>
                            {selectedReport.status === "Archived"
                            ? <FaCheck className='text-xs' />
                            : <span className='text-xs'>4</span>
                            }
                        </div>
                        {/* Step 5: Archived (conditional) */}
                        {selectedReport.status === "Archived" && (
                            <div className="bg-[#A0AEC0] rounded-md px-4 py-1 flex items-center justify-center ring-2 ring-[#A0AEC0]">
                            <span className='text-xs'>Archived</span>
                            </div>
                        )}
                        </div>
                        <div>
                        <p className='text-xs font-light leading-none mt-2'>
                            {(() => {
                            let step = 1, stepLabel = "PENDING";
                            if (selectedReport.status === "Assigned") { step = 2; stepLabel = "ASSIGNED"; }
                            else if (selectedReport.status === "Under Investigation") { step = 3; stepLabel = "UNDER INVESTIGATION"; }
                            else if (selectedReport.status === "Resolved") { step = 4; stepLabel = "RESOLVED"; }
                            else if (selectedReport.status === "Archived") { step = 5; stepLabel = "ARCHIVED"; }
                            return (
                                <>
                                Your report is currently in <strong className='font-semibold'>STEP {step}</strong>. The case is
                                {step === 1 && <> waiting for review and is <strong className='font-semibold'>PENDING</strong>.</>}
                                {step === 2 && <> handled by an officer and is <strong className='font-semibold'>ASSIGNED</strong>.</>}
                                {step === 3 && <> handled by an officer and is <strong className='font-semibold'>UNDER INVESTIGATION</strong>.</>}
                                {step === 4 && <> <strong className='font-semibold'>RESOLVED</strong>.</>}
                                {step === 5 && <> <strong className='font-semibold'>ARCHIVED</strong>.</>}
                                </>
                            );
                            })()}
                        </p>
                        </div>
                    </div>
                    {/* Assigned Officer Section */}
                    <div className='flex flex-col w-full h-max bg-[#F5F5F5] rounded-lg justify-between shadow-md shadow-[#123f7b]/25 space-y-2 p-2'>
                        <div>
                        <p className='text-md font-semibold'>Assigned Officer</p>
                        </div>
                        {selectedReport.status === "Pending" || !selectedReport.assignedOfficer ? (
                        <div className="flex flex-col items-center justify-center w-full py-4">
                        <p className="text-xs text-[#D46A79] italic">No officer assigned yet.</p>
                        </div>
                    ) : (
                        <div className='flex flex-row place-items-center justify-start space-x-1 px-1'>
                        <div>
                            <img src={selectedReport.assignedOfficer?.avatar?.url || tileblue} alt="Tile Logo" className='w-14 h-14 rounded-lg' />
                        </div>
                        <div className='flex flex-col h-full w-max content-between space-y-1'>
                            <p>
                            <span className='text-xs font-semibold leading-none'>
                                {selectedReport.assignedOfficer?.firstName}
                            </span>
                            </p>
                            <div className='flex flex-col space-y-0.5'>
                            <div className='flex flex-row space-x-1 place-items-center'>
                                <CiLocationOn className='text-[#D46A79] text-sm' />
                                <p className='text-xs font-normal'>
                                {selectedReport.assignedPoliceStation?.address?.city || "N/A"}
                                </p>
                            </div>
                            <div className='flex flex-row space-x-1 place-items-center'>
                                <IoCallOutline className='text-[#D46A79] text-sm' />
                                <p
                                    className='text-xs font-normal cursor-pointer hover:font-bold'
                                    title="Copy number"
                                    onClick={() => handleCopyToClipboard(selectedReport.assignedOfficer?.number || "N/A")}
                                >
                                    {selectedReport.assignedOfficer?.number || "N/A"}
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                    </div>
                    {/* Details Section */}
                    <div className='flex flex-col w-full h-max bg-[#F5F5F5] rounded-lg justify-between shadow-md shadow-[#123f7b]/25 space-y-2 p-2'>
                        <div>
                        <p className='text-md font-semibold'>Details</p>
                        </div>
                        <div className='flex flex-col space-y-1 w-full h-max'>
                        <div className='flex flex-col space-y-0.5 w-full place-items-center'>
                            <img src={selectedReport.personInvolved?.mostRecentPhoto?.url || tileblue} alt="Tile Logo" className='w-14 h-14 rounded-full' />
                            <p className='text-sm font-semibold'>{selectedReport.personInvolved?.firstName} {selectedReport.personInvolved?.lastName}</p>
                            <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                            <p className='text-[#D46A79] font-extralight text-xs'>{selectedReport.type}</p>
                            </div>
                            <div className='flex flex-col space-y-1 place-items-start'>
                            {/* Horizontal separator */}
                                <hr className="w-full border-t border-gray-300 my-2" />
                                    <div className='flex flex-row items-center'>
                                    <PiWarningCircle className='text-[#D46A79] text-md' />
                                    <p className='text-xs font-normal ml-1'>{getTimeAgo(selectedReport.createdAt)}</p>
                                </div>
                                <div className='flex flex-row items-center'>
                                    <LuUsersRound className='text-[#D46A79] text-md' />
                                    <p className='text-xs font-normal ml-1 leading-none'>{selectedReport.personInvolved?.relationship || "Relationship"}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col space-y-1 w-full h-max'>
                            <p className='text-sm font-semibold'>Personal Info</p>
                            <div className='flex flex-col space-y-4 w-full place-items-start p-1'>
                            {/* Alias */}
                            <div className='flex flex-row space-x-0.5'>
                                <FaUserTag className='text-[#D46A79] text-3xl' />
                                <div className='flex flex-col -space-y-0.5'>
                                <p className='text-xs font-light text-[#D46A79]'>Alias</p>
                                <p className='text-xs font-semibold'>
                                    {selectedReport.personInvolved?.alias || 'N/A'}
                                </p>
                                </div>
                            </div>
                            {/* Age */}
                            <div className='flex flex-row space-x-0.5'>
                                <TbCalendarUser className='text-[#D46A79] text-3xl' />
                                <div className='flex flex-col -space-y-0.5'>
                                <p className='text-xs font-light text-[#D46A79]'>Age</p>
                                <p className='text-xs font-semibold'>
                                    {selectedReport.personInvolved?.age || 'N/A'}
                                </p>
                                </div>
                            </div>
                            {/* Date of Birth */}
                            <div className='flex flex-row space-x-0.5'>
                                <IoCalendarClearOutline className='text-[#D46A79] text-3xl' />
                                <div className='flex flex-col -space-y-0.5'>
                                <p className='text-xs font-light text-[#D46A79]'>Date of birth</p>
                                <p className='text-xs font-semibold'>
                                    {formatDateToMonthDayYear(selectedReport.personInvolved?.dateOfBirth) || "January 12, 2000"}
                                </p>
                                </div>
                            </div>
                            {/* Gender */}
                            <div className='flex flex-row space-x-0.5'>
                                <PiGenderIntersexLight className='text-[#D46A79] text-3xl' />
                                <div className='flex flex-col -space-y-0.5'>
                                <p className='text-xs font-light text-[#D46A79]'>Gender</p>
                                <p className='text-xs font-semibold'>
                                    {selectedReport.personInvolved?.gender || 'N/A'}
                                </p>
                                </div>
                            </div>
                            {/* Last Known Clothing */}
                            <div className='flex flex-row space-x-0.5'>
                                <GiClothes className='text-[#D46A79] text-3xl' />
                                <div className='flex flex-col -space-y-0.5'>
                                <p className='text-xs font-light text-[#D46A79]'>Last Known Clothing</p>
                                <p className='text-xs font-semibold'>
                                    {selectedReport.personInvolved?.lastKnownClothing || 'N/A'}
                                </p>
                                </div>
                            </div>
                            {/* Contact Information */}
                            <div className='flex flex-row space-x-0.5'>
                                <MdOutlineContactPhone className='text-[#D46A79] text-3xl' />
                                <div className='flex flex-col -space-y-0.5'>
                                <p className='text-xs font-light text-[#D46A79]'>Contact Information</p>
                                <p className='text-xs font-semibold'>
                                    {selectedReport.personInvolved?.contactInformation || 'N/A'}
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </>
                ) : (
                <div className="flex flex-col items-center justify-center h-full w-full text-center text-[#123F7B]/60">
                    <p className="text-lg font-semibold">Select a report to view details</p>
                </div>
                )}
            </div>
            </div>
        </div>
    </ProfileLayout>
    );
};

export default ReportCard;
