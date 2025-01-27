import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { MdNotifications } from 'react-icons/md';

const AdminTopNavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New report submitted' },
    { id: 2, message: 'User feedback received' },
    { id: 3, message: 'System update available' },
  ]);


  // Function to get the current page name based on the location
  const getPageName = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/reports':
        return 'Reports';
      case '/admin/police-stations':
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
      <Popover>
          <PopoverTrigger asChild>
            <button className="relative">
              <MdNotifications size={24} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id} className="mb-1">
                  {notification.message}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      <div className="flex items-center space-x-4">
        <img src={user?.avatar?.url || "https://via.placeholder.com/150"} alt={user?.firstName} className="h-8 w-8 rounded-full" />
        <span>{user?.firstName}</span>
      </div>
      </div>
    </div>
  );
};

export default AdminTopNavBar;