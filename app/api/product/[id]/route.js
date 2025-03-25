import { connectDB } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET(req,{params}){
    try{
      await connectDB()
        const {id} = await params
        const product = await Product.findById(id).populate("category")

        if(product) return NextResponse.json(product, { status: 201 });
        else NextResponse.json({ message: "product not found" }, { status: 404 });
    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req,{params}){
    try{
      await connectDB()
        const {id} = await params
        const body = await req.json()

        const {name, price, brand, category, image, quantity, countInStock} = body
        switch (true) {
            case !name:
              return NextResponse.json({ message: "Name is required" }, { status: 400 });
            case !brand:
              return NextResponse.json({ message: "Brand is required" }, { status: 400 });
            case !image:
              return NextResponse.json({ message: "Image is required" }, { status: 400 });
            case !price:
              return NextResponse.json({ message: "Price is required" }, { status: 400 });
            case !category:
              return NextResponse.json({ message: "Category is required" }, { status: 400 });
            case !quantity:
              return NextResponse.json({ message: "Quantity is required" }, { status: 400 });
            case !countInStock:
              return NextResponse.json({ message: "countInStock is required" }, { status: 400 });
          }

          const product = await Product.findByIdAndUpdate(
            id,
            { ...body }
          )
          await product.save()
          return NextResponse.json({ message: "Product updated" }, { status: 201 });

    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req,{params}){
    try{
      await connectDB()
        const {id} = await params
        const product = await Product.findByIdAndDelete(id);
        return NextResponse.json(product, { status: 201 });

    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}