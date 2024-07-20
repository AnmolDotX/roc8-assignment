"use client"
import { useUserContext } from "@/context/UserContext";
import type { IUserLoginResponse } from "@/interfaces/UserLoginInterface";
import appClient from "@/lib/appClient";
import type { AxiosResponse } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type {ChangeEvent, FormEvent} from 'react';
import { toast } from "sonner";

const LoginPage = () => {

    interface loginFormDataTypes {
        email : string,
        password : string
    }
    const [loginFormData, setLoginFormData] = useState<loginFormDataTypes>({
        email : "",
        password : ""
    });
    const {setLoggedInUser} = useUserContext()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter()

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginFormData((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    const submitHandler = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response : AxiosResponse<IUserLoginResponse> = await appClient.post('/api/login', {
                email : loginFormData.email, password : loginFormData.password
            });
            const data = response.data;
            
            
            if(data.success) {
                toast.success(data.message);
                router.replace('/')
                setLoggedInUser(data.user)
            }
            if(!data.success) {
                toast.error(data.message)
            }
            setIsLoading(false)
        } catch (error) {
            if(error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("unexpected error while user login")
            }
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={submitHandler} className="flex flex-col w-[30%] h-[50vh] gap-5 py-10 px-12 rounded-xl items-start border-2 -translate-y-16">
            <div className="flex flex-col gap-1 w-full">
                <h1 className="font-bold text-2xl tracking-wide w-full text-center">Login</h1>
                <h4 className="font-medium text-lg w-full text-center">Welcome back to ECOMMERCE</h4>
                <p className="font-medium text-sm w-full text-center text-gray-800">The next gen business marketplace</p>
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email">
                    Email
                </label>
                <input id="email" name="email" value={loginFormData.email} onChange={handleChange} className="border-2 w-full py-2 px-5 rounded-lg" type="text" placeholder="Enter your email " />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password">
                    Password
                </label>
                <input id="password" value={loginFormData.password} onChange={handleChange} name="password" className="border-2 w-full py-2 px-5 rounded-lg" type="text" placeholder="Enter your password " />
            </div>
            <button disabled={isLoading} type="submit" className={`border-2 ${isLoading ? "bg-black/70" : "bg-black"} text-white w-full py-2 px-5 rounded-lg`}>
                {
                    isLoading ? "...logging in" : "Login"
                }
            </button>
            <div className="flex items-center justify-center w-full gap-2 text-sm">
                <p className="text-gray-700">Don&apos;t have an account ? </p>
                <Link href="/signup" className=" font-medium cursor-pointer hover:text-gray-800">Signup</Link>
            </div>
        </form>
    );
}

export default LoginPage;