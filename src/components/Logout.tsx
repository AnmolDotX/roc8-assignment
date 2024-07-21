import { LogoutResponse } from '@/interfaces/LogoutResponseType';
import appClient from '@/lib/appClient';
import { AxiosResponse } from 'axios';
import React from 'react';
import { toast } from 'sonner';

interface stateType {
    isVisible : boolean;
    visibleHandler : () => void
}

const LogoutButton: React.FC<stateType> = ({isVisible, visibleHandler}) => {
  const handleLogout = async () => {
    const response : AxiosResponse<LogoutResponse> = await appClient.get('/api/logout');

    if (response.data.success) {
      window.location.href = '/login';
    } else {
      const data : LogoutResponse = response.data;
      toast.error(data.message);
    }
  };

  return isVisible && (
    <button className="absolute -bottom-16  bg-black/80 backdrop-filter backdrop-blur-sm rounded-md rounded-tr-none py-2 px-5 ">
      <span onClick={handleLogout} className='hover:text-red-600 active:shadow-lg shadow-2xl shadow-black/90 text-base z-10 text-red-400'> Logout</span>
      <span onClick={visibleHandler} className='text-sm absolute -top-[18px] rounded-t-md bg-black right-0 px-4 font-medium hover:text-black/70 hover:text-red-400 text-white'>{"X"}</span>
    </button>
  );
};

export default LogoutButton;
