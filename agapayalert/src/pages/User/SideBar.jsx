import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome } from "react-icons/fi";
import { IoDocumentOutline, IoDocument, IoSettingsOutline, IoSettingsSharp, IoLogOutOutline } from "react-icons/io5";
import { IoMdAnalytics } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authActions';

// Tooltip UI (assumes you have a Tooltip component, adjust import as needed)
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // <-- Add this line

  // Logout handler
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  // Define your tabs with their routes, icons, and tooltips
  const tabs = [
    {
      to: '/',
      isActive: location.pathname === '/',
      icon: <FiHome />,
      tooltip: 'Go to home page',
    },
    {
      to: '/profile',
      isActive: location.pathname === '/profile',
      icon: <CgProfile />,
      tooltip: 'View your profile',
    },
    {
      to: '/profile/report',
      isActive: location.pathname === '/profile/report',
      icon: location.pathname === '/profile/report'
        ? <IoDocument className="" />
        : <IoDocumentOutline className="" />,
      tooltip: 'View your reports',
    },
    // Only show settings tab if user.role is "user"
    ...(user?.role !== "user"
      ? [{
          to: '/profile/settings',
          isActive: location.pathname === '/profile/settings',
          icon: location.pathname === '/profile/settings'
            ? <IoSettingsSharp className="" />
            : <IoSettingsOutline className="" />,
          tooltip: 'Settings',
        }]
      : []
    ),
  ];

  return (
    <TooltipProvider>
      <div className='w-[100px] h-[530px] mx-[40px] p-10 bg-white rounded-[45px] shadow-lg shadow-[#123f7b]/25 place-items-center justify-center'>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex flex-col space-y-[25px]'>
            {tabs.map((tab, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <Link to={tab.to}>
                    <div
                      className={`
                        flex items-center justify-center
                        text-4xl
                        transition-all
                        duration-200
                        rounded-full
                        ${tab.isActive ? 'text-[#D46A79] bg-[#F5E6E9]' : 'text-[#123F7B]'}
                        hover:bg-[#F5E6E9] hover:text-[#D46A79]
                        p-2
                      `}
                    >
                      {tab.icon}
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span className="text-xs" style={{ color: "#123F7B" }}>{tab.tooltip}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleLogout}>
                  <div
                    className={`
                      flex items-center justify-center
                      text-4xl
                      transition-all
                      duration-200
                      rounded-full
                      text-[#D46A79]
                      hover:bg-[#F5E6E9] hover:text-[#D46A79]
                      p-2
                    `}
                  >
                    <IoLogOutOutline />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="text-xs" style={{ color: "#123F7B" }}>Logout</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SideBar;