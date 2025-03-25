import { connectDB } from "@/app/lib/mongodb";
import Category from "@/app/models/Category";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB()
        const category = await Category.find({})

        if(category) return NextResponse.json(category,{status: 201});
        else return NextResponse.json({message: "Category not found"},{status: 404})
    }
    catch(error){
        return NextResponse.json({message: error.message},{status: 500});
    }
}
export async function POST(req){
    try{
        await connectDB()
        const body = await req.json()
        const {name} = body
        const categoryExist = await Category.find({name})

        const newCategory = new Category({name})
        await newCategory.save()

        if(categoryExist) return NextResponse.json({message: "Category already exist"},{status: 203})

        return NextResponse.json({message: "Category added successfully"},{status: 201})
    }
    catch(error){
        return NextResponse.json({message: error.message},{status: 500});
    }
}