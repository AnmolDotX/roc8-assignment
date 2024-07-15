import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  otp: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  otp,
}) => (
  <div className="w-[500px] bg-black text-white rounded-md">
    <h4>
      Welcome, <span className="font-bold text-sky-600">{name}</span>!
      Thanks for registering with us
    </h4>
    <p>
      This is the otp sent onto your give email{" "}
      <span className="font-bold text-sky-600">{email}</span>
    </p> 
    <h2 className="flex w-full items-center justify-center rounded-md bg-sky-300/70 py-5">
      <b className="text-xl font-bold">{otp}</b>
    </h2>
  </div>
);
