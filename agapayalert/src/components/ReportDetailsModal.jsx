import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getReportDetails, updateUserReport } from '../redux/actions/reportActions';
import { getFinderReportsByReportId } from '@/redux/actions/finderActions';
import { unpublishBroadcast } from '@/redux/actions/broadcastActions';
import { FaBroadcastTower, FaEyeSlash, FaEdit  } from 'react-icons/fa';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { format } from 'date-fns';
import { ReportInfo } from './ReportDetails/ReportInfo';
import { PersonalInfo } from './ReportDetails/PersonalInfo';
import { PhysicalInfo } from './ReportDetails/PhysicalInfo';
import { MediaInfo } from './ReportDetails/MediaInfo';
import { FinderInfo } from './ReportDetails/FinderInfo';
import BroadcastReport  from './ReportDetails/BroadcastReport';
import UpdateStatusReport from './ReportDetails/UpdateStatusReport';

const ReportDetailsModal = ({ reportId, onClose }) => {
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  const [finderReports, setFinderReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false); // State to toggle UpdateStatusReport

  const handleBroadcastClick = (reportId) => {
    setSelectedReportId(reportId);
    setShowUpdateStatus(false); // Close UpdateStatusReport
  };

  const handleUpdateStatusClick = () => {
    setShowUpdateStatus(true); // Show UpdateStatusReport
    setSelectedReportId(null); // Reset selected report ID
  };

  const handleUpdateStatus = async (updateData) => {
    const result = await dispatch(updateUserReport(reportId, updateData));
    setShowUpdateStatus(false); // Close UpdateStatusReport
  };

  const handleCloseModal = () => {
    setSelectedReportId(null);
  };

  const handleUnpublish = async () => {
    setLoading(true);
    const result = await dispatch(unpublishBroadcast(reportId)); // Call unpublishBroadcast action
    setLoading(false);

    if (result.success) {
      alert('Broadcast unpublished successfully!');
      const updatedReport = await dispatch(getReportDetails(reportId)); // Refresh report details
      if (updatedReport.success) {
        setReport(updatedReport.data);
      }
    } else {
      alert(`Failed to unpublish broadcast: ${result.error}`);
    }
  };

  useEffect(() => {
    const fetchReportDetails = async () => {
      const result = await dispatch(getReportDetails(reportId));
      if (result.success) {
        setReport(result.data);
        console.log('Report Details:', result.data);
      }
    };

    fetchReportDetails();
  }, [dispatch, reportId]);

  useEffect(() => {
    const fetchFinderReports = async () => {
      const result = await dispatch(getFinderReportsByReportId(reportId));
      if (result.success) {
        setFinderReports(result.data);
        console.log('Finder Reports:', result.data);
      } else if (result.error) {
        console.log('Error REPORT:', result.error);
      }
    };

    fetchFinderReports();
  }, [dispatch, reportId]);

  const formattedDate = report ? format(new Date(report.createdAt), 'MMMM dd, yyyy @ hh:mm a') : '';

  const getStatusTable  = (status) => {
    switch (status) {
        case 'Pending':
            return (
                <div className='bg-[#FBBC05]/10 px-2 py-2 rounded-full'>
                      <p className='text-[#FBBC05] text-sm font-semibold text-center'>{status}</p>
                </div>
            );
        case 'Assigned':
            return (
                <div className='bg-[#123F7B]/10 px-2 py-2 rounded-full'>
                      <p className='text-[#123F7B] text-sm font-semibold text-center'>{status}</p>
                </div>
            );
        case 'Under Investigation':
            return (
                <div className='bg-[#123F7B] px-2 py-2 rounded-full'>
                    <p className='text-white text-sm font-semibold text-center'>{status}</p>
                </div>
            );
        case 'Resolved':
            return (
                <div className='bg-[#34A853]/10 px-2 py-2 rounded-full'>
                    <p className='text-[#34A853] text-sm font-semibold text-center'>{status}</p>
                </div>
            );
    }
  };

  return (
    <Dialog open={!!reportId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1120px] sm:max-h-[980px]">
        {report ? (
          <div className="p-6 overflow-auto max-h-[600px]">
            <h2 className="text-xl font-bold mb-2">Detailed Report</h2>
            <div className="grid grid-cols-3 gap-12">
              <div className='col-start-1 col-end-2 m-1 p-1 rounded-lg shadow-lg overflow-hidden bg-[#123F7B]/5'>
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="m-2">
                    <img src={report.personInvolved.mostRecentPhoto?.url || ''} alt="Most Recent Photo" className="w-[220px] h-[220px] rounded-full border-8 border-white shadow-xl" />
                  </div>
                  <div className="m-4">
                    {getStatusTable(report.status)}
                  </div>
                  <div className="flex flex-row justify-between mt-4 text-md gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button
                            className="bg-[#123F7B] text-white p-4 rounded-xl flex items-center shadow-lg"
                            onClick={() => handleBroadcastClick(report._id)}
                          >
                            <FaBroadcastTower className="" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-light text-[#123f7b]'>Click to broadcast report</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {report.isPublished && (
                      <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button
                            className="bg-[#D46A79] text-white p-4 rounded-xl flex items-center shadow-lg"
                            onClick={handleUnpublish} // Call handleUnpublish on click
                            disabled={loading}
                          >
                            <FaEyeSlash className="" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-light text-[#123f7b]'>Click to hide report</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    )}
                  </div>
                  <div className='m-4'>
                    <p className='text-[#D46A79]/70 text-lg font-semibold'>{report.type} Person</p>
                  </div>
                  <div className='m-4 text-sm font-light'>
                    <button className="bg-[#123F7B] text-white px-8 py-4 rounded-full flex items-center shadow-lg"
                    onClick={handleUpdateStatusClick}>
                      <FaEdit className="mr-1"/> Update Status
                      </button>
                  </div>
                </div>
              </div>
              <div className='col-start-2 col-end-4'>
                <div className='flex flex-col space-y-4'>
                  <div className='-space-y-0'>
                    <div className='text-3xl font-bold'>
                    {report.personInvolved.firstName} {report.personInvolved.lastName}
                    </div>
                    <div className='text-sm font-medium my-2 text-[#123F7B]/60'>
                    Date & Time Reported: {formattedDate}
                    </div>
                  </div>
                  {!selectedReportId && !showUpdateStatus ? (
                    <div className='px-1'>
                      <Tabs defaultValue="reportinfo">
                        <TabsList>
                          <TabsTrigger value='reportinfo'>
                            <div className='text-xs font-semibold text-[#123F7B]/80'>
                              REPORT
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value='personalinfo'>
                            <div className='text-xs font-semibold text-[#123F7B]/80'>
                              PERSONAL
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value='physicalinfo'>
                            <div className='text-xs font-semibold text-[#123F7B]/80'>
                              PHYSICAL
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value='mediaInfo'>
                            <div className='text-xs font-semibold text-[#123F7B]/80'>
                              MEDIA
                            </div>
                          </TabsTrigger>
                          <TabsTrigger value='FinderInfo'>
                            <div className='text-xs font-semibold text-[#123F7B]/80'>
                              WITNESS REPORTS
                            </div>
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value='reportinfo'>
                          <ReportInfo report={report} />
                        </TabsContent>
                        <TabsContent value='personalinfo'>
                          <PersonalInfo report={report} />
                        </TabsContent>
                        <TabsContent value='physicalinfo'>
                          <PhysicalInfo report={report} />
                        </TabsContent>
                        <TabsContent value='mediaInfo'>
                          <MediaInfo report={report} />
                        </TabsContent>
                        <TabsContent value='FinderInfo'>
                          <FinderInfo finderReports={finderReports} />
                        </TabsContent>
                      </Tabs>
                    </div>
                  ) : showUpdateStatus ? (
                    <UpdateStatusReport
                      onClose={handleCloseUpdateStatus} // Close UpdateStatusReport
                      onSubmit={handleUpdateStatus}
                      currentStatus={currentReport?.status}
                    />
                  ) : (
                    <BroadcastReport reportId={selectedReportId} onClose={handleCloseModal} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;