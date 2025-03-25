import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import Otp from "@/app/models/Otp";
import { NextResponse } from "next/server";
import otpGenerator from "otp-generator"
import jwt from "jsonwebtoken"
import { sendEmail } from "@/app/utils/sendEmail";

export async function GET(req){
    try{
        await connectDB()
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        const user = await User.findOne({email});
        if(!user) return NextResponse.json({message: "User does not exist"}, { status: 404 });

        const otp =  otpGenerator.generate(6,{
                lowerCaseAlphabets: false, 
                upperCaseAlphabets: false, 
                specialChars: false
        })

        const otpDb = new Otp({email,otp});
        await otpDb.save()
        await sendEmail(email, "OTP", `Dear user, \nYour otp for password update is ${otp}`);
        
        return NextResponse.json({message: "OTP send to your registered email"}, {status: 201})
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(req){
    try{
        await connectDB()
        const body = await req.json()
        const {email, otp} = body

        const codeExist = await Otp.findOne({email, otp})
        if(codeExist){
            const otp_used = codeExist.otp_used
            if(otp_used){
                return NextResponse.json({message: 'Otp expired'}, {status: 400})
            }
            else{
                codeExist.otp_used = true
                await codeExist.save()
                const token = jwt.sign({email,otp}, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });
                const res = NextResponse.json({message: "verify successfully", token}, {status: 201})
                res.cookies.set({
                    name: 'updatePass', value: token, httpOnly: true, secure: false, path: '/', maxAge: 60 * 5,
                });
                return res
            }
            
        }
        else{
            return NextResponse.json({message: "Invalid OTP. Please try again."}, {status: 400})

        }
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}