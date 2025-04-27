"use client"
import { addToCart } from '@/app/redux/slice/cartSlice';
import axios from 'axios';
import Loader from '../../components/Loader';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const Product = ({params}) => {
  const {productId} = React.use(params)
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState("")

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  
  useEffect(()=>{
    // axios.get(`http://localhost:8000/api/product/getProduct/${productId}`).then(res=>{
    axios.get(`/api/product/${productId}`).then(res=>{
      setProduct(res.data)
      setLoading(false)
      console.log(res.data)
    })
    .catch(err=>console.log(err))
  },[])

  useEffect(()=>{},[image])

  if(loading) return <Loader/>
  return (
    <div className="w-[100vw] medium:w-[95vw] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

         <div className="mx-auto">
          <img
            src={image || product.image}
            alt={product.name ?? ""}
            className="w-full max-w-md object-cover rounded-lg shadow-md"
          />
          <div className='flex justify-start mt-5 gap-5'>
            {
              product?.imageList?.map((e,i)=>{
                return(
                  <div key={i} className='w-[120px] medium:w-[80px] medium:h-[60px] h-[100px] cursor-pointer' onClick={()=>{setImage(e)}}>
                    <img src={e} alt="image" className='w-full h-full object-cover' />
                  </div>
                )
              })
            }
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name ?? ""} </h1>
          <p className="text-lg text-gray-600 mb-2">Brand: {product.brand ?? ""}</p>
          <p className="text-lg text-gray-600 mb-2">Category: {product?.category?.name ?? ""}</p>
          <p className="text-2xl font-semibold text-gray-800 mb-4">₹{product.price}</p>
          <p className={`text-md font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'} mb-4`}>
            {product.countInStock > 0 ? `In Stock (${product.countInStock ?? ""} available)` : 'Out of Stock'}
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 mb-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add to Cart
            </button>
          </div>

          <div className='w-[95%] mb-4'>
            {product.description ?? ""}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;
