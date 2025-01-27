import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, logout } from '../redux/actions/authActions';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { FaGoogle } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import logo from '../assets/AGAPAYALERT.svg';
import loginvideo from '../assets/loginvideo.mp4';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    platform: 'web',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = async (credentials, { setSubmitting, setErrors }) => {
    const response = await dispatch(login(credentials));
    console.log('Login response:', response);
    setSubmitting(false);
    if (response.success) {
      const userRoles = response.data.user.roles;
      if (userRoles.includes('user')) {
        console.log('user: ',userRoles);
        navigate('/');
      } else {
        console.log('Navigating to admin dashboard');
        console.log('role: ',userRoles);
        navigate('/admin/dashboard');

      }
    } else {
      setErrors({ server: response.error });
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 bg-white px-4 py-2 backdrop-blur-sm bg-opacity-70 z-10">
      <div className='flex flex-row justify-between items-center'>
        <img src={logo} alt='AGAPAYALERT' className='h-14 w-14' />
        <div className="hidden lg:flex flex-row place-items-center space-x-8 lg:space-x-16 pl-16">
          <Link to="/" className={`font-normal text-base ${location.pathname === '/' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`}>HOME</Link>
          <Link to="/about" className={`font-normal text-base ${location.pathname === '/about' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`}>ABOUT</Link>
          <Link to="/reports" className={`font-normal text-base ${location.pathname === '/reports' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`}>REPORTS</Link>
          <Link to="/support" className={`font-normal text-base ${location.pathname === '/support' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`}>SUPPORT</Link>
        </div>
        <div className="hidden lg:flex place-items-center pr-16">
          {isAuthenticated ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={user?.avatar?.url || "https://via.placeholder.com/150"}
                  alt={user?.firstName} className="h-8 w-8 rounded-full" />
                <span>{user?.firstName}</span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-[#123F7B] hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-[#D46A79] hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#123F7B] text-white font-normal text-base px-4 py-2 rounded-2xl shadow-md hover:bg-[#123F7B]/90">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1120px] sm:max-h-[1020px]">
                <div className="pl-6 pr-2 py-2">
                  <div className="grid grid-cols-5 gap-14">
                    <div className='col-start-1 col-end-3 justify-center flex flex-col'>
                      <div className='pb-12'>
                        <img src={logo} alt='AGAPAYALERT' className='h-14 w-14' />
                      </div>
                      <div className='flex flex-col justify-between text-pretty'>
                        <div className="text-pretty">
                          <p className="text-4xl font-extrabold tracking-wide">Be a part <br />of the solution.</p>
                          <p className="text-xs font-extralight pb-4">Help protect your loved ones and neighbors.</p>
                        </div>
                        <div className='items-center'>
                          <Button className="bg-white border border-[#123F7B] text-[#123F7B] font-semibold text-base w-full px-4 py-4 rounded-md shadow-md hover:bg-[#123F7B]/10"><FaGoogle /> Sign in with Google</Button>
                          <div className='flex flex-row items-center space-x-4 pt-4'>
                            <div className='w-full h-px bg-gray-300'></div>
                            <p className='text-xs'>or</p>
                            <div className='w-full h-px bg-gray-300'></div>
                          </div>
                          <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                          >
                            {({ isSubmitting, errors }) => (
                              <Form className="w-full">
                                <p className="text-xs font-bold pt-4">Email</p>
                                <Field
                                  type="email"
                                  name="email"
                                  className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#123F7B] focus:border-2 px-2 py-2"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                                <p className="text-xs font-bold pt-4">Password</p>
                                <Field
                                  type="password"
                                  name="password"
                                  className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#123F7B] focus:border-2 px-2 py-2"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                                {errors.server && <div className="text-red-500 text-xs">{errors.server}</div>}
                                <div className="pt-4">
                                  <Button
                                    type="submit"
                                    className="bg-[#123F7B] text-white font-semibold text-base w-full px-4 py-4 rounded-md shadow-md hover:bg-[#123F7B]/90"
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                                  </Button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                        <div className='flex flex-row items-center pt-4'>
                          <p className='text-xs pr-2'>Don't have an account?</p>
                          <Link to="/" className="text-[#123F7B] font-semibold text-xs">Sign Up</Link>
                        </div>
                      </div>
                    </div>
                    <div className='col-start-3 col-end-6 place-items-center'>
                      <video src={loginvideo} alt="AGAPAYALERT" className="w-full h-auto rounded-3xl" autoPlay loop muted />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="lg:hidden flex items-center">
          <button
            className="text-[#123F7B] focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden flex flex-col space-y-2 mt-2">
          <Link to="/" className={`font-normal text-base ${location.pathname === '/' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`} onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link to="/about" className={`font-normal text-base ${location.pathname === '/about' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`} onClick={() => setMenuOpen(false)}>ABOUT</Link>
          <Link to="/reports" className={`font-normal text-base ${location.pathname === '/reports' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`} onClick={() => setMenuOpen(false)}>REPORTS</Link>
          <Link to="/support" className={`font-normal text-base ${location.pathname === '/support' ? 'bg-[#123F7B] rounded-full px-4 py-2 text-white' : ''}`} onClick={() => setMenuOpen(false)}>SUPPORT</Link>
          {isAuthenticated ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={user?.avatar?.url || "https://via.placeholder.com/150"}
                  alt={user?.firstName} className="h-8 w-8 rounded-full" />
                <span>{user?.firstName}</span>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-[#123F7B] hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-[#D46A79] hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#123F7B] text-white font-normal text-base px-4 py-2 rounded-2xl shadow-md hover:bg-[#123F7B]/90">Sign In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1120px] sm:max-h-[1020px]">
                <div className="pl-6 pr-2 py-2">
                  <div className="grid grid-cols-5 gap-14">
                    <div className='col-start-1 col-end-3 justify-center flex flex-col'>
                      <div className='pb-12'>
                        <img src={logo} alt='AGAPAYALERT' className='h-14 w-14' />
                      </div>
                      <div className='flex flex-col justify-between text-pretty'>
                        <div className="text-pretty">
                          <p className="text-4xl font-extrabold tracking-wide">Be a part <br />of the solution.</p>
                          <p className="text-xs font-extralight pb-4">Help protect your loved ones and neighbors.</p>
                        </div>
                        <div className='items-center'>
                          <Button className="bg-white border border-[#123F7B] text-[#123F7B] font-semibold text-base w-full px-4 py-4 rounded-md shadow-md hover:bg-[#123F7B]/10"><FaGoogle /> Sign in with Google</Button>
                          <div className='flex flex-row items-center space-x-4 pt-4'>
                            <div className='w-full h-px bg-gray-300'></div>
                            <p className='text-xs'>or</p>
                            <div className='w-full h-px bg-gray-300'></div>
                          </div>
                          <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                          >
                            {({ isSubmitting, errors }) => (
                              <Form className="w-full">
                                <p className="text-xs font-bold pt-4">Email</p>
                                <Field
                                  type="email"
                                  name="email"
                                  className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#123F7B] focus:border-2 px-2 py-2"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
                                <p className="text-xs font-bold pt-4">Password</p>
                                <Field
                                  type="password"
                                  name="password"
                                  className="w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#123F7B] focus:border-2 px-2 py-2"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                                {errors.server && <div className="text-red-500 text-xs">{errors.server}</div>}
                                <div className="pt-4">
                                  <Button
                                    type="submit"
                                    className="bg-[#123F7B] text-white font-semibold text-base w-full px-4 py-4 rounded-md shadow-md hover:bg-[#123F7B]/90"
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                                  </Button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                        <div className='flex flex-row items-center pt-4'>
                          <p className='text-xs pr-2'>Don't have an account?</p>
                          <Link to="/" className="text-[#123F7B] font-semibold text-xs">Sign Up</Link>
                        </div>
                      </div>
                    </div>
                    <div className='col-start-3 col-end-6 place-items-center'>
                      <video src={loginvideo} alt="AGAPAYALERT" className="w-full h-auto rounded-3xl" autoPlay loop muted />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;