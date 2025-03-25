import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body
    if (!email || !password) return NextResponse.json({message: "Please provide all data"}, { status: 400 });

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      const isPasswordValid = await bcrypt.compare( password, existingUser.password);

      if (isPasswordValid) {   
        const resObj = {
            _id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin,
            number: existingUser.number,
            address: existingUser.address,
            city: existingUser.city,
            state: existingUser.state,
        }
        const res = NextResponse.json({...resObj}, { status: 201 });

        const token = jwt.sign({...resObj}, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        if(existingUser.isAdmin){
          res.cookies.set({
              name: 'jwtAdmin', value: token, httpOnly: true, secure: false, path: '/', maxAge: 60 * 60 * 24 * 7,
          });
        }
        else{
            res.cookies.set({
                name: 'jwt', value: token, httpOnly: true, secure: false, path: '/', maxAge: 60 * 60 * 24 * 7,
            });
        }
        return res
      }
      else return NextResponse.json({message: "Password is incorrect"}, { status: 400 });
    }
    else return NextResponse.json({message: "User not found"}, { status: 404 });
  } 
  catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
    // return NextResponse.json(users, { status: 200 });
  }
}