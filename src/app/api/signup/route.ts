import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { db } from "@/server/db";

export async function POST(req : Request) {
    try {
        const { name, email, password } = await req.json()
        const newOTP = Math.floor(100000+Math.random()*900000)

        const existingUserByEmail = await db.user.findUnique({
            where : {
                email : email
            }
        })
        
        if(existingUserByEmail) {
            return Response.json({
                success : false,
                message : "Email already exists"
            }, {
                status : 400
            })
        }
        const emailResponse = await sendVerificationEmail({email, name, otp : newOTP});
        console.log(emailResponse)

        if(!emailResponse.success) {
            return Response.json({
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
            return Response.json({
                success : false,
                message : "Error Creating temporary user! "
            }, {
                status : 500
            })
        }

        return Response.json({
            success : true,
            message : "Otp send successfully!"
        }, {
            status : 200
        })

    } catch (error) {
        console.log('Error registering user', error)
        return Response.json(
            {
                success : false,
                message : "Error in registering user"
            },
            {
                status : 500
            }
        )
    }
    
}
