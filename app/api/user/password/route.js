import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function PUT(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { email, password } = body

        const user = await User.findOne({email})
        if(user){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword
            const updatedUser = await user.save();

            return NextResponse.json(
            {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                },
                {status: 201}
            )
        }
        else{
            return NextResponse.json({message: "User not found"}, { status: 404 });
        }
      } 
      catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
}