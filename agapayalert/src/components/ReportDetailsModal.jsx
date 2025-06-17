import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getReportDetails, updateUserReport, getReports } from '../redux/actions/reportActions';
import { getFinderReportsByReportId } from '@/redux/actions/finderActions';
import { unpublishBroadcast } from '@/redux/actions/broadcastActions';
import { FaBroadcastTower, FaEyeSlash, FaEdit, FaFilePdf  } from 'react-icons/fa';
import { BsFileEarmarkPerson } from "react-icons/bs";
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
import ReportInfo from './ReportDetails/ReportInfo';
import { PersonalInfo } from './ReportDetails/PersonalInfo';
import { PhysicalInfo } from './ReportDetails/PhysicalInfo';
import { MediaInfo } from './ReportDetails/MediaInfo';
import { FinderInfo } from './ReportDetails/FinderInfo';
import TransferReportModal from './TransferReportModal';
import BroadcastReport  from './ReportDetails/BroadcastReport';
import UpdateStatusReport from './ReportDetails/UpdateStatusReport';
import { redirect } from 'react-router-dom';
import toastUtils from '@/utils/toastUtils';
import { useLocation } from "react-router-dom";
import { useReportModal } from '../layouts/ReportModalProvider';
import html2pdf from 'html2pdf.js';
import ReportPDFView from './Admin/ReportPDFView';
import MissingPosterPDF from './Admin/MissingPosterPDF';

const ReportDetailsModal = ({ reportId, onClose }) => {
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  const [finderReports, setFinderReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false); // State to toggle UpdateStatusReport
  const [localError, setLocalError] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState(false);
  const exportRef = useRef();
  const pdfRef = useRef();
  const missingPosterRef = useRef();

  useEffect(() => {
  loadReportDetails();
}, [dispatch, reportId]);

  const handleUpdateStatus = (data) => {
    if (data.status === "Transferred") {
      setShowTransferModal(true);
      setPendingTransfer(data);
      return;
    }
    handleCloseUpdateStatus(data);
  };

// Export handler for custom PDF
  const handleExportPDF = () => {
    if (!pdfRef.current) return;
    html2pdf()
      .from(pdfRef.current)
      .set({
        margin: 0.5,
        filename: `report_${reportId}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const handleExportMissingPDF = () => {
  if (!missingPosterRef.current) return;
  html2pdf()
    .from(missingPosterRef.current)
    .set({
      margin: 0,
      filename: `missing_${report._id}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    })
    .save();
  };

const loadReportDetails = async (showLoadingState = true) => {
  try {
    if (localError) setLocalError(null);
    if (showLoadingState) setLoading(true);
    const result = await dispatch(getReportDetails(reportId));
    if (showLoadingState) setLoading(false);
    if (result.success) {
      setReport(result.data);
    } else {
      setLocalError(result.error || "Failed to load report details");
    }
  } catch (error) {
    if (showLoadingState) setLoading(false);
    console.error("Error loading details:", error);
    setLocalError("Network or server error. Please try again.");
  }
};


  const handleBroadcastClick = (reportId) => {
    setSelectedReportId(reportId);
    setShowUpdateStatus(false); // Close UpdateStatusReport
  };

  const handleUpdateStatusClick = () => {
    setShowUpdateStatus(true); // Show UpdateStatusReport
    setSelectedReportId(null); // Reset selected report ID
  };

const handleCloseUpdateStatus = async (updateData) => {
  // updateData: { status, followUp }
  console.log('ReportID & Update Data:', reportId, updateData);
  setLoading(true);
  const result = await dispatch(updateUserReport(reportId, updateData));
  setLoading(false);
  setShowUpdateStatus(false);
  if (result.success) {
    toastUtils("Report status updated successfully!", "success"); // Show success toast
    await loadReportDetails(true);
    setSelectedReportId(null);
    // Refetch the reports list for the table
    dispatch(getReports({ page: 1, limit: 10 })); // Adjust filters as needed
  } else {
    toastUtils(result.error || "Update failed", "error"); // Show error toast
  }
};

  const handleCloseModal = () => {
    setSelectedReportId(null);
    dispatch(getReports({ page: 1, limit: 10 }));
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
         case 'Transferred':
            return (
                <div className='bg-[#D46A79]/10 px-2 py-2 rounded-full'>
                    <p className='text-[#D46A79] text-xs font-semibold text-center'>{status}</p>
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
                        <TooltipTrigger asChild>
                          <span>
                            <button
                              className="bg-[#2563EB] text-white p-4 rounded-xl flex items-center shadow-lg"
                              onClick={handleExportPDF}
                              type="button"
                            >
                              <FaFilePdf />
                            </button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-light text-[#123f7b]'>Export this report as a PDF file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {report.type === "Missing" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <button
                                className="bg-red-600 text-white p-4 rounded-xl flex items-center shadow-lg"
                                onClick={handleExportMissingPDF}
                                type="button"
                              >
                                <BsFileEarmarkPerson className="" />
                              </button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-xs font-light text-[#123f7b]'>Export a printable missing poster</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <button
                              className="bg-[#123F7B] text-white p-4 rounded-xl flex items-center shadow-lg"
                              onClick={() => handleBroadcastClick(report._id)}
                              type="button"
                            >
                              <FaBroadcastTower className="" />
                            </button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-xs font-light text-[#123f7b]'>Click to broadcast report</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {report.isPublished && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <button
                                className="bg-[#D46A79] text-white p-4 rounded-xl flex items-center shadow-lg"
                                onClick={handleUnpublish}
                                disabled={loading}
                                type="button"
                              >
                                <FaEyeSlash className="" />
                              </button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-xs font-light text-[#123f7b]'>Click to hide report</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    <ReportPDFView
                      ref={pdfRef}
                      report={report}
                      finderReports={finderReports}
                      formattedDate={formattedDate}
                    />
                  </div>
                  <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                    <MissingPosterPDF ref={missingPosterRef} report={report} />
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
                        onClose={() => setShowUpdateStatus(false)}
                        onSubmit={handleUpdateStatus}
                        currentStatus={report.status}
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
        <TransferReportModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        reportId={reportId}
        onTransferred={async () => {
          setShowTransferModal(false);
          setShowUpdateStatus(false);
          toastUtils("Report transferred successfully!", "success");
          await loadReportDetails(true);
          setSelectedReportId(null);
          dispatch(getReports({ page: 1, limit: 10 }));
          onClose(); // <-- Close the modal after transfe
        }}
      />
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailsModal;