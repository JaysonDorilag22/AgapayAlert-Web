import React from 'react';
import { useSelector } from 'react-redux';
import tileblue from '../../assets/tilelogoblue.png';
import { GoClock } from "react-icons/go";
import ProfileLayout from '@/layouts/ProfileLayout';

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
            <div className='relative w-[620px] h-[530px] mx-[10px] bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 overflow-hidden'>
                
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
    </ProfileLayout>
    );
};

export default ReportCard;
