import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../redux/actions/authActions';
import logo from "../assets/AGAPAYALERT - imagotype.svg";
import { MdOutlineDashboard, MdOutlineInsertChart, MdOutlineLocalPolice, MdOutlineAnalytics , MdOutlinePeople, MdOutlineListAlt, MdOutlineLogout } from 'react-icons/md';

const AdminNavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const getLinkClass = (path) => {
      return location.pathname === path ? 'bg-[#D46A79]/10 rounded-md py-2 px-4' : 'py-2 px-4';
    };
  
    const handleLogout = async () => {
      const result = await dispatch(logout());
      console.log("Logout Result:", result);
      navigate('/');
    };

    return (
        <div className="fixed top-0 left-0 h-full w-80 bg-white z-50">
          <div className="flex place-items-center justify-center h-16 pt-2">
            <Link to="/">
            <img src={logo} alt="Admin Logo" className="h-[80px]" /> {/* Adjust the height as needed */}
            </Link>
          </div>
          <nav className="mt-10 px-6 py-2">
            <div className="flex flex-col justify-between">
            <div className="">
            <ul>
              <li className="">
                <Link to="/admin/users">
                <div className="flex flex-row justify-between place-items-center space-x-2 w-full max-w-4/6 bg-[#123F7B]/20 rounded-tr-full rounded-br-full p-2"> 
                    <p className="font-extrabold text-xl">Create <br/>Officer Profile</p>
                    <div className="bg-[#123F7B] text-white rounded-full h-14 w-14 flex items-center justify-center">
                        <p className="text-xl">+</p>
                    </div>
                </div>
                </Link>
              </li>
              <div className="mt-8 space-y-2 font-extrabold text-lg">
              <li className={getLinkClass('/admin/dashboard')}>
                <Link to="/admin/dashboard" className="flex flex-row justify-start place-items-center space-x-3 hover:bg-[#123F7B]/5 rounded-md transition-colors duration-200">
                    <MdOutlineDashboard className="" size={32} />
                    <p>Dashboard</p>
                </Link>
              </li>
              <li className={getLinkClass('/admin/analytics')}>
                <Link to="/admin/analytics" className="flex flex-row justify-start place-items-center space-x-3 hover:bg-[#123F7B]/5 rounded-md transition-colors duration-200">
                    <MdOutlineAnalytics  className="" size={32} />
                    <p>Analytics</p>
                </Link>
              </li>
              <li className={getLinkClass('/admin/reports')}>
                <Link to="/admin/reports" className="flex flex-row justify-start place-items-center space-x-3 hover:bg-[#123F7B]/5 rounded-md transition-colors duration-200">
                    <MdOutlineListAlt className="" size={32} />
                    <p>Reports</p>
                </Link>
              </li>
              <li className={getLinkClass('/admin/police-station')}>
                <Link to="/admin/police-station" className="flex flex-row justify-start place-items-center space-x-3 hover:bg-[#123F7B]/5 rounded-md transition-colors duration-200">
                    <MdOutlineLocalPolice className="" size={32} />
                    <p>Police Stations</p>
                </Link>
              </li>
              <li className={getLinkClass('/admin/users')}>
                <Link to="/admin/users" className="flex flex-row justify-start place-items-center space-x-3 hover:bg-[#123F7B]/5 rounded-md transition-colors duration-200">
                    <MdOutlinePeople className="" size={32} />
                    <p>Users</p>
                </Link>
              </li>
              {/* <li className="py-2 px-4">
                <Link to="/admin/dashboard" className="flex flex-row justify-start place-items-center space-x-4">
                    <MdOutlineFeedback className="" size={38} />
                    <p>Feedbacks</p>
                </Link>
              </li> */}
              </div>
            </ul>
            </div>
            <div className="flex flex-row justify-start place-items-center space-x-4 cursor-pointer mt-12 py-2 px-4 hover:bg-red-50 rounded-md transition-colors duration-200" onClick={handleLogout}>
                <MdOutlineLogout className="mr-2" size={24} />
                <p>Logout</p>
            </div>
            </div>
          </nav>
        </div>
      );
}

export default AdminNavBar;