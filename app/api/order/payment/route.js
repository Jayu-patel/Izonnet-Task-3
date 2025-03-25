import Order from "@/app/models/Order";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";

export async function PUT(req){
    try{
        await connectDB()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        const paymentID = searchParams.get("paymentId")

        console.log(id)
        console.log(paymentID)

        const order = await Order.findById(id);
        if(order){
            order.payId = paymentID
            await order.save()
            return NextResponse.json({ message: "order updated" }, { status: 201 });
        }
        else{
            return NextResponse.json({ message: "order not found" }, { status: 404 });
        } 
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req){
    try{
        await connectDB()
        const body = await req.json()
        const {id} = body

        const order = await Order.findById(id)
        if(order){
            order.isPaid = true
            await order.save()
        }
        return NextResponse.json({message: "Payment is verified"}, {status: 201})
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}