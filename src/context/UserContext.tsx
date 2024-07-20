"use client"
import { IUser } from '@/interfaces/UserLoginInterface';
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface UserData {
  fullname: string;
  email: string;
  password: string;
}

interface UserContextValue extends UserData {
  setUserData: Dispatch<SetStateAction<UserData>>;
  loggedInUser: IUser;
  setLoggedInUser: Dispatch<SetStateAction<IUser>>;
}

const initialContextValue: UserContextValue = {
  fullname: "",
  email: "",
  password: "",
  setUserData: () => {},
  loggedInUser: {
    id: 0,
    name: "",
    email: "",
    checkedCategories: [],
    emailVerified: false,
    refreshToken: "",
    createdAt: "",
    updatedAt: ""
  },
  setLoggedInUser: () => {},
};

const UserContext = createContext<UserContextValue>(initialContextValue);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>({
    fullname: "",
    email: "",
    password: "",
  });

  const [loggedInUser, setLoggedInUser] = useState<IUser>(initialContextValue.loggedInUser);

  return (
    <UserContext.Provider value={{ ...userData, setUserData, loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContextProvider;
