import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent } from '../ui/dialog';
import { FaArrowLeft } from "react-icons/fa6";
import { LuBell } from "react-icons/lu";
import { LiaFacebookMessenger } from "react-icons/lia";
import { TbBrandFacebook } from "react-icons/tb";
import { IoIosRadio } from "react-icons/io";
import { PiCity } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import RadiusMap from "@/components/RadiusMap";
import { addressService } from "@/services/addressService";
import { publishBroadcast } from '@/redux/actions/broadcastActions';

export const BroadcastReport = ({ reportId, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const [broadcastType, setBroadcastType] = useState("Push Notification");
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedScope, setSelectedScope] = useState(null);
    const [radius, setRadius] = useState(5);
    const [citySearch, setCitySearch] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [broadcastLoading, setBroadcastLoading] = useState(false);
  

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setBroadcastType(channel);
  };

  const handleScopeSelect = (scope) => {
    setSelectedScope(scope);
  };

  const handleCitySearch = async (text) => {
    setCitySearch(text);
    if (text.length > 2) {
      setLoadingCities(true);
      try {
        const suggestions = await addressService.searchCities(text);
        setCitySuggestions(suggestions);
      } catch (error) {
        console.error('Failed to fetch city suggestions:', error);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySearch(city.label);
    setCitySuggestions([]);
  };

  const handleBroadcast = async () => {
    if (!selectedChannel || !selectedScope) {
      alert('Please select both a channel and a scope.');
      return;
    }

    const scope = {
      type: selectedScope,
      ...(selectedScope === 'city' && { city: selectedCity ? selectedCity.label : 'Default City' }),
      ...(selectedScope === 'radius' && { radius: parseInt(radius, 10) }),
    };

    const broadcastData = {
        broadcastType,
        scope,
    };

    setBroadcastLoading(true);
    const result = await dispatch(publishBroadcast(reportId, broadcastData));
    setBroadcastLoading(false);

    if (result.success) {
      alert('Broadcast sent successfully!');
    } else {
      alert(`Failed to send broadcast: ${result.error}`);
      alert(`Failed to send broadcast: ${broadcastType} ${scope}`);
    }
  };

  return (
    <div className='flex flex-col place-items-center content-center justify-center pb-4 w-full h-full'>
      <div className='flex flex-row place-items-center justify-center w-full px-8'>
        <div
          className='flex flex-row place-items-center justify-center py-2 px-4 space-x-2 cursor-pointer hover:bg-[#123f7b]/15 hover:rounded-xl'
          onClick={onClose}
        >
          <FaArrowLeft className='w-6 h-6 text-[#123F7B]' />
          <p className='text-[#123F7B] text-md font-normal'>Go Back</p>
        </div>
      </div>
      <div className='flex flex-col place-items-center justify-center w-full h-full px-4 py-2 space-y-4'>
        <div className='flex flex-col place-items-start justify-start w-full h-full space-y-1'>
          <p className='text-[#123F7B] text-lg font-bold'>Broadcast Report</p>
          <p className='text-[#123F7B] text-sm font-normal leading-4'>
            Inform the users about the case by picking the options from the two categories below.
          </p>
        </div>
        <div className='flex flex-col place-items-center justify-center w-full h-full space-y-1'>
          <div className='flex flex-row items-start content-center justify-center w-full h-full space-x-4'>
            {/* Channel Options */}
            <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
              <div className='justify-start w-full'>
                <p className='text-start font-semibold'>Channel Options</p>
              </div>
              <div className='flex flex-col place-items-center justify-center w-full h-full space-y-1'>
                {[
                  { id: 'Push Notification', label: 'Push Notifications', description: 'Send push notification to users.', icon: <LuBell className='w-6 h-6 text-[#2173E1]' /> },
                  { id: 'Messenger', label: 'Messenger App', description: 'Send notification through the Messenger app to registered users.', icon: <LiaFacebookMessenger className='w-6 h-6 text-[#2173E1]' /> },
                  { id: 'Facebook Post', label: 'Facebook Post', description: 'Create a post to AgapayAlert’s Facebook page.', icon: <TbBrandFacebook className='w-6 h-6 text-[#2173E1]' /> },
                  { id: 'all', label: 'All', description: 'Use all available channels.', icon: <IoIosRadio className='w-6 h-6 text-[#123F7B]' /> },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    className={`flex flex-row place-items-center justify-start w-full h-full space-x-2 border px-2 py-3 rounded-xl cursor-pointer ${
                      selectedChannel === channel.id ? 'bg-[#123F7B]/10 border-2 border-[#123F7B]' : 'border-[#123F7B] hover:bg-[#123F7B]/10 hover:border-2'
                    }`}
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    <div>{channel.icon}</div>
                    <div className='flex flex-col -space-y-0.5 pr-1'>
                      <p className='text-[#123F7B] text-sm font-normal'>{channel.label}</p>
                      <p className='text-[#123F7B] text-xs font-extralight'>{channel.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scope Options */}
            <div className='flex flex-col items-start content-center w-full h-full space-y-1'>
              <div className='justify-start w-full'>
                <p className='text-start font-semibold'>Scope Options</p>
              </div>
              <div className='flex flex-col place-items-center justify-center w-full h-full space-y-1'>
                {[
                  { id: 'city', label: 'City', description: 'Send to users within a city.', icon: <PiCity className='w-6 h-6 text-[#7B61FF]' /> },
                  { id: 'radius', label: 'Radius', description: 'Send to users within a specific radius.', icon: <CiLocationOn className='w-6 h-6 text-[#2173E1]' /> },
                  { id: 'all', label: 'All Users', description: 'Send to all users.', icon: <FaUsers className='w-6 h-6 text-[#123F7B]' /> },
                ].map((scope) => (
                  <div
                    key={scope.id}
                    className={`flex flex-row place-items-center justify-start w-full h-full space-x-2 border px-2 py-3 rounded-xl cursor-pointer ${
                      selectedScope === scope.id ? 'bg-[#123F7B]/10 border-2 border-[#123F7B]' : 'border-[#123F7B] hover:bg-[#123F7B]/10 hover:border-2'
                    }`}
                    onClick={() => handleScopeSelect(scope.id)}
                  >
                    <div>{scope.icon}</div>
                    <div className='flex flex-col -space-y-0.5 pr-1'>
                      <p className='text-[#123F7B] text-sm font-normal'>{scope.label}</p>
                      <p className='text-[#123F7B] text-xs font-extralight'>{scope.description}</p>
                      {scope.id === 'city' && selectedScope === 'city' && (
                        <div className='mt-2'>
                          <input
                            type='text'
                            value={citySearch}
                            onChange={(e) => handleCitySearch(e.target.value)}
                            placeholder='Search city...'
                            className='w-full p-2 border border-gray-300 rounded'
                          />
                          {loadingCities && <p className='text-sm text-gray-500'>Loading...</p>}
                          {citySuggestions.length > 0 && (
                            <div className='mt-2 border border-gray-200 rounded max-h-32 overflow-y-auto'>
                              {citySuggestions.map((city) => (
                                <div
                                  key={city.value}
                                  className='p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-100'
                                  onClick={() => handleCitySelect(city)}
                                >
                                  {city.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {scope.id === 'radius' && selectedScope === 'radius' && (
                        <div className='mt-2'>
                          <input
                            type='number'
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            placeholder='Enter radius in km'
                            className='w-full p-2 border border-gray-300 rounded'
                          />
                          <div className='mt-4'>
                            <RadiusMap center={{ lat: 14.5176, lng: 121.0509 }} radiusKm={radius} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-row place-items-end justify-end w-full h-full'>
            <button
              className={`bg-[#123F7B] text-white text-md font-normal px-6 py-3 rounded-2xl ${
                selectedChannel && selectedScope ? 'hover:bg-[#123F7B]/80' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleBroadcast}
              disabled={!selectedChannel || !selectedScope || broadcastLoading} // Disable button if no selection or loading
            >
              {broadcastLoading ? 'Broadcasting...' : 'Broadcast Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastReport;