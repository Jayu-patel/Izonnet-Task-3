import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, email, password } = body
    if ( !username || !email || !password) return NextResponse.json({message: "Please provide all data"}, { status: 400 });

    const userExists = await User.findOne({ email });
    if(userExists) return NextResponse.json({message: "User already exists"}, {status: 400});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save()

    const userObj = {
        id: newUser._id,
        username,
        email,
        isAdmin: newUser.isAdmin
    }

    // const token = jwt.sign({...userObj}, process.env.JWT_SECRET, {
    //     expiresIn: "7d",
    // });

    return NextResponse.json({...userObj}, {status: 201})
    
  } 
  catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}