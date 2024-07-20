"use client"
import { useUserContext } from "@/context/UserContext";
import type { ValidateOTPResponseInterface } from "@/interfaces/ValidateOTPInterface";
import appClient from "@/lib/appClient";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type {ChangeEvent, KeyboardEvent, FormEvent} from 'react'
import { toast } from "sonner";

let currentOtpIndex = 0;

const ValidateOTP = () => {
  const { email } = useUserContext();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);

    if (!value) {
      setActiveOtpIndex(currentOtpIndex - 1);
    } else {
      setActiveOtpIndex(currentOtpIndex + 1);
    }

    setOtp(newOtp);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    currentOtpIndex = index;
    if (e.key === 'Backspace') setActiveOtpIndex(currentOtpIndex - 1);
  };

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        setIsLoading(true)
        const response : AxiosResponse<ValidateOTPResponseInterface> = await appClient.post('/api/validate-otp', {
            email, otp : Number(otp.join(""))
        });
        console.log(response);
        
        if(!response.data?.success) {
            toast.error(response.data?.message)
        }
        toast.success(response.data?.message)
        setIsLoading(false);
        if(response.data?.success) {
            router.replace("/login")
        }
    } catch (error) {
        toast.error("Error while validating OTP")
        setIsLoading(false)
    }

  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <div className="flex justify-center pt-10 h-full">
      <div className="border-2 border-gray-300 translate-y-16 h-[453px] w-[576px] rounded-2xl flex flex-col p-10 gap-14">
        <div className=" flex text-center flex-col gap-7">
          <h1 className="text-3xl font-semibold text-black">Verify your email</h1>
          <p className="text-sm font-light flex flex-col">Enter the 8 digit code you have received on <span>{email}</span></p>
        </div>
        <form className="flex flex-col gap-16" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <span>Code</span>
            <div className="flex justify-between">
              {otp?.map((_, index) => (
                <div key={index}>
                  <input
                    type="number"
                    ref={index === activeOtpIndex ? inputRef : null}
                    value={otp[index]}
                    className="w-12 h-12 border-2 rounded-md transition-all border-gray-300 focus:border-gray-500 font-semibold text-center spin-btn-none"
                    onChange={(e) => handleOnchange(e)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <button disabled={isLoading} className="py-3 px-2 bg-black text-white rounded-md" type="submit">
            {
              isLoading ? "verifying otp..." : "Verify OTP"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default ValidateOTP;
