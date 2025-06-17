import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserList } from "@/redux/actions/userActions";
import { assignOfficer } from "@/redux/actions/reportActions";
import toastUtils from "@/utils/toastUtils";
import { Button } from "@/components/ui/button";
import { MdOutlineContacts, MdOutlineContactPhone, MdOutlineContactEmergency, MdLocationCity } from "react-icons/md";
import { RiPoliceBadgeFill } from "react-icons/ri";
import { TbSpeakerphone } from "react-icons/tb";
import { IoCopyOutline } from 'react-icons/io5';
import { BsSendCheck } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from './../ui/tooltip';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from './../ui/accordion';

// AssignOfficerModal component
const AssignOfficerModal = ({ open, onClose, onAssign, officers, loading }) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 ${open ? '' : 'hidden'}`}>
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-[#123F7B]">Assign Officer</h2>
      {loading ? (
        <div className="py-8 text-center">Loading officers...</div>
      ) : (
        Array.isArray(officers) && officers.length > 0 ? (
          <div className="max-h-60 overflow-y-auto">
            {officers.map(officer => (
              <div
                key={officer._id}
                className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer"
                onClick={() => onAssign(officer)}
              >
                <img src={officer.avatar?.url || "https://via.placeholder.com/40"} alt="avatar" className="w-10 h-10 rounded-full mr-3 border" />
                <div>
                  <div className="font-semibold">{officer.firstName} {officer.lastName}</div>
                  {officer.badgeNumber && <div className="text-xs text-gray-500">Badge #{officer.badgeNumber}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">No officers found.</div>
        )
      )}
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} className="bg-gray-200 text-[#123F7B] mr-2">Cancel</Button>
      </div>
    </div>
  </div>
);


const ReportInfo = ({ report }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);

  // Only show assign button if all conditions are met
  const canAssignOfficer =
    !report.assignedOfficer &&
    user?.roles?.includes("police_admin") &&
    report.status === "Pending";

  // Handler to open modal and load officers
  const handleOpenAssignModal = async () => {
  setLoadingOfficers(true);
  try {
    const res = await dispatch(getUserList({ role: "police_officer", policeStation: report.assignedPoliceStation?._id }));
    // Correctly extract the officers array
    setOfficers(Array.isArray(res?.data?.users) ? res.data.users : []);
  } catch (e) {
    setOfficers([]);
    toastUtils("Failed to load officers", "error");
  }
  setLoadingOfficers(false);
  setShowAssignModal(true);
};

  // Handler to assign officer
  const handleAssignOfficer = async (officer) => {
    const result = await dispatch(assignOfficer({ reportId: report._id, officerId: officer._id }));
    if (result.success) {
      toastUtils("Officer assigned successfully");
      setShowAssignModal(false);
      // Optionally reload report details here
    } else {
      toastUtils(result.error || "Failed to assign officer", "error");
    }
  };
  
    const renderField = (label, value) => (
      <div className='flex flex-col gap-0'>
        <div className='text-md font-semibold text-[#123F7B] '>{value !== undefined && value !== null && value !== '' ? value : 'No Data'}</div>
        <div className='text-xs font-extralight text-[#123F7B]/60 italic'>{label}</div>
      </div>
    );

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
                    <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(report.reporter.number)} />
                  </TooltipTrigger>
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
                    <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(report.reporter.email)} />
                  </TooltipTrigger>
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
        <div className="mb-4">
        {report.assignedOfficer ? (
          <div className="flex items-center">
            <img src={report.assignedOfficer.avatar?.url || "https://via.placeholder.com/40"} alt="avatar" className="w-10 h-10 rounded-full mr-3 border" />
            <div>
              <div className="font-semibold">{report.assignedOfficer.firstName} {report.assignedOfficer.lastName}</div>
              {report.assignedOfficer.badgeNumber && <div className="text-xs text-gray-500">Badge #{report.assignedOfficer.badgeNumber}</div>}
            </div>
          </div>
        ) : (
          canAssignOfficer && (
            <Button className="bg-[#123F7B] text-white" onClick={handleOpenAssignModal}>
              Assign Officer
            </Button>
          )
        )}
      </div>
      {/* Assign Officer Modal */}
      <AssignOfficerModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignOfficer}
        officers={officers}
        loading={loadingOfficers}
      />
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
        {report.followUp && report.followUp.length > 0 && (
          <div className='flex flex-col place-items-start mt-2'>
            <Accordion type="single" collapsible className='w-full space-y-1'>
              <AccordionItem value="followUp" className='w-full hover:bg-[#123F7B]/10 hover:rounded-xl'>
                <AccordionTrigger className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] px-2 py-1 rounded-xl'>
                  <div className='flex flex-col place-items-start justify-start -space-y-1'>
                    <p className='text-[#123F7B] text-sm font-semibold'>Follow Ups</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {report.followUp.map((item, index) => (
                    <div key={item._id} className='flex flex-col place-items-start p-4 border-b border-[#123F7B]/20'>
                      <p className='text-[#123F7B] text-xs font-semibold'>{index + 1}</p>
                      <p className='text-[#D46A79] text-[10px] font-light'>{new Date(item.updatedAt).toLocaleString()}</p>
                      <p>{item.note}</p>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    );
};

export default ReportInfo;