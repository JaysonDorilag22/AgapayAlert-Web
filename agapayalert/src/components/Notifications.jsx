import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { MdNotifications } from 'react-icons/md';
import tup from '../assets/TUP.png';
import {
  getUserNotifications,
  markNotificationAsRead,
} from '@/redux/actions/notificationActions';
import { BsFileEarmarkPlus, BsFileEarmarkArrowUp, BsFileEarmarkPerson, BsFileEarmarkCheck } from "react-icons/bs";
import { AiOutlineAlert } from "react-icons/ai";
import { formatDistanceToNow, differenceInHours  } from "date-fns";
import { useReportModal } from '../layouts/ReportModalProvider';
import {
  initializeSocket,
  joinRoom,
  leaveRoom,
  getSocket
} from '@/services/socketService';
import { SOCKET_EVENTS } from '@/config/constants';


const getNotificationIcon = (type) => {
  switch (type) {
    case "REPORT_CREATED":
      return {
        icon: <BsFileEarmarkPlus size={24} className="text-[#123f7b]" />,
        bg: "bg-[#123f7b]/10",
        color: "#123f7b"
      };
    case "STATUS_UPDATED":
      return {
        icon: <BsFileEarmarkArrowUp size={24} className="text-[#123f7b]" />,
        bg: "bg-[#123f7b]/10",
        color: "#123f7b"
      };
    case "ASSIGNED_OFFICER":
      return {
        icon: <BsFileEarmarkPerson size={24} className="text-[#7C3AED]" />,
        bg: "bg-[#7C3AED]/20",
        color: "#7C3AED"
      };
    case "FINDER_REPORT_VERIFIED":
      return {
        icon: <BsFileEarmarkCheck size={24} className="text-[#123f7b]" />,
        bg: "bg-[#123f7b]/10",
        color: "#123f7b"
      };
    case "FINDER_REPORT_CREATED":
      return {
        icon: <BsFileEarmarkPlus size={24} className="text-[#123f7b]" />,
        bg: "bg-[#123f7b]/10",
        color: "#123f7b"
      };
    case "BROADCAST_ALERT":
      return {
        icon: <AiOutlineAlert size={24} className="text-[#DC2626]" />,
        bg: "bg-[#DC2626]/10",
        color: "#DC2626"
      };
    default:
      return {
        icon: <img src={tup} alt='TUP' className='w-[50px] h-[50px] rounded-full' />,
        bg: "",
        color: "#123f7b"
      };
  }
};

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector((state) => state.notification);
    const { openModal } = useReportModal();
    const userId = useSelector((state) => state.auth?.user?._id);
    const token = useSelector((state) => state.auth?.token);
    const socketRef = useRef(null);

    useEffect(() => {
    if (!userId || !token) return;

    let mounted = true;
    const setupSocket = async () => {
      const socket = await initializeSocket(token);
      if (socket && mounted) {
        socketRef.current = socket;
        joinRoom(`user_${userId}`);

        socket.on(SOCKET_EVENTS.REPORT_UPDATED, () => {
          dispatch(getUserNotifications({ page: 1, limit: 10 }));
        });
        socket.on(SOCKET_EVENTS.NEW_REPORT, () => {
          dispatch(getUserNotifications({ page: 1, limit: 10 }));
        });
      }
    };

    setupSocket();

    // Cleanup
    return () => {
      mounted = false;
      if (socketRef.current) {
        leaveRoom(`user_${userId}`);
        socketRef.current.off(SOCKET_EVENTS.REPORT_UPDATED);
        socketRef.current.off(SOCKET_EVENTS.NEW_REPORT);
      }
    };
  }, [userId, token, dispatch]);

  useEffect(() => {
    dispatch(getUserNotifications({ page: 1, limit: 10 }));
  }, [dispatch]);

    
    // State to control how many items to show
    const [showAllToday, setShowAllToday] = useState(false);
    const [showAllEarlier, setShowAllEarlier] = useState(false);

    const handleNotificationClick = (notif) => {
    dispatch(markNotificationAsRead(notif._id));
    // If the notification is related to a report, open the modal with the report's _id
    if (
        notif.data &&
        notif.data.reportId &&
        typeof notif.data.reportId === "object" &&
        notif.data.reportId._id
    ) {
        openModal(notif.data.reportId._id);
    }
    // You can add more logic for other notification types if needed
    };

    // Group notifications
    const now = new Date();
    const todayNotifications = notifications.filter(
        notif => differenceInHours(now, new Date(notif.createdAt)) < 24
    );
    const earlierNotifications = notifications.filter(
        notif => differenceInHours(now, new Date(notif.createdAt)) >= 24
    );

    // Helper to slice notifications
    const getDisplayList = (list, showAll) => showAll ? list : list.slice(0, 3);

    return (
         <Popover>
        <PopoverTrigger asChild>
            <button className="relative">
            <MdNotifications size={24} />
            {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {notifications.filter(n => !n.isRead).length}
                </span>
            )}
            </button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px] h-[66vh] max-h-[66vh] bg-white shadow-lg rounded-lg p-[24px] overflow-y-auto">
            <div className='flex flex-col w-full space-y-[10px] h-full'>
            <div className='flex flex-col space-y-[10px]'>
                <p className='text-2xl font-semibold text-[#123f7b]'>Notifications</p>
                {todayNotifications.length > 0 && (
                    <p className='text-md font-light text-[#123f7b]'>
                    You have <strong className='font-semibold text-[#D46A79]'>{todayNotifications.filter(n => !n.isRead).length} Notifications</strong> today.
                    </p>
                )}
            </div>
            <div className='flex flex-col space-y-[10px] pb-4'>
                {loading && <div>Loading...</div>}
                {!loading && notifications.length === 0 && (
                <div className="text-gray-500 text-center">No notifications</div>
                )}

                {/* Today */}
                {todayNotifications.length > 0 && (
                <>
                    <p className='text-lg font-semibold text-[#123f7b]'>Today</p>
                    <div className='flex flex-col space-y-[10px]'>
                    {getDisplayList(todayNotifications, showAllToday).map((notif) => {
                        const { icon, bg, color } = getNotificationIcon(notif.type);
                        return (
                            <div
                                key={notif._id}
                                className={`flex flex-row py-2 space-x-[10px] cursor-pointer ${notif.isRead ? 'opacity-60' : ''}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className={`w-[40px] h-[40px] p-2 rounded-full flex items-center justify-center ${bg}`}>
                                    {icon}
                                </div>
                                <div className='flex flex-row justify-between w-full'>
                                    <div className='flex flex-col place-content-center text-wrap text-left pr-8'>
                                        <p className='text-sm font-bold' style={{ color }}>{notif.title}</p>
                                        <p className='text-xs font-normal leading-4' style={{ color }}>{notif.message}</p>
                                        <p className='text-xs font-extralight' style={{ color }}>
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notif.isRead && <div className='bg-[#D46A70] p-[5px] rounded-full place-self-center'/>}
                                </div>
                            </div>
                        );
                        })}
                    {/* Show "View more"/"View less" button if needed */}
                    {todayNotifications.length > 3 && (
                        <button
                            className="text-[#123f7b] text-xs font-semibold underline mt-2"
                            onClick={() => setShowAllToday((prev) => !prev)}
                        >
                            {showAllToday ? "View less" : `View more (${todayNotifications.length - 3} more)`}
                        </button>
                    )}
                    </div>
                </>
                )}

                {/* Earlier */}
                {earlierNotifications.length > 0 && (
                <>
                    <p className='text-lg font-semibold text-[#123f7b] mt-2'>Earlier</p>
                    <div className='flex flex-col space-y-[10px]'>
                    {getDisplayList(earlierNotifications, showAllEarlier).map((notif) => {
                    const { icon, bg, color } = getNotificationIcon(notif.type);
                    return (
                        <div
                        key={notif._id}
                        className={`flex flex-row py-2 space-x-[10px] cursor-pointer ${notif.isRead ? 'opacity-60' : ''}`}
                       onClick={() => handleNotificationClick(notif)}
                        >
                        <div className={`w-[40px] h-[40px] p-2 rounded-full flex items-center justify-center ${bg}`}>
                            {icon}
                        </div>
                        <div className='flex flex-row justify-between w-full'>
                            <div className='flex flex-col place-content-center text-wrap text-left pr-8'>
                            <p className='text-sm font-bold' style={{ color }}>{notif.title}</p>
                            <p className='text-xs font-normal leading-4' style={{ color }}>{notif.message}</p>
                            <p className='text-xs font-extralight' style={{ color }}>
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                            </p>
                            </div>
                            {!notif.isRead && <div className='bg-[#D46A70] p-[5px] rounded-full place-self-center'/>}
                        </div>
                        </div>
                    );
                    })}
                    {earlierNotifications.length > 3 && (
                        <button
                            className="text-[#123f7b] bg-[#123f7b]/10 text-xs font-semibold underline mb-2 p-4 rounded-lg w-max h-max self-center"
                            onClick={() => setShowAllEarlier((prev) => !prev)}
                        >
                            {showAllEarlier ? "View less" : `View more (${earlierNotifications.length - 3} more)`}
                        </button>
                    )}
                    </div>
                </>
                )}
            </div>
            </div>
        </PopoverContent>
        </Popover>
    );
};

export default Notifications;