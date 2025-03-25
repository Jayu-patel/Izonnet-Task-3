import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET)

export async function POST(req){
    try {
        const body = await req.json()
        const {products} = body
        
        const items = products.map(product=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name: product.name,
                    images: [product.image]
                },
                unit_amount: Math.round(product.price * 100)
            },
            quantity: product.quantity
        }))
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items,
            mode: "payment",
            success_url: `https://izonnet-task-3.vercel.app/payment-success`,
            cancel_url: `https://izonnet-task-3.vercel.app/payment-cancel`,
        })
        return NextResponse.json({id: session.id}, { status: 201 });
    } 
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
