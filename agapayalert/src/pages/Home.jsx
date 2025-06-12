import React from "react";
import mobileMU from "../assets/mobileappMU.svg";
import { RxArrowRight } from "react-icons/rx";
import { FaStar } from 'react-icons/fa';
import { GoClock } from "react-icons/go";
import makati from "../assets/pnplogo/MakatiLogo.svg";
import taguig from "../assets/pnplogo/TaguigLogo.svg";
import pasay from "../assets/pnplogo/PasayLogo.svg";
import paranaque from "../assets/pnplogo/ParanaqueLogo.svg";
import pateros from "../assets/pnplogo/PaterosLogo.svg";
import tup from "../assets/TUP.png";
import { FaHandsHelping } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { AiOutlineSafety } from "react-icons/ai";


const Home = () => {
    return (
        <div className="h-dvh">
        <div className="Container bg-[#123F7B] h-5/6 rounded-[75px] overflow-hidden content-center justify-between px-16 py-4 lg:px-44 lg:py-10">
          <div className="flex flex-col lg:flex-row place-items-center justify-between space-y-8 lg:space-y-0 lg:space-x-24">
            <div className="flex flex-col w-full max-w-lg text-center lg:text-left place-items-center lg:place-items-start">
              <p className="text-white text-2xl lg:text-4xl font-extrabold">Hold the Future of Public Safety in Your Hands</p>
              <p className="text-white text-lg lg:text-2xl font-light pt-4">Be a part of the solution—help protect your loved ones and neighbors. Real-time updates, life-saving alerts, and peace of mind in one app.</p>
              <div className="py-8">
                <button className="bg-white text-[#123F7B] font-normal text-lg lg:text-xl px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-md hover:bg-white/90 flex items-center space-x-2">
                  <span>Get The App</span>
                  <RxArrowRight className="hidden lg:inline" />
                </button>
              </div>
              <div className="flex flex-row space-x-8 lg:space-x-16">
                <div className="flex flex-col">
                  <p className="text-white text-xl lg:text-2xl font-extrabold">1,000+</p>
                  <p className="text-white text-base lg:text-lg font-light">Downloads</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-white text-xl lg:text-2xl font-extrabold">4.5</p>
                  <p className="text-white text-base lg:text-lg font-light">Rating</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full max-w-3xl pl-0 lg:pl-16">
              <img src={mobileMU} alt="placeholder" className="scale-100 hidden lg:inline lg:scale-150 lg:translate-y-28 lg:translate-x-28 object-center w-full h-full" />
            </div>
          </div>
        </div>
        <div className="py-12 px-24">
          <div className="flex flex-col lg:flex-row place-items-center">
            <div className="flex flex-col w-full">
              <p className="text-2xl lg:text-3xl font-extrabold">What they say about us</p>
              <div className="flex flex-col lg:flex-row justify-between w-full space-y-4 lg:space-y-0 lg:space-x-16 pt-2">
                <div className="flex flex-col bg-[#123F7B] text-white px-8 py-4 rounded-lg shadow-md w-full max-w-sm">
                  <div className="flex space-x-1 mt-2 pb-4 place-items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <p className="text-lg font-extrabold">  5.0</p>
                  </div>
                  <div className="text-pretty">  
                    <p className="text-lg font-light pb-4">This app changed my life. It saved so many people and helped those in need.</p>
                    <p className="text-lg font-bold">John Doe</p>
                  </div>
                </div>
                <div className="flex flex-col bg-[#123F7B] text-white px-8 py-4 rounded-lg shadow-md w-full max-w-sm">
                  <div className="flex space-x-1 mt-2 pb-4 place-items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <p className="text-lg font-extrabold">  5.0</p>
                  </div>
                  <div className="text-pretty">  
                    <p className="text-lg font-light pb-4">This app changed my life. It saved so many people and helped those in need.</p>
                    <p className="text-lg font-bold">John Doe</p>
                  </div>
                </div>
                <div className="flex flex-col bg-[#123F7B] text-white px-8 py-4 rounded-lg shadow-md w-full max-w-sm">
                  <div className="flex space-x-1 mt-2 pb-4 place-items-center space-x-2">
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <p className="text-lg font-extrabold">  5.0</p>
                  </div>
                  <div className="text-pretty">  
                    <p className="text-lg font-light pb-4">This app changed my life. It saved so many people and helped those in need.</p>
                    <p className="text-lg font-bold">John Doe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Container bg-[#123F7B] h-full rounded-[75px] overflow-hidden content-center px-8 py-10 lg:px-44 lg:py-10">
          <div className="flex flex-col gap-8">
            <div className="w-full">
              <p className="text-white text-xl tracking-wider text-center lg:text-3xl font-semibold">
                Turn your phone into a tool for saving lives and keeping your community safe.
              </p>
            </div>
            <div className="w-full py-8">
              <div className="Container bg-white h-full w-full rounded-[75px] overflow-hidden content-center justify-between px-1 py-1"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 pt-4">
              {/* Card 1 */}
              <div className="flex flex-col flex-1 gap-4 justify-start text-white text-start">
                <div>
                  <GoClock className="text-white w-8 h-8 lg:w-16 lg:h-16 py-2" />
                </div>
                <div>
                  <p className="text-lg lg:text-3xl font-semibold">REAL-TIME</p>
                </div>
                <div className="py-2">
                  <p className="text-md font-extralight">
                    Delivers immediate notifications about missing persons, ensuring swift public awareness and action within affected areas.
                  </p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col flex-1 gap-4 justify-start text-white text-start">
                <div>
                  <FaHandsHelping className="text-white w-8 h-8 lg:w-16 lg:h-16 py-2" />
                </div>
                <div>
                  <p className="text-lg lg:text-3xl font-semibold">COMMUNITY HELP</p>
                </div>
                <div className="py-2">
                  <p className="text-md font-extralight">
                    Connects the public with police stations in Taguig, Makati, Parañaque, Pasay, and Pateros, allowing users to report incidents, provide leads, and support recovery efforts collaboratively.
                  </p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="flex flex-col flex-1 gap-4 justify-start text-white text-start">
                <div>
                  <GrUpdate className="text-white w-8 h-8 lg:w-16 lg:h-16 py-2" />
                </div>
                <div>
                  <p className="text-lg lg:text-3xl font-semibold">CASE UPDATES</p>
                </div>
                <div className="py-2">
                  <p className="text-md font-extralight">
                    Provides real-time updates on each case, helping both authorities and the public stay informed on progress.
                  </p>
                </div>
              </div>
              {/* Card 4 */}
              <div className="flex flex-col flex-1 gap-4 justify-start text-white text-start">
                <div>
                  <AiOutlineSafety className="text-white w-8 h-8 lg:w-16 lg:h-16 py-2" />
                </div>
                <div>
                  <p className="text-lg lg:text-3xl font-semibold">SAFE REPORTS</p>
                </div>
                <div className="py-2">
                  <p className="text-md font-extralight">
                    Your information stays protected. Report safely and confidently
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-12 px-4">
          <div className="grid grid-row-2 gap-8 content-center justify-center place-items-center">
            <div className="">
              <p className="text-lg lg:text-2xl text-center text-[#123F7B] tracking-wide font-normal">In collaboration with:</p>
            </div>
            <div className="grid grid-cols-6 gap-4 lg:gap-16 content-between">
              <div className="">
                <img src={makati} alt="placeholder" className="object-center w-12 h-12 lg:w-24 lg:h-24" />
              </div>
              <div className="">
                <img src={taguig} alt="placeholder" className="object-center w-12 h-12 lg:w-24 lg:h-24" />
              </div>
              <div className="">
                <img src={pasay} alt="placeholder" className="object-center w-12 h-12 lg:w-24 lg:h-24" />
              </div>
              <div className="">
                <img src={paranaque} alt="placeholder" className="object-center w-12 h-12 lg:w-24 lg:h-24" />
              </div>
              <div className="">
                <img src={pateros} alt="placeholder" className="object-center w-12 h-12 lg:w-24 lg:h-24" />
              </div>
              <div className="">
                <img src={tup} alt="placeholder" className="object-center w-12 h-12 lg:w-24 lg:h-24" />
              </div>
            </div>
          </div>
        </div>
        <div className="Container bg-[#123F7B] h-3/6 rounded-t-[75px] overflow-hidden content-center justify-between px-4 py-10">
          
        </div>
      </div>
    );
  };
  
  export default Home;