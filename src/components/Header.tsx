"use client"
import { IoSearchOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";

const Header = () => {
    const {fullname} = useUserContext();
    return (
        <header>
            <div className="bg-white py-3 flex flex-col px-10 gap-2">
                <div className="flex list-none items-center text-xs gap-5 justify-end">
                    <li>Help</li>
                    <li>Order & Return</li>
                    <li>Hi! {fullname}</li>
                </div>
                <div className=" flex justify-between items-center py-1">
                    <Link href={"/"} className="text-3xl font-bold cursor-pointer">
                        ECOMMERCE
                    </Link>
                    <nav className="flex list-none gap-7 font-semibold text-base">
                        <li>Categories</li>
                        <li>Sales</li>
                        <li>Clearance</li>
                        <li>New Stock</li>
                        <li>Trending</li>
                    </nav>
                    <div className=" flex gap-10 items-center">
                    <IoSearchOutline size={22}/>
                    <FiShoppingCart size={22}/>
                    </div>
            </div>
            </div>
            <p className="h-9 bg-neutral-100 text-xs tracking-wider font-medium flex items-center justify-center gap-6"><IoIosArrowBack size={16} /> Get 10% off on business sign up <IoIosArrowForward size={16} /></p>
        </header>
    );
}

export default Header;