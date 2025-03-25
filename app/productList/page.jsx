"use client"
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/app/redux/slice/cartSlice';
import Loader from '../components/Loader';

const ProductList = () => {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  useEffect(()=>{
    // axios.get("http://localhost:8000/api/product/getAllProducts").then((res)=>{
      setLoading(true)
    axios.get("/api/product").then((res)=>{
      const productData = res?.data
      productData.sort(() => Math.random() - 0.5)
      setProducts(productData)
      setLoading(false)
    })
  },[])

  if(loading) return <Loader/>
  return (
    products ?
    (<div className="w-[90vw] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Our Store</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products?.map((product) => (
          <div
            key={product?._id}
            className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/productList/${product._id}`} prefetch={false}>
              <img
                src={product.image ?? ""}
                alt={product.name ?? ""}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name ?? ""}
                </h2>
                <p className="text-gray-600">Brand: {product.brand ?? ""}</p>
                <p className="text-gray-600">Category: {product.category.name ?? ""}</p>
                <p className="text-lg font-bold text-gray-800 mt-2">
                  ₹{product.price ?? ""}
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.countInStock > 0
                    ? `In Stock (${product.countInStock ?? ""})`
                    : 'Out of Stock'}
                </p>
              </div>
            </Link>
            <div className="p-4">
              <button
                onClick={()=>{dispatch(addToCart({ ...product }));}}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={product.countInStock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>)
    : 
    <div>Loading..</div>
  )
};

export default ProductList;
