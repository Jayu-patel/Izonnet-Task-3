import { connectDB } from "./mongodb";
import User from "../models/User";
import bcrypt from "bcrypt"

export async function createAdmin(){
    connectDB()
    const adminExists = await User.exists({ isAdmin: true })


    if(!adminExists){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin", salt);
        const admin = new User({
            username: "admin",
            email: "admin@gmail.com",
            password : hashedPassword,
            isAdmin: true
        })

        await admin.save()
    }
    else{
        console.log("Admin already exists")
    }
}