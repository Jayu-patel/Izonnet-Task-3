import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"

export async function GET(){
    try{
        await connectDB()
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req,{params}){
    try{
        connectDB()
        const {id} = await params
        const body = await req.json()
        
        const user = await User.findById(id);

        if (user) {
            user.username = body.username || user.username;
            user.email = body.email || user.email;
            user.number = body.number || user.number;
            user.address = body.address || user.address;
            user.city = body.city || user.city;
            user.state = body.state || user.state;

            const updatedUser = await user.save();
        
            return NextResponse.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                address: updatedUser.address,
                city: updatedUser.city,
                state: updatedUser.state,
                number: updatedUser.number,
            }, 
            {status: 201})
        }
        else return NextResponse.json({ message: "User not found" }, { status: 404 });

    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req,{params}){
    try{
        await connectDB()
        const {id} = await params

        const user = await User.findById(id);

        if(user){
            if(user.isAdmin){
                return NextResponse.json({message: "Can not delete Admin"}, {status: 400})
            }
            await User.deleteOne({ _id: user._id });
            return NextResponse.json({message: "User removed"}, {status: 201})
        }
        else return NextResponse.json({message: "User not found"}, {status: 404})
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}