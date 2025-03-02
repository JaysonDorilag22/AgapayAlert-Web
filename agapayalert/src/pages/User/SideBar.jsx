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

const SideBar = () => {

    return (
        <div className='w-[100px] h-[530px] mx-[40px] p-10 bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 place-items-center justify-center'>
          <div className='flex flex-col justify-between h-full'>
          <div className='flex flex-col space-y-[25px]'>
          <Link to='/'><FiHome className='text-[#123F7B] text-4xl hover:text-[#D46A79]'/></Link>
            <IoDocumentOutline className='text-[#123F7B] text-4xl'/>
            <IoSettingsOutline className='text-[#123F7B] text-4xl'/>
          </div>
          <div>
            <IoLogOutOutline className='text-[#D46A79] text-4xl'/>
          </div>
          </div>
        </div>
    );
};

export default SideBar;

