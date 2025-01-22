import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/AGAPAYALERT.svg";
import mobileMU from "../assets/mobileappMU.svg";
import { RxArrowRight } from "react-icons/rx";
import { FaStar } from 'react-icons/fa';


const Home = () => {
    return (
        <div className="h-screen">
        <div className="Container bg-[#123F7B] h-5/6 rounded-[75px] overflow-hidden content-center justify-between px-4 py-10 lg:px-44 lg:py-10">
          <div className="flex flex-col lg:flex-row place-items-center justify-between space-y-8 lg:space-y-0 lg:space-x-24">
            <div className="flex flex-col w-full max-w-lg">
              <p className="text-white text-3xl lg:text-4xl font-extrabold">Hold the Future of Public Safety in Your Hands</p>
              <p className="text-white text-xl lg:text-2xl font-light pt-4">Be a part of the solution—help protect your loved ones and neighbors. Real-time updates, life-saving alerts, and peace of mind in one app.</p>
              <div className="py-8">
                <button className="bg-white text-[#123F7B] font-normal text-lg lg:text-xl px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-md hover:bg-white/90 flex items-center space-x-2">
                  <span>Get The App</span>
                  <RxArrowRight />
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
              <img src={mobileMU} alt="placeholder" className="scale-100 lg:scale-150 lg:translate-y-28 lg:translate-x-28 object-center w-full h-full" />
            </div>
          </div>
        </div>
        <div className="py-12 px-4 lg:px-24">
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
      </div>
    );
  };
  
  export default Home;