import React from 'react';
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

export const ReportInfo = ({ report }) => {
    
    const handleCopyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard: ', text);
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
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
        {report.assignedOfficer && (
          <div className='flex flex-row place-items-start mt-2'>
            <RiPoliceBadgeFill className="mr-2 text-lg" />
            {renderField('Assigned Officer', `${report.assignedOfficer.firstName} ${report.assignedOfficer.lastName}`)}
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