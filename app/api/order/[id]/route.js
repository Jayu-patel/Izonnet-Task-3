import Order from "@/app/models/Order";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(req,{params}){
    try{
        await connectDB()
        const {id} = await params
        const orders = await Order.find({user: id})
    
        if(!orders){
            return NextResponse.json({ message: "order not found" }, { status: 404 });
        }
        else{
            return NextResponse.json(orders, { status: 201 });
        }
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}