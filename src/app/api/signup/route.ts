import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { isError } from "@/lib/errors";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    try {
        const { name, email, password } = await req.json()
        const newOTP = Math.floor(100000+Math.random()*900000)

        const existingUserByEmail = await db.user.findUnique({
            where : {
                email : email
            }
        })
        
        if(existingUserByEmail) {
            return NextResponse.json({
                success : false,
                message : "Email already exists"
            }, {
                status : 400
            })
        }
        const emailResponse = await sendVerificationEmail({email, name, otp : newOTP});
        console.log(emailResponse)

        if(!emailResponse.success) {
            return NextResponse.json({
                success : emailResponse.success,
                message : `Error sending email for OTP : ${emailResponse.message}`
            }, {
                status : 500
            })
        }
        
        let tempUserStored;
        if(emailResponse.success) {
            tempUserStored = await db.tempUser.create({
                data : {
                    email,
                    username : name,
                    password,
                    otp : newOTP
                }
            })
        }

        if(!tempUserStored) {
            return NextResponse.json({
                success : false,
                message : "Error Creating temporary user! "
            }, {
                status : 500
            })
        }

        return NextResponse.json({
            success : true,
            message : "Otp send successfully!"
        }, {
            status : 200
        })

    } catch (error) {
        if (isError(error)) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
          } else {
            return NextResponse.json({ success: false, message: "An unknown error occurred" }, { status: 500 });
          }
    }
    
}
