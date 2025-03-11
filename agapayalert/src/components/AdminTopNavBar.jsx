import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import Profile from './Profile';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Separator } from '../components/ui/Separator';
import { logout } from '@/redux/actions/authActions';


const AdminTopNavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (result.success) {
      navigate('/');
    } else {
      console.error("Logout failed");
    }
  };

  // Function to get the current page name based on the location
  const getPageName = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/reports':
        return 'Reports';
      case '/admin/police-station':
        return 'Police Stations';
      case '/admin/cities':
        return 'Cities';
      case '/admin/users':
        return 'Users';
      case '/admin/feedbacks':
        return 'Feedbacks';
      default:
        return '';
    }
  };
    // Update the date and time every second
    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentDate(new Date());
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    
      // Format the date and time
      const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      };

  return (
    <div className="fixed top-0 right-0 w-[calc(100%-22rem)] h-16 bg-white flex items-center justify-between p-4 pr-12 z-40">
      <div className='flex flex-col justify-start -space-y-1'>
        <h1 className="text-md font-bold">{getPageName()}</h1>
        <div className='flex flex-row space-x-2'>
            <p className="text-xs font-bold text-[#D46A79]">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <p className="text-xs font-base">{formatDate(currentDate)}</p>
        </div>
      </div>
      <div className='flex flex-row space-x-8 justify-between'>
        <Notifications />
        <div className="place-items-center">
        <Profile user={user} handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default AdminTopNavBar;