import Product from "@/app/models/Product";
import Order from "@/app/models/Order";
import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(){
    try{
        await connectDB()
        const order = await Order.find().populate("user", "username")
        return NextResponse.json(order, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(req){
    try{
        await connectDB()
        const body = await req.json()
        const {orderItems, userId, address, city, state, zip, total} = body

        if (orderItems && orderItems.length === 0) {
            return NextResponse.json({ message: "No order items" }, { status: 400 });
        }

        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        })

        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find(
                (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
            );
        
            if (!matchingItemFromDB) {
                return NextResponse.json({ message: `Product not found: ${itemFromClient._id}` }, { status: 404 });
            }
        
            return {
                ...itemFromClient,
                product: itemFromClient._id,
                price: matchingItemFromDB.price,
                _id: undefined,
            };
        });
        const order = new Order({
            orderItems: dbOrderItems,
            user: userId,
            address,
            city,
            state,
            zip,
            total,
        })

        const createdOrder = await order.save()
        return NextResponse.json(createdOrder, {status: 201})
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}