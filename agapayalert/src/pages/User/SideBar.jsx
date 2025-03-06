import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

const SideBar = () => {

    return (
        <div className='w-[100px] h-[530px] mx-[40px] p-10 bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 place-items-center justify-center'>
          <div className='flex flex-col justify-between h-full'>
          <div className='flex flex-col space-y-[25px]'>
          <Link to='/'><FiHome className='text-[#123F7B] text-4xl hover:text-[#D46A79]'/></Link>
          <Link to='/profile/report'><IoDocumentOutline className='text-[#123F7B] text-4xl hover:text-[#D46A79]'/></Link>
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

