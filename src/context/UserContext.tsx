"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface UserData {
  fullname: string;
  email: string;
  password: string;
}

interface UserContextValue extends UserData {
  setUserData: Dispatch<SetStateAction<UserData>>;
}

const initialContextValue: UserContextValue = {
  fullname: "",
  email: "",
  password: "",
  setUserData: () => {},
};

const UserContext = createContext<UserContextValue>(initialContextValue);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>({
    fullname: "",
    email: "",
    password: "",
  });

  return (
    <UserContext.Provider value={{ ...userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContextProvider;
