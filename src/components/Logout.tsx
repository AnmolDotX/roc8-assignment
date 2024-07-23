import { LogoutResponse } from '@/interfaces/LogoutResponseType';
import appClient from '@/lib/appClient';
import { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface stateType {
    isVisible : boolean;
    visibleHandler : () => void
}

const LogoutButton: React.FC<stateType> = ({isVisible, visibleHandler}) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async () => {
      try {
        setIsLoading(true);
        const response : AxiosResponse<LogoutResponse> = await appClient.get('/api/logout');
        if (response.data.success) {
          window.location.href = '/login';
        } else {
          const data : LogoutResponse = response.data;
          toast.error(data.message);
        }
        setIsLoading(false);
      } catch (error : unknown) {
        if(error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("unknown error while loging out")
        }
        setIsLoading(false)
      }
  };

  return isVisible && (
    <button className="absolute -bottom-20 z-10  bg-white/90 backdrop-filter backdrop-blur-md rounded-md rounded-tr-none py-2 px-5  border-2 border-black shadow-2xl shadow-black/90">
      <span onClick={handleLogout} className='hover:text-red-6004 text-base z-10 text-red-400'>
        {
          isLoading ? "loging out..." : "Logout"
        }
      </span>
      <span onClick={visibleHandler} className='text-sm absolute -top-[30px] rounded-t-md bg-white/90 border-2 border-black border-b-0 -right-[2px] px-4 py-1 font-medium hover:text-black/70 hover:text-red-400 text-black backdrop-blur-md backdrop-filter'>{"X"}</span>
    </button>
  );
};

export default LogoutButton;
