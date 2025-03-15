import React from 'react';
import { FaUserTag  } from 'react-icons/fa';
import { MdOutlineContactPhone } from "react-icons/md";
import { RiUserLocationLine } from "react-icons/ri";
import { GiClothes } from "react-icons/gi";
import { TbCalendarUser } from "react-icons/tb";
import { PiGenderIntersexLight } from "react-icons/pi";
import { HiCalendarDateRange } from "react-icons/hi2";
import { format } from 'date-fns';

export const PersonalInfo = ({ report }) => {
    const formattedDateOfbirth = report ? format(new Date(report.personInvolved.dateOfBirth), 'MMMM dd, yyyy') : '';
    const formattedLastSeenDate = report ? format(new Date(report.personInvolved.lastSeenDate), 'MMMM dd, yyyy') : '';

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