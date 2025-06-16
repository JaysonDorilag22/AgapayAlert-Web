import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiArrowDropDownLine } from "react-icons/ri";
import { Popover, PopoverTrigger, PopoverContent } from '../components/ui/popover';
import { Separator } from '../components/ui/separator';
import { logout } from '../redux/actions/authActions';
import { getRoleDisplayName } from '@/utils/userroles';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
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

return (
    <Popover>
            <PopoverTrigger>
              <div className='flex items-center space-x-1'>
                <img src={user?.avatar?.url || "https://via.placeholder.com/150"} alt={user?.firstName} className="h-8 w-8 rounded-full" />
                <RiArrowDropDownLine size={32} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-4">
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-col place-items-center bg-[#123F7B]/10 rounded-lg p-4'>
                  <div className='flex flex-row space-x-2 items-center justify-center'>
                    <img src={user?.avatar?.url} alt={user?.firstName} className="h-14 w-14 rounded-full" />
                      <div className='flex flex-col text-left text-[#123F7B] text-wrap space-y-0'>
                        <p className="text-md font-bold">{user?.firstName} {user?.lastName}</p>
                        <div className='text-[#123F7B]/60'>
                        <p className="text-xs font-semibold text-[#D46A79]">{getRoleDisplayName(user?.roles[0])}</p>
                        <p className="text-xs font-light">{user?.email}</p>
                        </div>
                      </div>
                  </div>
                </div>
                <div className='flex flex-col space-y-2 place-items-start text-left text-[#123F7B] text-semibold'>
                    <Link to="/profile"><p>Profile</p></Link>
                    {user?.roles[0] !== 'user' && (
                    <Link to="/admin/dashboard"><p>Dashboard</p></Link>
                    )}
                    <Separator orientation="horizontal" className='text-[#123F7B]'/>
                    <p className='text-[#D46A79] cursor-pointer' onClick={handleLogout}>Logout</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
);
};

export default Profile;