import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET)

export async function GET(req,{params}){
    try{
        const {id} = await params

        if(!id){
            return NextResponse.json({ message: "Session ID is required" }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(id);
        return NextResponse.json(session, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(req,{params}){
    try{
        const {id} = await params

        if(!id){
            return NextResponse.json({ message: "Session ID is required" }, { status: 400 });
        }

        const paymentIntent =  await stripe.checkout.sessions.retrieve(id);
        return NextResponse.json({ status: paymentIntent.payment_status }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}