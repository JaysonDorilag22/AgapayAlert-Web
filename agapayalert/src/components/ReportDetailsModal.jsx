import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getReportDetails } from '../redux/actions/reportActions';
import { getFinderReportsByReportId } from '@/redux/actions/finderActions';
import { FaBroadcastTower, FaEyeSlash, FaEdit  } from 'react-icons/fa';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import { format } from 'date-fns';
import { ReportInfo } from './ReportDetails/ReportInfo';
import { PersonalInfo } from './ReportDetails/PersonalInfo';
import { PhysicalInfo } from './ReportDetails/PhysicalInfo';
import { MediaInfo } from './ReportDetails/MediaInfo';
import { FinderInfo } from './ReportDetails/FinderInfo';

const ReportDetailsModal = ({ reportId, onClose }) => {
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  const [finderReports, setFinderReports] = useState([null]);

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
        console.log('Finder Reports:', result);
      }
      else if (result.error) {
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
                    <button className="bg-[#123F7B] text-white p-4 rounded-xl flex items-center shadow-lg">
                    <FaBroadcastTower className="" />
                    </button>
                    {report.isPublished && (
                      <button className="bg-[#D46A79] text-white px-4 py-2 rounded-xl flex items-center shadow-lg">
                      <FaEyeSlash className="" />
                      </button>
                    )}

                  </div>
                  <div className='m-4'>
                    <p className='text-[#D46A79]/70 text-lg font-semibold'>{report.type} Person</p>
                  </div>
                  <div className='m-4 text-sm font-light'>
                  <button className="bg-[#123F7B] text-white px-8 py-4 rounded-full flex items-center shadow-lg">
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
                      <PersonalInfo report={report}/>
                    </TabsContent>
                    <TabsContent value='physicalinfo'>
                      <PhysicalInfo report={report}/>
                    </TabsContent>
                    <TabsContent value='mediaInfo'>
                      <MediaInfo report={report}/>
                    </TabsContent>
                    <TabsContent value='FinderInfo'>
                      <FinderInfo finderReports={finderReports} />
                    </TabsContent>
                  </Tabs>
                  </div>
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