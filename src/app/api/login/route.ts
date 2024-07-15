import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken } from "@/helpers/tokenManager"
import { CustomError, isError } from "@/lib/errors";

const generateAccessAndRefereshTokens = async(user : any) =>{
    try {
        const accessToken = generateAccessToken(user)
        
        const refreshToken = generateRefreshToken(user)

        await db.user.update({
            where : {id : user?.id},
            data : {
                refreshToken,
            }
        });

        return {accessToken, refreshToken}


    } catch (error : unknown) {
        throw new CustomError("Something went wrong while generating referesh and access token")
    }
}

export async function POST(req : NextRequest) {
    try {
        const {email, password} = await req.json();

        const user = await db.user.findUnique({
            where : {email}
        })

        if(!user) {
            return NextResponse.json({success : false, message : "User does not exist"}, {status : 404})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            NextResponse.json({success : false, message : "Invalid Password"},{status : 401})
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user);
        

        const loggedInUser = await db.user.findUnique({
            where : {
                id : user.id
            },
            select : {
                id : true,
                name : true,
                refreshToken : true,
                email : true,
                emailVerified : true,
                createdAt : true,
                updatedAt : true
            }
        })

        const options = {
            httpOnly : true,
            secure : true
        }

        const respose = NextResponse
                .json({
                    success : true,
                    messsage : "user logged in successfully",
                    user : loggedInUser
                },{
                    status : 200
                })
        respose.cookies.set('accessToken', accessToken, options)
        respose.cookies.set('refreshToken', refreshToken, options)
        return respose;
    } catch (error : unknown) {
        if (isError(error)) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
          } else {
            return NextResponse.json({ success: false, message: "An unknown error occurred" }, { status: 500 });
          }
    }
}