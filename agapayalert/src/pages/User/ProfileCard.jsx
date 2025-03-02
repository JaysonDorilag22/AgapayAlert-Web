import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import tilewhite from '../../assets/tilelogowhite.png';
import tileblue from '../../assets/tilelogoblue.png';
import { FiHome } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { formatDateToMonthYear } from '../../utils/dateUtils';

const ProfileCard = () => {
    const user = useSelector((state) => state.auth.user);
    
    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          console.log('Copied to clipboard: ', text);
        }).catch((err) => {
          console.error('Failed to copy text: ', err);
        });
      };

    return (
        
        <div className='relative flex flex-row justify-center place-items-center'>
            <div className='relative w-[620px] h-[530px] mx-[10px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                <div className='relative h-[150px] w-full overflow-hidden'>
                    <div className='absolute top-0 left-0 h-[150px] w-full bg-cover bg-center  blur-sm' style={{ backgroundImage: `url(${tileblue})`}}></div>
                    <div className='absolute top-0 left-0 h-[180px] w-[650px] bg-[#123F7B] opacity-75 mix-blend-multiply'></div>
                </div>
                <div className='absolute top-0 left-0 py-8 px-6 h-full w-full flex flex-row items-center justify-start space-x-4'>
                    <div className='flex flex-col w-[200px] h-[450px] space-y-4 bg-white shadow-lg shadow-[#123f7b]/25 rounded-tr-[45px] rounded-bl-[45px] overflow-hidden place-items-center pb-4'>
                    <img src={user?.avatar?.url} alt='tilelogo' className='h-3/5 w-full rounded-bl-[45px] object-cover'/>
                    <div className='flex flex-col border-2 border-[#123F7B] space-y-2 w-[180px] h-2/5 m-4 rounded-tr-[45px] rounded-bl-[45px] place-items-center justify-center content-center'>
                        <p className='text-[#D46A79] text-3xl font-semibold'>6</p>
                        <p className='text-[#123F7B] text-md font-semibold'>REPORTS CREATED</p>
                    </div>
                    </div>
                    <div className='flex flex-col h-[450px] grow pt-12 place-items-start justify-start space-y-4'>
                    <div className='flex flex-col place-items-start justify-start pb-1'>
                        <p className='text-2xl font-extrabold'>{user?.firstName} {user?.lastName}</p>
                        <div className='bg-white rounded-full py-0.5 px-2 place-items-center border border-[#D46A79]'>
                        <p className='text-[#D46A79] text-xs font-medium'>{user?.roles[0]}</p>
                        </div>
                    </div>
                    <div className='flex flex-col place-items-start w-full space-y-4'>
                        <div className='flex flex-row w-full place-items-center justify-start space-x-8'> 
                        <div className='flex flex-row place-items-center space-x-1.5'>
                            <IoCalendarClearOutline className='text-[#D46A79] text-2xl' />
                            <p className='text-[#123F7B] text-sm font-normal'>Joined {formatDateToMonthYear(user?.createdAt)}</p>
                        </div>
                        <div className='flex flex-row place-items-center space-x-1'>
                            <IoLocationOutline className='text-[#D46A79] text-2xl' />
                            <p className='text-[#123F7B] text-sm font-normal'>{user?.address?.city}</p>
                        </div>
                        </div>
                        <div className='flex flex-col place-items-start justify-start space-y-2'>
                        <div className='flex flex-row place-items-center justify-start space-x-2'>
                            <p className='text-[#D46A79] text-sm font-normal'>Email:</p>
                            <p className='text-[#123F7B] text-sm font-semibold'>{user?.email}</p>
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(user?.email)} /></TooltipTrigger>
                                <TooltipContent>
                                <p className='text-[#123F7B] text-xs font-light'>Copy to clipboard</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className='flex flex-row place-items-center justify-start space-x-2'>
                            <p className='text-[#D46A79] text-sm font-normal'>Contact No.:</p>
                            <p className='text-[#123F7B] text-sm font-semibold'>{user?.number}</p>
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                <IoCopyOutline className='text-[#123F7B] text-md cursor-pointer' onClick={() => handleCopyToClipboard(user?.number)} /></TooltipTrigger>
                                <TooltipContent>
                                <p className='text-[#123F7B] text-xs font-light'>Copy to clipboard</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </div>
                        </div>
                        <div className='flex flex-col place-items-start space-y-2 w-full'>
                        <p className='text-[#123F7B] text-md font-semibold'>Recent Activities</p>
                        <div className='flex flex-col place-items-center justify-start space-y-2 w-full'>
                            <div className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                <p className='text-[#123F7B] text-xs font-semibold'>Created a report</p>
                                <p className='text-[#D46A79] text-[10px] font-light'>3 hours ago</p>
                            </div>
                            <div className='flex flex-col place-items-end justify-end'>
                                <GoClock className='text-[#123F7B] text-xl font-light' />
                            </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                <p className='text-[#123F7B] text-xs font-semibold'>Created a report</p>
                                <p className='text-[#D46A79] text-[10px] font-light'>9 hours ago</p>
                            </div>
                            <div className='flex flex-col place-items-end justify-end'>
                                <GoClock className='text-[#123F7B] text-xl font-light' />
                            </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] bg-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                <p className='text-xs font-semibold'>Report closed</p>
                                <p className='text-[10px] font-light'>2 days ago</p>
                            </div>
                            <div className='flex flex-col place-items-end justify-end'>
                                <IoMdCheckmarkCircleOutline className='text-white text-xl font-light' />
                            </div>
                            </div>
                            <div className='flex flex-row place-items-center justify-between w-full border border-[#123F7B] bg-[#123F7B] px-2 py-1 rounded-xl'>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                                <p className='text-xs font-semibold'>Report closed</p>
                                <p className='text-[10px] font-light'>7 days ago</p>
                            </div>
                            <div className='flex flex-col place-items-end justify-end'>
                                <IoMdCheckmarkCircleOutline className='text-white text-xl font-light' />
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className='relative w-[250px] h-[530px] mx-[40px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                <div className='flex flex-col place-items-start px-4 py-6 space-y-4 h-full text-[#123F7B]'>
                    <p className='text-xl font-semibold'>Reports</p>
                    <div className='flex flex-col place-items-start justify-stretch h-full w-full'>
                    <div className='flex flex-col place-items-center space-y-2 w-full'>
                        <div className='flex flex-row place-items-center justify-start space-x-2 w-full  h-full bg-[#123F7B] p-2 rounded-xl'>
                        <img src={tileblue} alt='tilelogo' className='h-[100px] w-[90px] rounded-xl object-cover'/>
                        <div className='flex flex-col place-items-start justify-start space-y-3 w-full h-full'>
                            <div className='flex flex-col place-items-start justify-start space-y-1'>
                            <GoClock className='text-white text-xl font-light' />
                            <div className='bg-white rounded-full -py-0.5 px-2 place-items-center border border-[#D46A79]'>
                                <p className='text-[#D46A79] text-xs font-normal'>Missing</p>
                            </div>
                            </div>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                            <p className='text-white text-xs font-semibold'>Juan Dela Cruz</p>
                            <p className='text-white text-[10px] font-light'>3 hours ago</p>
                            </div>
                        </div>
                        </div>
                        <div className='flex flex-row place-items-center justify-start space-x-2 w-full  h-full bg-[#123F7B] p-2 rounded-xl'>
                        <img src={tileblue} alt='tilelogo' className='h-[100px] w-[90px] rounded-xl object-cover'/>
                        <div className='flex flex-col place-items-start justify-start space-y-3 w-full h-full'>
                            <div className='flex flex-col place-items-start justify-start space-y-1'>
                            <GoClock className='text-white text-xl font-light' />
                            <div className='bg-white rounded-full -py-0.5 px-2 place-items-center border border-[#D46A79]'>
                                <p className='text-[#D46A79] text-xs font-normal'>Missing</p>
                            </div>
                            </div>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                            <p className='text-white text-xs font-semibold'>Juan Dela Cruz</p>
                            <p className='text-white text-[10px] font-light'>3 hours ago</p>
                            </div>
                        </div>
                        </div><div className='flex flex-row place-items-center justify-start space-x-2 w-full  h-full bg-[#123F7B] p-2 rounded-xl'>
                        <img src={tileblue} alt='tilelogo' className='h-[100px] w-[90px] rounded-xl object-cover'/>
                        <div className='flex flex-col place-items-start justify-start space-y-3 w-full h-full'>
                            <div className='flex flex-col place-items-start justify-start space-y-1'>
                            <GoClock className='text-white text-xl font-light' />
                            <div className='bg-white rounded-full -py-0.5 px-2 place-items-center border border-[#D46A79]'>
                                <p className='text-[#D46A79] text-xs font-normal'>Missing</p>
                            </div>
                            </div>
                            <div className='flex flex-col place-items-start justify-start -space-y-1'>
                            <p className='text-white text-xs font-semibold'>Juan Dela Cruz</p>
                            <p className='text-white text-[10px] font-light'>3 hours ago</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className='flex flex-col place-items-center w-full'>
                        <button className='bg-[#123F7B] text-white rounded-xl px-4 py-1'>View All</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;