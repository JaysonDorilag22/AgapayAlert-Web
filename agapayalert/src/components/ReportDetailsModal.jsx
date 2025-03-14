import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { getReportDetails } from '../redux/actions/reportActions';
import { FaBroadcastTower, FaEyeSlash, FaEdit, FaUserTag  } from 'react-icons/fa';
import { MdOutlineContacts, MdOutlineContactPhone, MdOutlineContactEmergency,MdLocationCity,MdOutlineInvertColors, MdOutlineBloodtype } from "react-icons/md";
import { RiPoliceBadgeFill, RiUserLocationLine, RiUserCommunityLine, RiEye2Line  } from "react-icons/ri";
import { GiClothes,GiScarWound, GiMedicines } from "react-icons/gi";
import { LuFileUser } from "react-icons/lu";
import { TbSpeakerphone, TbCalendarUser } from "react-icons/tb";
import { PiGenderIntersexLight } from "react-icons/pi";
import { IoCopyOutline } from 'react-icons/io5'
import { BsSendCheck } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { CiCalendarDate } from "react-icons/ci";
import { HiCalendarDateRange } from "react-icons/hi2";
import { SiWeightsandbiases } from "react-icons/si";
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from './ui/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';

const ReportDetailsModal = ({ reportId, onClose }) => {
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);

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

  const renderField = (label, value) => (
    <div className='flex flex-col gap-0'>
      <div className='text-md font-semibold text-[#123F7B] '>{value !== undefined && value !== null && value !== '' ? value : 'No Data'}</div>
      <div className='text-xs font-extralight text-[#123F7B]/60 italic'>{label}</div>
    </div>
  );

  const formattedDate = report ? format(new Date(report.createdAt), 'MMMM dd, yyyy @ hh:mm a') : '';
  const formattedDateOfbirth = report ? format(new Date(report.personInvolved.dateOfBirth), 'MMMM dd, yyyy') : '';
  const formattedLastSeenDate = report ? format(new Date(report.personInvolved.lastSeenDate), 'MMMM dd, yyyy') : '';

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard: ', text);
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  const ReportInfo = () => {
    return (
      <div>
        <div className='flex flex-row place-items-start mt-2'>
                        <MdOutlineContacts className="mr-2 text-lg" />
                        <div className='flex flex-col gap-0'>
                          <div className='text-md font-semibold text-[#123F7B] '>{report.reporter.firstName} {report.reporter.lastName}</div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Reporter</div>
                        </div>
                      </div>
                      <div className='flex flex-row place-items-start mt-2'>
                        <IoMdContacts className="mr-2 text-lg" />
                        <div className='flex flex-col gap-0'>
                          <div className='text-md font-semibold text-[#123F7B] '>{report.personInvolved.relationship}</div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Relationship with the Reporter</div>
                        </div>
                      </div>
                      <div className='flex flex-row place-items-start mt-2'>
                        <MdOutlineContactPhone className="mr-2 text-lg" />
                        <div className='flex flex-col gap-0'>
                          <div className='flex flex-row space-x-2'>
                            <div className='text-md font-semibold text-[#123F7B] '>{report.reporter.number}</div>
                            <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger>
                                  <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(report.reporter.number)} /></TooltipTrigger>
                                  <TooltipContent>
                                  <p className='text-[#123F7B] text-xs font-light'>Copy to clipboard</p>
                                  </TooltipContent>
                              </Tooltip>
                              </TooltipProvider>
                          </div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Reporter Contact Number</div>
                        </div>
                      </div>
                      <div className='flex flex-row place-items-start mt-2'>
                        <MdOutlineContactEmergency className="mr-2 text-lg" />
                        <div className='flex flex-col gap-0'>
                          <div className='flex flex-row space-x-2'>
                            <div className='text-md font-semibold text-[#123F7B] '>{report.reporter.email}</div>
                            <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger>
                                  <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(report.reporter.email)} /></TooltipTrigger>
                                  <TooltipContent>
                                  <p className='text-[#123F7B] text-xs font-light'>Copy to clipboard</p>
                                  </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Reporter Email</div>
                        </div>
                      </div>
                      <div className='flex flex-row place-items-start mt-2'>
                        <MdLocationCity className="mr-2 text-xl" />
                        <div className='flex flex-col gap-0'>
                          <div className='text-md font-semibold text-[#123F7B] '>{report.assignedPoliceStation.name}</div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Assigned Police Station</div>
                        </div>
                      </div>
                      {report.assignedOfficer && (
                        <div className='flex flex-row place-items-start mt-2'>
                          <RiPoliceBadgeFill className="mr-2 text-lg" />
                          {renderField('Assigned Officer', `${report.assignedOfficer.firstName} ${report.assignedOfficer.lastName}`)}
                        </div>
                      )}
                      {report.followUp && report.followUp.length > 0 && (
                        <div className='flex flex-row place-items-start mt-2'>
                          <RiPoliceBadgeFill className="mr-2 text-lg" />
                          {renderField('Follow Up', report.followUp)}
                        </div>
                      )}
                      <div className='flex flex-row place-items-start mt-2'>
                        <TbSpeakerphone className="mr-2 text-lg" />
                        <div className='flex flex-col gap-0'>
                          <div className='text-md font-semibold text-[#123F7B] '>{report.broadcastConsent ? 'Yes' : 'No'}</div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Broadcast Consent</div>
                        </div>
                      </div>
                      <div className='flex flex-row place-items-start mt-2'>
                        <BsSendCheck className="mr-2 text-lg" />
                        <div className='flex flex-col gap-0'>
                          <div className='text-md font-semibold text-[#123F7B] '>{report.isPublished ? 'Yes' : 'No'}</div>
                          <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Is Published</div>
                        </div>
                      </div>
      </div>   
    );
  };

  const PersonalInfo = () => {
    return(
      <div>
        <div className='flex flex-row place-items-start mt-2'>
          <RiUserLocationLine className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.lastKnownLocation || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Location Last Seen</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <HiCalendarDateRange className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{formattedLastSeenDate} @ {report?.personInvolved?.lastSeentime}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Date & Time Last Seen</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <FaUserTag className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.alias || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Alias</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <TbCalendarUser className="mr-2 text-xl" />
          <div className='flex flex-row space-x-2'>
            <div className='flex flex-col gap-0'>
              <div className='text-md font-semibold text-[#123F7B] '>{report.personInvolved.age}</div>
              <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Age</div>
            </div>
            <div className='flex flex-col gap-0'>|</div>
            <div className='flex flex-col gap-0'>
              <div className='text-md font-semibold text-[#123F7B] '>{formattedDateOfbirth}</div>
              <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Date of birth</div>
            </div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <PiGenderIntersexLight className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.gender || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Gender</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <GiClothes className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.lastKnownClothing || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Last Known Clothing</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <MdOutlineContactPhone className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.contactInformation || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Contact Information</div>
          </div>
        </div>
      </div>
    );
  };

  const PhysicalInfo = () => {
    return(
      <div>
        <div className='flex flex-row place-items-start mt-2'>
          <RiUserCommunityLine className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.race || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Race</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <SiWeightsandbiases className="mr-2 text-xl" />
          <div className='flex flex-row space-x-2'>
            <div className='flex flex-col gap-0'>
              <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.height || 'N/A'}</div>
              <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Height</div>
            </div>
            <div className='flex flex-col gap-0'>|</div>
            <div className='flex flex-col gap-0'>
              <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.weight || 'N/A'}</div>
              <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Weight</div>
            </div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <RiEye2Line className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.eyeColor || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Eye Color</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <GiScarWound className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.scarsMarksTattoos || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Scars / Marks / Tattoos</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <MdOutlineInvertColors className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.hairColor || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Hair Color</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <LuFileUser className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.birthDefects || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Birth Defects</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <LuFileUser className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.prosthetics || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Prosthetics</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <MdOutlineBloodtype className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.bloodType || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Blood Type</div>
          </div>
        </div>
        <div className='flex flex-row place-items-start mt-2'>
          <GiMedicines className="mr-2 text-xl" />
          <div className='flex flex-col gap-0'>
            <div className='text-md font-semibold text-[#123F7B] '>{report?.personInvolved?.medications || 'N/A'}</div>
            <div className='text-xs font-extralight text-[#123F7B]/60 italic'>Medications</div>
          </div>
        </div>
      </div>
    );
  };

  const MediaInfo = () => {
    return(
      <div>
        <div className='flex flex-col place-items-start space-y-2'>
          <div className='text-sm font-semibold text-[#123F7B]/80'>IMAGES</div>
          <div className='flex flex-row space-x-2'>
          <img src={report.personInvolved.mostRecentPhoto?.url || ''} alt="Most Recent Photo" className="w-[200px] h-[200px] rounded-sm mx-2"></img>
          {report.additionalImages && report.additionalImages.length > 0 ? (
            report.additionalImages.map((image, index) => (
              <img key={index} src={image?.url} alt={`Additional Image ${index + 1}`} className="w-[200px] h-[200px] rounded-sm mx-2" />
            ))
          ) : (
            <p className='mx-2'>No Additional Images</p>
          )}
          </div>
          <div className='text-sm font-semibold text-[#123F7B]/80'>VIDEO</div>
          <div className='flex flex-row space-x-2'>
          {report.video ? (
            <video src={report.video?.url || ''} alt="video" className="w-[400px] h-[400px] rounded-sm mx-2"></video>
          ) : (
            <p className='mx-2'>No Video</p>
          )}
          </div>
        </div>
      </div>
    );
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
                    <div className='bg-[#123F7B]/10 px-2 py-2 rounded-full'>
                      <p className='text-[#123F7B] text-xs font-semibold'>{report.status}</p>
                    </div>
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
                    </TabsList>
                    <TabsContent value='reportinfo'>
                      <ReportInfo />
                    </TabsContent>
                    <TabsContent value='personalinfo'>
                      <PersonalInfo/>
                    </TabsContent>
                    <TabsContent value='physicalinfo'>
                      <PhysicalInfo/>
                    </TabsContent>
                    <TabsContent value='mediaInfo'>
                      <MediaInfo/>
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

{/* <div className="grid grid-cols-2 gap-4">
              <div>
                {renderField('Type', report.type)}
                {renderField('Name', `${report.personInvolved.firstName} ${report.personInvolved.lastName}`)}
                {renderField('Age', report.personInvolved.age)}
                {renderField('Last Seen Date', report.personInvolved.lastSeenDate ? new Date(report.personInvolved.lastSeenDate).toLocaleDateString() : null)}
                {renderField('Last Seen Time', report.personInvolved.lastSeentime)}
                {renderField('Last Known Location', report.personInvolved.lastKnownLocation)}
                {renderField('Status', report.status)}
                {renderField('Follow Up', report.followUp)}
                {renderField('Broadcast Consent', report.broadcastConsent ? 'Yes' : 'No')}
                {renderField('Is Published', report.isPublished ? 'Yes' : 'No')}
                {renderField('Created At', new Date(report.createdAt).toLocaleString())}
                {renderField('Updated At', new Date(report.updatedAt).toLocaleString())}
                {renderField('Reporter', `${report.reporter.firstName} ${report.reporter.lastName}`)}
                {renderField('Reporter Contact', `${report.reporter.number}, ${report.reporter.email}`)}
                {renderField('Assigned Police Station', report.assignedPoliceStation.name)}
                {renderField('Assigned Officer', `${report.assignedOfficer?.firstName} ${report.assignedOfficer?.lastName}`)}
              </div>
              <div>
                <img src={report.personInvolved.mostRecentPhoto?.url || ''} alt="Most Recent Photo" className="w-full h-auto rounded-lg" />
                {report.additionalImages && report.additionalImages.length > 0 ? (
                  report.additionalImages.map((image, index) => (
                    <img key={index} src={image.url} alt={`Additional Image ${index + 1}`} className="w-full h-auto rounded-lg mt-2" />
                  ))
                ) : (
                  <p>No Additional Images</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Broadcast History</h3>
              {report.broadcastHistory && report.broadcastHistory.length > 0 ? (
                report.broadcastHistory.map((history, index) => (
                  <div key={index} className="mb-2">
                    {renderField('Published By', `${history.publishedBy.firstName} ${history.publishedBy.lastName}`)}
                    {renderField('Roles', history.publishedBy.roles.join(', '))}
                    {renderField('Date', new Date(history.date).toLocaleString())}
                  </div>
                ))
              ) : (
                <p>No Broadcast History</p>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Consent Update History</h3>
              {report.consentUpdateHistory && report.consentUpdateHistory.length > 0 ? (
                report.consentUpdateHistory.map((history, index) => (
                  <div key={index} className="mb-2">
                    {renderField('Updated By', `${history.updatedBy.firstName} ${history.updatedBy.lastName}`)}
                    {renderField('Date', new Date(history.date).toLocaleString())}
                  </div>
                ))
              ) : (
                <p>No Consent Update History</p>
              )}
            </div> */}