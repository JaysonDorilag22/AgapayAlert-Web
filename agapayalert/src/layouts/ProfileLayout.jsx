import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import tilewhite from '../assets/tilelogowhite.png';
import tileblue from '../assets/tilelogoblue.png';
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
} from "../components/ui/tooltip";
import { formatDateToMonthYear } from '../utils/dateUtils';
import SideBar from '@/pages/User/SideBar';
import ProfileCard from '@/pages/User/ProfileCard';

const ProfileLayout = ({children}) => {
  const user = useSelector((state) => state.auth.user);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard: ', text);
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="profile-layout relative w-full h-screen">
      <div className='absolute inset-0 bg-gradient-to-tr from-[#123F7B] to-white'></div>
      <div className='absolute inset-0 bg-cover bg-center opacity-10' style={{ backgroundImage: `url(${tilewhite})` }}></div>
      <div className='relative flex flex-row w-full h-screen justify-center place-items-center text-white'>
        <SideBar />
          {children}
      </div>
    </div>
  );
};

export default ProfileLayout;