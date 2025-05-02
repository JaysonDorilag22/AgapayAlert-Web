import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { FaArrowLeft } from "react-icons/fa6";
import { LuBell } from "react-icons/lu";
import { LiaFacebookMessenger } from "react-icons/lia";
import { TbBrandFacebook } from "react-icons/tb";
import { IoIosRadio } from "react-icons/io";
import { PiCity } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";

export const BroadcastReport = ({ reportId, onClose }) => {

return (
    <div className=' flex flex-col place-items-center content-center justify-center pb-4 w-full h-full'>
        <div className='flex flex-row place-items-center justify-center w-full px-8'>
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
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <LuBell className='w-6 h-6 text-[#2173E1]' />
                                </div>
                                <div className='flex flex-col -space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>Push Notifications</p>
                                    <p className='text-[#123F7B] text-xs font-extralight'>Send push notification to users.</p>
                                </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <LiaFacebookMessenger className='w-6 h-6 text-[#2173E1]' />
                                </div>
                                <div className='flex flex-col space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>Messenger App</p>
                                    <p className='text-[#123F7B] text-xs font-extralight leading-none'>Send notification through the Messenger app to registered users.</p>
                                </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <TbBrandFacebook className='w-6 h-6 text-[#2173E1]' />
                                </div>
                                <div className='flex flex-col -space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>Facebook Post</p>
                                    <p className='text-[#123F7B] text-xs font-extralight leading-none'>Create a post to AgapayAlert’s Facebook page.</p>
                                </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <IoIosRadio className='w-6 h-6 text-[#123F7B]' />
                                </div>
                                <div className='flex flex-col -space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>All</p>
                                    <p className='text-[#123F7B] text-xs font-extralight leading-none'>Use all available channels.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
                        <div className='justify-start w-full'>
                            <p className='text-start font-semibold'>Scope Options</p>
                        </div>
                        <div className='flex flex-col place-items-center justify-center w-full h-full space-y-1'>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <PiCity className='w-6 h-6 text-[#7B61FF]' />
                                </div>
                                <div className='flex flex-col -space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>City</p>
                                    <p className='text-[#123F7B] text-xs font-extralight'>Send to users within a city radius.</p>
                                </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <CiLocationOn className='w-6 h-6 text-[#2173E1]' />
                                </div>
                                <div className='flex flex-col space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>Radius</p>
                                    <p className='text-[#123F7B] text-xs font-extralight leading-none'>Send to users within specific radius.</p>
                                </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-start w-full h-full space-x-2 border border-[#123F7B] px-2 py-3 rounded-xl hover:bg-[#123F7B]/10 hover:border-2 cursor-pointer'>
                                <div>
                                    <FaUsers className='w-6 h-6 text-[#123F7B]' />
                                </div>
                                <div className='flex flex-col -space-y-0.5 pr-1'>
                                    <p className='text-[#123F7B] text-sm font-normal'>All Users</p>
                                    <p className='text-[#123F7B] text-xs font-extralight leading-none'>Send to all users.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row place-items-end justify-end w-full h-full'>
                        <button className='bg-[#123F7B] text-white text-md font-normal px-6 py-3 rounded-2xl hover:bg-[#123F7B]/80'>
                        Broadcast Now
                        </button>
                </div>
            </div>
        </div>
    </div>     
  );
}

export default BroadcastReport;