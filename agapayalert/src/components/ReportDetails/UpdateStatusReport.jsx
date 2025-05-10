import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

export const UpdateStatusReport = ({ onClose, onSubmit, currentStatus  }) => {

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
        <div>

        </div>
    </div>
  </div>
);
}

export default UpdateStatusReport;