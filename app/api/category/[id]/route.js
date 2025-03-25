import { connectDB } from "@/app/lib/mongodb";
import Category from "@/app/models/Category";
import { NextResponse } from "next/server";

export async function PUT(req,{params}){
    try{
        connectDB()
        const {id} = await params
        const body = await req.json()

        const category = await Category.findById(id)

        if(category){
            category.name = body.name || category.name
            await category.save()

            return NextResponse.json({message: "Category updated"},{status: 201})
        }
        else return NextResponse.json({ message: "Category not found" }, { status: 404 });

    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req,{params}){
    try{
        await connectDB()
        const {id} = await params

        const category = await Category.findById(id);

        if(category){
            await Category.deleteOne({_id: category._id})
            return NextResponse.json({message: "Category deleted"},{status: 201})
        }
        else return NextResponse.json({ message: "Category not found" }, { status: 404 });

    }
    catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}