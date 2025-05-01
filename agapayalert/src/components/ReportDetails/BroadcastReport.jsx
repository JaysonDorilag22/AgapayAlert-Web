import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { FaArrowLeft } from "react-icons/fa6";
import { LuBell } from "react-icons/lu";

export const BroadcastReport = ({ reportId, onClose }) => {

return (
    <div className=' flex flex-col place-items-center content-center justify-center p-4 w-full h-full'>
        <div className='flex flex-row place-items-center justify-center w-full p-8'>
            <div className='flex flex-row place-items-center justify-center py-2 px-4 space-x-2 cursor-pointer hover:bg-[#123f7b]/15 hover:rounded-xl' onClick={onClose} >
                <FaArrowLeft className='w-6 h-6 text-[#123F7B]'/>
                <p className='text-[#123F7B] text-md font-normal'>Go Back</p>
            </div> 
        </div>
        <div className='flex flex-col place-items-center justify-center w-full h-full px-4 py-2 space-y-4'>
            <div className='flex flex-col place-items-start justify-start w-full h-full space-y-1'>
                <p className='text-[#123F7B] text-lg font-bold'>Broadcast Report</p>
                <p className='text-[#123F7B] text-sm font-normal leading-4'>Inform the users about the case by picking the options from the two categories below. You can undo the action by clicking the hide button from the profile.</p>
            </div>
            <div className='flex flex-col place-items-center justify-center w-full h-full space-y-1'>
                <div className='flex flex-row items-start content-center justify-center w-full h-full space-x-4'>
                    <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
                        <div className='justify-start w-full'>
                            <p className='text-start font-semibold'>Channel Options</p>
                        </div>
                        <div className='flex flex-col place-items-center justify-center w-full h-full space-y-1'>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-2 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <LuBell className='w-6 h-6 text-[#2173E1]' />
                                </div>
                                <div className='flex flex-col -space-y-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>Push Notifications</p>
                                    <p className='text-[#123F7B] text-xs font-extralight'>Send push notification to users.</p>
                                </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-2 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <LuBell className='w-6 h-6 text-[#2173E1]' />
                                </div>
                                <div className='flex flex-col -space-y-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>Push Notifications</p>
                                    <p className='text-[#123F7B] text-xs font-extralight'>Send push notification to users.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
                        <div className='justify-start w-full'>
                            <p className='text-start font-semibold'>Scope Options</p>
                        </div>

                    </div>
                </div>
                <div>
                    2
                </div>
            </div>
        </div>
    </div>     
  );
}

export default BroadcastReport;