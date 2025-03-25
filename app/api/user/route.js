import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select("-password")
    return NextResponse.json(users, { status: 200 });
  } 
  catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}