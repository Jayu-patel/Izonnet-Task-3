import { connectDB } from "@/app/lib/mongodb";
import Category from "@/app/models/Category";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const query = Object.fromEntries(new URL(req.url).searchParams);
    const {brand, category, search, minPrice, maxPrice} = query
    const queryObj = {}
    
    if(search){

      const category = {name: {$regex: search, $options: 'i'}}
      const cat = await Category.find(category)

      if(cat.length > 0){
          queryObj.$or = [
              {name: {$regex: search, $options: 'i'}},
              {brand: {$regex: search, $options: 'i'}},
              {category: cat[0]._id}
          ]
      }
      else{
          queryObj.$or = [
              {name: {$regex: search, $options: 'i'}},
              {brand: {$regex: search, $options: 'i'}},
          ]
      }

  }
  if(brand) queryObj.brand = brand;
  if(category) queryObj.category = category;
  if(minPrice || maxPrice){
      queryObj.price = {};
      if(minPrice) queryObj.price.$gte = Number(minPrice)
      if(maxPrice) queryObj.price.$lte = Number(maxPrice)
  } 
    
    
    const product = await Product.find(queryObj).populate("category")
    return NextResponse.json(product, { status: 200 });
  } 
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json()
    const {name, price, brand, category, image, quantity, countInStock, description, imageList} = body
    if(!name || !price || !brand || !category || !image || !quantity || !countInStock){
      return NextResponse.json({msg: "please provide all data"}, { status: 400 });
    }
    const product = new Product({name,price, brand, category, image, quantity, countInStock, description, imageList})
    await product.save()

    return NextResponse.json(product, { status: 201 });
  } 
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}