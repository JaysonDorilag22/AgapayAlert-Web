import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineDocumentChartBar, HiOutlineCalendarDays, HiOutlinePercentBadge, HiOutlineEye } from "react-icons/hi2";
import { PiClockClockwiseLight } from "react-icons/pi";
import logo from "../../assets/AGAPAYALERT.svg";
import Logo from "../../assets/AGAPAYALERT - imagotype.svg";
import { getBasicAnalytics } from "../../redux/actions/dashboardActions";
import { getReports } from "../../redux/actions/reportActions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { basicAnalytics } = useSelector((state) => state.dashboard);
  const { reports } = useSelector((state) => state.reports);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getBasicAnalytics());
      console.log("Basic Analytics Data:", result.data);

      const reportsResult = await dispatch(getReports({ page: 1, limit: 10 }));
      console.log("Reports Data:", reportsResult.data);
    };

    fetchData();
  }, [dispatch]);


  return (
    <AdminLayout>
      <div className="h-screen space-y-8">
        <div className="Container bg-[#123F7B]/15 h-[200px] w-full rounded-[45px] overflow-hidden content-center shadow-lg px-8 py-2">
          <div className='grid grid-cols-2 justify-between gap content-end h-2/3'>
            <div className='grid grid-row-2 pl-10 justify-start content-end'>
              <div className='text-wrap w-full max-w-xl'>
                <h1 className='text-3xl font-extrabold'>Welcome back, {user?.firstName}!</h1>
              </div>
              <div className='flex flex-row w-full'>
                <p className='text-lg font-extralight'>Let’s continue to build a safer community today.</p>
              </div>
            </div>
            <div className='relative'>
              <img src={logo} className='absolute overflow-visible object-cover h-full w-full'/>
            </div>
          </div>
        </div>
        <div className='grid grid-row-2'>
            <div className='text-[#123F7B] font-semibold text-lg'>
              <p>Overview</p>
            </div>
            <div className='grid grid-cols-4 gap-2 m-4'>
              <div className='bg-[#123F7B] rounded-lg h-[85px] w-[200px] place-items-center content-center shadow-lg px-4 py-2'>
                <div className='grid grid-cols-3 gap-4 justify-start content-center'>
                  <div className='col-start-1 col-end-2 bg-white/90 w-[45px] h-[45px] rounded-sm flex items-center'>
                    <HiOutlineDocumentChartBar className="w-full h-full"/>
                  </div>
                  <div className='col-start-2-col-end-4 col-span-2 grid grid-row-2 text-white font-semibold'>
                    <div className='text-xl'>{basicAnalytics?.overview?.total || 0}</div>
                    <div className='text-xs'>Total Reports</div>
                  </div>
                </div>
              </div>
              <div className='bg-[#123F7B]/10 rounded-lg h-[85px] w-[200px] place-items-center content-center shadow-lg px-4 py-2'>
                <div className='grid grid-cols-3 gap-4 justify-start content-center'>
                  <div className='col-start-1 col-end-2 bg-[#123F7B] w-[45px] h-[45px] rounded-sm flex items-center'>
                    <HiOutlineCalendarDays className="w-full h-full text-white"/>
                  </div>
                  <div className='col-start-2-col-end-4 col-span-2 grid grid-row-2 font-semibold'>
                    <div className='text-xl'>{basicAnalytics?.overview?.today || 0}</div>
                    <div className='text-xs'>Today's Reports</div>
                  </div>
                </div>
              </div>
              <div className='bg-[#123F7B] rounded-lg h-[85px] w-[200px] place-items-center content-center shadow-lg px-4 py-2'>
                <div className='grid grid-cols-3 gap-4 justify-start content-center'>
                  <div className='col-start-1 col-end-2 bg-white/90 w-[45px] h-[45px] rounded-sm flex items-center'>
                    <HiOutlinePercentBadge className="w-full h-full"/>
                  </div>
                  <div className='col-start-2-col-end-4 col-span-2 grid grid-row-2 text-white font-semibold'>
                    <div className='text-xl'>{basicAnalytics?.overview?.resolutionRate || 0}</div>
                    <div className='text-xs'>Resolution Rate</div>
                  </div>
                </div>
              </div>
              <div className='bg-[#123F7B] rounded-lg h-[85px] w-[200px] place-items-center content-center shadow-lg px-4 py-2'>
                <div className='grid grid-cols-3 gap-4 justify-start content-center'>
                  <div className='col-start-1 col-end-2 bg-white/90 w-[45px] h-[45px] rounded-sm flex items-center'>
                    <PiClockClockwiseLight className="w-full h-full"/>
                  </div>
                  <div className='col-start-2-col-end-4 col-span-2 grid grid-row-2 text-white font-semibold'>
                    <div className='text-xl'>{basicAnalytics?.performance?.pending || 0}</div>
                    <div className='text-xs'>Pending Reports</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div 
          className="grid grid-row-2 gap-4 cursor-pointer relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => navigate('/admin/reports')}
        >
          {hover && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#123F7B] bg-opacity-50 backdrop-blur-sm rounded-[15px]">
              <Link to="/admin/reports">
              <span className="text-white text-lg font-bold">View more reports</span>
              </Link>
            </div>
          )}
          {reports?.slice(0, 2).map((report) => (
            <div key={report._id} className="bg-[#123F7B]/15 h-[150px] w-full rounded-[15px] overflow-hidden content-center shadow-lg px-2 py-2">
              <div className="grid grid-cols-6">
                <div className="col-start-1 col-end-2 place-items-center content-center justify-center">
                  <img className="h-28 w-28 rounded-lg bg-white p-1 border border-[#123F7B]" src={report.personInvolved.mostRecentPhoto.url} alt="Most Recent Photo" />
                </div>
                <div className="col-start-2 col-end-6 place-items-start content-start justify-start">
                  <div className="grid grid-row-5 justify-start content-start">
                    <div className="text-[#D46A79] font-bold text-xl">{report.type} Report</div>
                    <div className="text-[#123F7B] font-light text-md">
                      Name: <span className="font-bold">{report.personInvolved.firstName} {report.personInvolved.lastName}</span>
                    </div>
                    <div className="text-[#123F7B] font-light text-md">
                      Date & Time Reported: <span className="font-bold">{new Date(report.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                    </div>
                    <div className="text-[#123F7B] font-light text-md">
                      Last Known Location: <span className="font-bold">{report.personInvolved.lastKnownLocation}</span>
                    </div>
                    <div className="text-[#123F7B] font-bold text-xs">Report ID: {report._id}</div>
                  </div>
                </div>
                <div className="col-start-6 col-end-7 place-items-center content-center justify-center">
                  <Link to={`/admin/report/${report._id}`} className="flex flex-row place-items-center content-center justify-center">
                    <div className="bg-[#123F7B] px-8 py-2 rounded-full shadow-lg">
                      <HiOutlineEye className="text-white w-8 h-8" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;