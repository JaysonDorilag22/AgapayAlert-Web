import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { GrInProgress } from "react-icons/gr";
import { FaUserCheck } from "react-icons/fa6";
import { PiDetectiveFill } from "react-icons/pi";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { IoArchiveOutline } from "react-icons/io5";

export const UpdateStatusReport = ({ onClose, onSubmit, currentStatus}) => {

return (
    <div className='flex flex-col place-items-center content-center justify-center pb-4 w-full h-full'>
    <div className='flex flex-row place-items-center justify-center w-full px-8'>
      <div
        className='flex flex-row place-items-center justify-center py-2 px-4 space-x-2 cursor-pointer hover:bg-[#123f7b]/15 hover:rounded-xl'
        onClick={onClose}
      >
        <FaArrowLeft className='w-6 h-6 text-[#123F7B]' />
        <p className='text-[#123F7B] text-md font-normal'>Go Back</p>
      </div>
    </div>
    <div className='flex flex-col place-items-center justify-center w-full h-full px-4 py-2 space-y-4'>
        <div className='flex flex-col place-items-start justify-start w-full h-full space-y-1'>
          <p className='text-[#123F7B] text-lg font-bold'>Update Report Status</p>
          <p className='text-[#123F7B] text-sm font-normal leading-4'>
          Update the progress of the report by selecting a status from the options below. Each update will notify the reportee about the case.
          </p>
        </div>
        <div className="flex flex-col place-items-center justify-center w-full h-full space-y-1">
          <div className="flex flex-col items-start content-center w-full h-full space-y-1">
            <div className='justify-start w-full'>
                <p className='text-start font-semibold'>Status Options</p>
            </div>
            <div className="flex flex-row w-full h-full place-items-center content-center justify-center">
              <div className="flex flex-col w-max h-max place-items-center content-center justify-center space-y-1">
                <div className="flex flex-col items-center justify-center w-max h-max bg-[#F4C430]/10 border-4 border-[#F4C430] rounded-full">
                  <GrInProgress className="w-6 h-6 text-[#123F7B] m-4" />
                </div>
                <p className="text-[#F4C430] text-xs font-bold">Pending</p>
              </div>
              <div className="flex flex-col w-max h-full content-stretch justify-items-stretch space-y-1">
                <div className="flex flex-col content-stretch w-full h-full my-6 border border-dashed border-2 px-4 border-[#123F7B]">
                </div>
                <p className="text-[#F4C430]/0 text-xs font-bold my-4">5</p>
              </div>
              <div className="flex flex-col w-max h-max place-items-center content-center justify-center space-y-1">
                <div className="flex flex-col items-center justify-center w-max h-max border-2 border-[#123F7B] rounded-full">
                  <FaUserCheck className="w-6 h-6 text-[#123F7B] m-4" />
                </div>
                <p className="text-[#123F7B] text-xs font-semibold">Assigned</p>
              </div>
              <div className="flex flex-col w-max h-full content-stretch justify-items-stretch space-y-1">
                <div className="flex flex-col content-stretch w-full h-full my-6 border border-dashed border-2 px-4 border-[#123F7B]">
                </div>
                <p className="text-[#F4C430]/0 text-xs font-bold my-4">5</p>
              </div>
              <div className="flex flex-col items-center justify-center w-max h-max  space-y-1">
                <div className="flex flex-col items-center justify-center w-max h-max border-2 border-[#123F7B] rounded-full">
                  <PiDetectiveFill className="w-6 h-6 text-[#123F7B] m-4" />
                </div>
                <p className="text-[#123F7B] text-[8.5px] font-semibold text-center w-max break-words">
                  Investigating
                </p>
              </div>
              <div className="flex flex-col w-max h-full content-stretch justify-items-stretch space-y-1">
                <div className="flex flex-col content-stretch w-full h-full my-6 border border-dashed border-2 px-4 border-[#123F7B]">
                </div>
                <p className="text-[#F4C430]/0 text-xs font-bold my-4">5</p>
              </div>
              <div className="flex flex-col w-max h-max place-items-center content-center justify-center space-y-1">
                <div className="flex flex-col items-center justify-center w-max h-max border-2 border-[#123F7B] rounded-full">
                  <HiOutlineDocumentCheck className="w-6 h-6 text-[#123F7B] m-4" />
                </div>
                <p className="text-[#123F7B] text-xs font-semibold">Resolved</p>
              </div>
              <div className="flex flex-col w-max h-full content-stretch justify-items-stretch space-y-1">
                <div className="flex flex-col content-stretch w-full h-full my-6 border border-dashed border-2 px-4 border-[#123F7B]/0">
                </div>
                <p className="text-[#F4C430]/0 text-xs font-bold my-4">5</p>
              </div>
              <div className="flex flex-col w-max h-max place-items-center content-center justify-center space-y-1">
                <div className="flex flex-col items-center justify-center w-max h-max bg-[#717171]/10 border-2 border-[#717171] rounded-full">
                  <IoArchiveOutline className="w-6 h-6 text-[#717171] m-4" />
                </div>
                <p className="text-[#717171] text-xs font-semibold">Archived</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
              <div className='justify-start w-full'>
                <p className='text-start font-semibold'>Follow-up Notes</p>
              </div>
              <div className='flex flex-col w-full h-full space-y-2'>
                <textarea
                  className='w-full h-20 border-2 border-[#123F7B] rounded-lg p-2'
                  placeholder='Add any follow-up notes or comments here...'
                ></textarea>
                <p className='text-[#123F7B] text-xs font-normal leading-4'>
                  Notes will be visible to the reportee and other users with access to this report.
                </p>
              </div>
          </div>
        </div>
        <div className='flex flex-row place-items-end justify-end w-full h-full'>
            <button
              className='bg-[#123F7B] text-white text-md font-normal px-6 py-3 rounded-2xl hover:bg-[#123F7B]/80'
              
            >
              Update
            </button>
          </div>
    </div>
  </div>
);
}

export default UpdateStatusReport;