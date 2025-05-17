import React from 'react';
import { useSelector } from 'react-redux';
import tileblue from '../../assets/tilelogoblue.png';
import { GoClock } from "react-icons/go";
import { FaCheck, FaSearch } from "react-icons/fa";
import ProfileLayout from '@/layouts/ProfileLayout';
import { CiLocationOn } from "react-icons/ci";
import { IoCalendarClearOutline, IoCallOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { PiWarningCircle } from 'react-icons/pi';


const ReportCard = () => {

    const user = useSelector((state) => state.auth.user);
    
    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          console.log('Copied to clipboard: ', text);
        }).catch((err) => {
          console.error('Failed to copy text: ', err);
        });
      };

    return (
    <ProfileLayout>
        <div className='relative flex flex-row justify-center place-items-center'>
            <div className='relative w-[620px] h-[530px] mx-[10px] bg-white rounded-[45px] py-4 px-6 shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                
                <div className='flex flex-col place-items-start space-y-4 w-full h-full text-[#123F7B] overflow-hidden'>
                    <div className='w-full'>
                        <div className='w-full'>
                            <form className="relative w-full">
                                <input
                                type="text"
                                name="search"
                                placeholder="Search by First Name or Last Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#123F7B] focus:border-white"
                                />
                                <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 bg-[#123F7B] text-white px-4 py-2 rounded-full">
                                <FaSearch />
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className='flex flex-col place-items-start space-y-2 w-full'>
                        <div className='w-full'>
                            <p className='text-2xl font-bold'>Reports</p>
                        </div>
                        <div className='flex flex-row w-max place-items-center space-x-4'>
                            <div className='border border-[#123F7B] bg-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal text-white font-normal'>All</p>
                            </div>
                            <div className='border border-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal font-normal'>Pending</p>
                            </div>
                            <div className='border border-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal font-normal'>Under Investigation</p>
                            </div>
                            <div className='border border-[#123F7B] rounded-full px-2 py-0.5'>
                                <p className='text-normal font-normal'>Resolved</p>
                            </div>
                        </div>
                        <div className='flex flex-col h-3/5 w-full space-y-4 overflow-auto pb-8 pr-2 mb-4'>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row w-full h-max bg-[#F5F5F5] rounded-md justify-between  shadow-md shadow-[#123f7b]/25'>
                                <div className='bg-[#FBBC05] w-1.5 rounded-l-md'></div>
                                <div className='flex flex-row w-full m-2 justify-between'>
                                    <div className='flex flex-row place-items-center space-x-1.5'>
                                        <img src={tileblue} alt="Tile Logo" className='w-24 h-24 rounded-lg' />
                                        <div className='flex flex-col h-full w-max justify-between'>
                                            <div className='-space-y-1'>
                                                <p className='text-md font-bold'>John Doe</p>
                                                <p className='text-sm font-light'>Last scene on January 12, 2025 at 12:50 PM</p>
                                            </div>
                                            <div className='-space-y-0.5'>
                                                <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                                    <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                                </div>
                                                <p className='font-semibold text-sm'>4 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col place-content-end'>
                                        <div className='bg-[#FBBC05] rounded-full w-max px-2 py-0.5'>
                                            <p className='text-white font-normal text-sm'>Pending</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className='relative w-[250px] h-[530px] mx-[40px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                <div className='flex flex-col content-start justify-start px-4 py-6 space-y-2 h-full text-[#123F7B] overflow-auto'>
                    <div>
                        <p className='text-lg font-semibold'>Report Progress</p>
                    </div>
                    <div className='flex flex-col space-y-2 h-max w-full overflow-auto  pb-4 px-1'>
                        <div className='flex flex-col w-full h-max bg-[#F5F5F5] rounded-lg justify-between shadow-md shadow-[#123f7b]/25 space-y-2 p-2'>
                            <div>
                                <p className='text-md font-semibold'>Status</p>
                            </div>
                            <div className='flex flex-row place-items-center justify-center space-x-2 text-white '>
                                <div className='bg-[#123F7B] rounded-md px-4 py-1'>
                                    <FaCheck className='text-xs' />
                                </div>
                                <div className='border border-[#123F7B] bg-[#123F7B]/25 rounded-md px-4 py-0.5'>
                                    <p className='text-xs'>2</p>
                                </div>
                                <div className='bg-[#123F7B]/25 rounded-md px-4 py-0.5'>
                                    <p className='text-xs'>3</p>
                                </div>
                                <div className='bg-[#123F7B]/25 rounded-md px-4 py-0.5'>
                                    <p className='text-xs'>4</p>
                                </div>
                            </div>
                            <div>
                                <p className='text-xs font-light leading-none'>
                                    Your report is currently in <strong className='font-semibold'>STEP 2</strong>. The case is handled by an officer and it’s <strong className='font-semibold'>UNDER INVESTIGATION</strong>.
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col w-full h-max bg-[#F5F5F5] rounded-lg justify-between shadow-md shadow-[#123f7b]/25 space-y-2 p-2'>
                            <div>
                                <p className='text-md font-semibold'>Assigned Officer</p>
                            </div>
                            <div className='flex flex-row place-items-center justify-start space-x-1 px-1'>
                                <div>
                                    <img src={tileblue} alt="Tile Logo" className='w-14 h-14 rounded-lg' />
                                </div>
                                <div className='flex flex-col h-full w-max content-between space-y-1'>
                                    <p>
                                        <span className='text-xs font-semibold leading-none'>Officer Name</span>
                                    </p>
                                    <div className='flex flex-col space-y-0.5'>
                                    <div className='flex flex-row space-x-1 place-items-center'>
                                        <CiLocationOn className='text-[#D46A79] text-sm' />
                                        <p className='text-xs font-normal'>Taguig</p>
                                    </div>
                                    <div className='flex flex-row space-x-1 place-items-center'>
                                        <IoCallOutline className='text-[#D46A79] text-sm' />
                                        <p className='text-xs font-normal'>09123456789</p>
                                    </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full h-max bg-[#F5F5F5] rounded-lg justify-between shadow-md shadow-[#123f7b]/25 space-y-2 p-2'>
                            <div>
                                <p className='text-md font-semibold'>Details</p>
                            </div>
                            <div className='flex flex-col space-y-1 w-full h-max'>
                                <div className='flex flex-col space-y-0.5 w-full place-items-center'>
                                    <img src={tileblue} alt="Tile Logo" className='w-14 h-14 rounded-full' />
                                    <p className='text-sm font-semibold'>John Doe</p>
                                    <div className='border border-[#D46A79] bg-white rounded-full px-2 w-max'>
                                        <p className='text-[#D46A79] font-extralight text-xs'>Missing</p>
                                    </div>
                                    <div className='flex flex-row space-x-1 place-items-center'>
                                        <div className='flex flex-row space-x-0.5'>
                                            <LuUsersRound className='text-[#D46A79] text-sm' />
                                            <p className='text-xs font-normal'>Sibling</p>
                                        </div>
                                        <p>|</p>
                                        <div className='flex flex-row space-x-0.5'>
                                            <PiWarningCircle className='text-[#D46A79] text-sm' />
                                            <p className='text-xs font-normal'>2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col space-y-1 w-full h-max'>
                                    <p className='text-sm font-semibold'>Personal Info</p>
                                    <div className='flex flex-col space-y-2 w-full place-items-start p-1'>
                                        <div className='flex flex-row space-x-0.5'>
                                            <IoCalendarClearOutline className='text-[#D46A79] text-3xl' />
                                            <div className='flex flex-col -space-y-0.5'>
                                                <p className='text-xs font-light text-[#D46A79]'>Date of birth</p>
                                                <p className='text-xs font-semibold'>January 12, 2000</p>                                           
                                            </div>
                                        </div>
                                        <div className='flex flex-row space-x-0.5'>
                                            <IoCalendarClearOutline className='text-[#D46A79] text-3xl' />
                                            <div className='flex flex-col -space-y-0.5'>
                                                <p className='text-xs font-light text-[#D46A79]'>Date of birth</p>
                                                <p className='text-xs font-semibold'>January 12, 2000</p>                                           
                                            </div>
                                        </div>
                                        <div className='flex flex-row space-x-0.5'>
                                            <IoCalendarClearOutline className='text-[#D46A79] text-3xl' />
                                            <div className='flex flex-col -space-y-0.5'>
                                                <p className='text-xs font-light text-[#D46A79]'>Date of birth</p>
                                                <p className='text-xs font-semibold'>January 12, 2000</p>                                           
                                            </div>
                                        </div>
                                        <div className='flex flex-row space-x-0.5'>
                                            <IoCalendarClearOutline className='text-[#D46A79] text-3xl' />
                                            <div className='flex flex-col -space-y-0.5'>
                                                <p className='text-xs font-light text-[#D46A79]'>Date of birth</p>
                                                <p className='text-xs font-semibold'>January 12, 2000</p>                                           
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ProfileLayout>
    );
};

export default ReportCard;
