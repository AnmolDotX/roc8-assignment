"use client";
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";
import LogoutButton from "@/components/Logout";
import { useState } from "react";

const Header = () => {
  const { fullname } = useUserContext();
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleLogoutVisibility = () => {
    setIsLogoutVisible((prev) => !prev);
  };

  return (
    <header>
      <div className="flex flex-col gap-2 bg-white px-10 py-3">
        <div className="relative flex list-none items-center justify-end gap-5 text-xs">
          <li className="hover:text-gray-500 transition-all cursor-pointer">Help</li>
          <li className="hover:text-gray-500 transition-all cursor-pointer">Order & Return</li>
          <li
            className="animate-pulse cursor-pointer font-bold text-red-700 transition-all hover:scale-[1.1] hover:text-gray-600 active:scale-[1]"
            onClick={handleLogoutVisibility}
          >
            Hi! {fullname}
          </li>
          <LogoutButton
            isVisible={isLogoutVisible}
            visibleHandler={handleLogoutVisibility}
          />
        </div>
        <div className="flex items-center justify-between py-1">
          <Link
            href={"/"}
            className="cursor-pointer text-3xl font-bold active:text-gray-900 hover:text-gray-600 transition-all"
          >
            ECOMMERCE
          </Link>
          <nav className="flex list-none gap-7 text-base font-semibold">
            <li className="hover:text-gray-600 transition-all cursor-pointer">Categories</li>
            <li className="hover:text-gray-600 transition-all cursor-pointer">Sales</li>
            <li className="hover:text-gray-600 transition-all cursor-pointer">Clearance</li>
            <li className="hover:text-gray-600 transition-all cursor-pointer">New Stock</li>
            <li className="hover:text-gray-600 transition-all cursor-pointer">Trending</li>
          </nav>
          <div className="flex items-center gap-10">
            <IoSearchOutline className="hover:text-gray-500 transition-all cursor-pointer" size={22} />
            <FiShoppingCart className="hover:text-gray-500 transition-all cursor-pointer" size={22} />
          </div>
        </div>
      </div>
      <p className="flex h-9 animate-pulse items-center justify-center gap-6 bg-neutral-100 text-xs font-medium tracking-wider">
        <IoIosArrowBack size={16} /> Get 10% off on business sign up{" "}
        <IoIosArrowForward size={16} />
      </p>
    </header>
  );
};

export default Header;
