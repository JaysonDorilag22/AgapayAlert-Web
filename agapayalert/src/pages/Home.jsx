import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicCustomPosts } from "../redux/actions/customPostActions";
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
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


const Home = () => {
    const dispatch = useDispatch();
    const { posts, loading, error } = useSelector(state => state.customPosts);
    const [focusedImage, setFocusedImage] = useState(null);

    useEffect(() => {
        dispatch(getPublicCustomPosts());
    }, [dispatch]);

    const handleImageClick = (imgUrl) => {
        setFocusedImage(imgUrl);
    };
    const handleCloseModal = () => {
        setFocusedImage(null);
    };

    // Accordion data for police stations
    const policeStations = [
      {
        city: "Taguig",
        main: "Taguig City Police Station",
        sub: [
          "Fort Bonifacio Police Sub-station (SS1)",
          "Western Bicutan Police Sub-station (SS2)",
          "Pinagsama Police Sub-station (SS3)",
          "STUB Police Sub-station (SS4)",
          "Tipas Police Sub-station (SS5)",
          "Signal Village Police Sub-station (SS6)",
          "MCU Police Sub-station (SS7)",
          "Tanyag-Daang Hari Police Sub-station (SS8)",
          "Hagonoy Police Sub-station (SS9)",
          "BAGUMBAYAN-LOWER BICUTAN POLICE SUB-STATION (SS10)",
        ],
      },
      {
        city: "Makati",
        main: "Makati City Police Station",
        sub: [
          "Olympia Police Sub-station (SS1)",
          "Palanan Police Sub-station (SS2)",
          "San Isidro Police Sub-station (SS3)",
          "Bangkal Police Sub-station (SS4)",
          "Ayala Police Sub-station (SS5)",
          "Poblacion Police Sub-station (SS6)",
          "Guadalupe Nuevo Police Sub-station (SS7)",
        ],
      },
      {
        city: "Pasay",
        main: "Pasay City Police Station",
        sub: [
          "CCP Complex Police Sub-station (SS1)",
          "Arnaiz Police Sub-station (SS2)",
          "Libertad Police Sub-station (SS3)",
          "Central Park Police Sub-station (SS4)",
          "Baclaran Police Sub-station (SS5)",
          "Malibay Police Sub-station (SS6)",
          "Maricaban Police Sub-station (SS7)",
          "Airport Police Sub-station (SS8)",
          "Villamor Police Sub-station (SS9)",
          "MOA Police Sub-station (SS10)",
        ],
      },
      {
        city: "Parañaque",
        main: "Paranaque City Police Station",
        sub: [
          "Baclaran Police Sub-station (SS1)",
          "Tambo Police Sub-station (SS2)",
          "Sto. Nino Police Sub-station (SS3)",
          "San Dionisio Police Sub-station (SS4)",
          "Bf Homes Police Sub-station (SS5)",
          "Don Bosco Police Sub-station (SS6)",
          "Sun Valley Police Sub-station (SS7)",
          "Marcelo Green Police Sub-station (SS8)",
        ],
      },
      {
        city: "Pateros",
        main: "Pateros Municipal Police Station",
        sub: [
          "Sta. Ana Sub-station (SS1)",
          "Aguho Sub-station (SS2)",
          "Kanluran Sub-station (SS3)",
        ],
      },
    ];

    function CityAccordion() {
      const [openIndex, setOpenIndex] = useState(null);
      const toggle = idx => setOpenIndex(openIndex === idx ? null : idx);
      return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {policeStations.map((station, idx) => (
            <div key={station.city} className="bg-white rounded-2xl shadow-md">
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left text-[#123F7B] font-bold text-lg focus:outline-none"
                onClick={() => toggle(idx)}
                aria-expanded={openIndex === idx}
              >
                <span>{station.city} - {station.main}</span>
                {openIndex === idx ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openIndex === idx && (
                <ul className="px-8 pb-4 pt-2 space-y-2 text-[#123F7B] text-base font-medium">
                  {station.sub.map(sub => (
                    <li key={sub} className="pl-2 list-disc">{sub}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
        <div className="h-max">
        {/* Image Modal */}
        {focusedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleCloseModal}>
            <img
              src={focusedImage}
              alt="Focused Custom Post"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/60 rounded-full px-3 py-1 hover:bg-black/80"
              onClick={handleCloseModal}
            >
              &times;
            </button>
          </div>
        )}
        <div className="Container bg-[#123F7B] h-5/6 rounded-[75px] overflow-hidden content-center justify-between px-16 py-4 lg:px-44 lg:py-10">
          <div className="flex flex-col lg:flex-row place-items-center justify-between space-y-8 lg:space-y-0 lg:space-x-24">
            <div className="flex flex-col w-full max-w-lg text-center lg:text-left place-items-center lg:place-items-start">
              <p className="text-white text-2xl lg:text-4xl font-extrabold">Hold the Future of Public Safety in Your Hands</p>
              <p className="text-white text-lg lg:text-2xl font-light pt-4">Be a part of the solution—help protect your loved ones and neighbors. Real-time updates, life-saving alerts, and peace of mind in one app.</p>
              <div className="py-8">
                <button className="bg-white text-[#123F7B] font-normal text-lg lg:text-xl px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-md hover:bg-white/90 flex items-center space-x-2">
                  <Link to="https://expo.dev/artifacts/eas/orNCNRpXjoubePTVoCFTB5.apk"><span>Get The App</span></Link>
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
        {/* Custom Posts Section - horizontally scrollable */}
        <div className="py-12 px-24">
          <div className="flex flex-col lg:flex-row place-items-center">
            <div className="flex flex-col w-full">
              <p className="text-2xl lg:text-3xl font-extrabold mb-4">Latest Community Posts</p>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex flex-row gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#123F7B]/40 scrollbar-track-white/10" style={{ WebkitOverflowScrolling: 'touch' }}>
                {posts && posts.length > 0 ? posts.map(post => (
                  <div key={post._id} className="flex-shrink-0 bg-white shadow-md rounded-xl w-[25rem] min-w-[25rem] max-w-md p-3 mr-1 last:mr-0 flex flex-col justify-between">
                    <div className="mb-2">
                      <p className="text-[#123F7B] font-semibold text-xl line-clamp-2">{post.caption}</p>
                    </div>
                    {post.images && post.images.length > 0 && (
                      <div className="flex flex-row gap-2 overflow-x-auto mb-2">
                        {post.images.map(img => (
                          <img
                            key={img.public_id}
                            src={img.url}
                            alt="Custom Post"
                            className="h-44 w-44 object-cover rounded-lg border border-[#123F7B]/20 cursor-pointer transition-transform duration-200 hover:scale-105"
                            onClick={() => handleImageClick(img.url)}
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col text-xs text-gray-600 mt-2">
                      <span>By: {post.author?.firstName} {post.author?.lastName}</span>
                      <span>At: {new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500">No posts found.</p>
                )}
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
          {/* City Police Stations Accordion */}
          <div className="py-4">
            <h2 className="text-white text-2xl font-bold text-center mb-6">Police Stations by City</h2>
            <CityAccordion />
          </div>
        </div>
      </div>
        
    );
  };
  
  export default Home;