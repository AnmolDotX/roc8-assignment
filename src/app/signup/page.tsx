"use client"
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const SignupPage = () => {
    const {email, fullname, password, setUserData} = useUserContext();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e : ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUserData((prev)=>({
            ...prev,
            [name] : value
        }))
    }

    const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const response = await axios.post('/api/signup', {
                name : fullname,
                email,
                password
            });
            setIsLoading(false);
            if(response.data?.success) {
                toast.success(response.data?.message)
                router.push('signup/validate-otp')
            }
        } catch (error) {
            toast.error("Error creating account!")
        }
        // router.push('signup/validate-otp');
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-[30%] h-[60vh] gap-5 py-10 px-12 rounded-xl items-start border-2 -translate-y-5">
            <h1 className="font-bold text-2xl tracking-wide w-full text-center">Create your account</h1>
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="fullname">
                    Name
                </label>
                <input onChange={handleChange} value={fullname} id="fullname" name="fullname" className="border-2 w-full py-2 px-5 rounded-lg" type="text" placeholder="Enter your fullname " />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email">
                    Email
                </label>
                <input onChange={handleChange} value={email} id="email" name="email" className="border-2 w-full py-2 px-5 rounded-lg" type="text" placeholder="Enter your email " />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password">
                    Password
                </label>
                <input onChange={handleChange} value={password} id="password" name="password" className="border-2 w-full py-2 px-5 rounded-lg" type="text" placeholder="Enter your password " />
            </div>
            <button type="submit" className="border-2 bg-black text-white w-full py-2 px-5 rounded-lg">
                Create Account
            </button>
            <div className="flex items-center justify-center w-full gap-2 text-sm">
                <p className="text-gray-700">Have an account ? </p>
                <Link href="/login" className=" font-medium cursor-pointer hover:text-gray-800">Login</Link>
            </div>
        </form>
    );
}

export default SignupPage;