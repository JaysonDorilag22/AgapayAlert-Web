import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { MdNotifications } from 'react-icons/md';
import tup from '../assets/TUP.png';

const Notifications = () => {

    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New report submitted' },
        { id: 2, message: 'User feedback received' },
        { id: 3, message: 'System update available' },
      ]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="relative">
                <MdNotifications size={24} />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {notifications.length}
                    </span>
                )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-[24px] bg-white shadow-lg rounded-lg">
                <div className='flex flex-col w-full space-y-[10px]'>
                    <div className='flex flex-col space-y-[10px]'>
                        <p className='text-2xl font-semibold text-[#123f7b]'>Notifications</p>
                        <p className='text-md font-light text-[#123f7b]'>You have <strong className='font-semibold text-[#D46A79]'>3 Notifications</strong> today.</p>
                    </div>
                    <div className='flex flex-col space-y-[10px]'>
                        <p className='text-lg font-semibold text-[#123f7b]'>Today</p>
                        <div className='flex flex-col space-y-[10px]'>
                            <div className='flex flex-row py-2 space-x-[10px]'>
                                <img src={tup} alt='TUP' className='w-[50px] h-[50px] rounded-full'/>
                                <div className='flex flex-row justify-between w-full'>
                                    <div className='flex flex-col place-content-center text-wrap text-left pr-8'>
                                        <p className='text-sm font-light text-[#123f7b]'>New <strong className='font-normal text-[#D46A79]'>Absent Report</strong> is assigned to you.</p>
                                        <p className='text-xs font-extralight text-[#123f7b]'>3 minutes ago.</p>
                                    </div>
                                    <div className='bg-[#D46A70] p-[5px] rounded-full place-self-center'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default Notifications;