import React from 'react';
import { MdOutlineInvertColors, MdOutlineBloodtype } from "react-icons/md";
import { RiUserCommunityLine, RiEye2Line  } from "react-icons/ri";
import { GiScarWound, GiMedicines } from "react-icons/gi";
import { LuFileUser } from "react-icons/lu";
import { SiWeightsandbiases } from "react-icons/si";

export const PhysicalInfo = ({ report }) => {
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