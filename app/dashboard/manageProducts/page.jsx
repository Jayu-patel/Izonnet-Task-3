"use client"
import ConfirmationPopup from "@/app/components/Pop-up";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from '../../components/Loader';

export default function ManageProducts(){
  const [products, setProducts] = useState([])
  const [uId, setUid] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  const handleConfirm=()=>{
    // axios.delete(`http://localhost:8000/api/product/deleteProduct/${uId}`).then((res)=>{
    axios.delete(`/api/product/${uId}`).then((res)=>{
        setUid("")
        setShowPopup(false);
      })
      .catch(err=>console.log(err))
    }

  const handleCancle=()=>{
    setUid("")
    setShowPopup(false);
  }

  const delProduct=(id)=>{
    setUid(id)
    setShowPopup(true)
  }

  useEffect(()=>{
    // axios.get("http://localhost:8000/api/product/getAllProducts").then((res)=>{
    axios.get("/api/product").then((res)=>{
      setProducts(res.data)
      setLoading(false)
    })
  },[uId])

  if(loading) return <Loader/>
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Products</h1>
      <div className="flex flex-row-reverse pb-3">
        <Link href={"/dashboard/manageProducts/addProduct"} className="px-3 py-2 rounded-md bg-green-500 text-white" prefetch={false}>Add Product</Link>
      </div>
      <ConfirmationPopup showPopup={showPopup} setShowPopup={setShowPopup} handleConfirm={handleConfirm} handleCancel={handleCancle}/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div
            key={product?._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center"
          >
            {/* Product Image */}
            <img
              src={product?.image ?? ""}
              alt={product?.name ?? ""}
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />

            <h2 className="text-lg font-semibold text-gray-800">{product?.name ?? ""}</h2>

            <p className="text-gray-600 font-medium text-sm mt-2">${product?.price ?? ""}</p>
 
             <div className="mt-4 flex space-x-4">
              <button
                onClick={() => {router.push(`/dashboard/manageProducts/${product?._id}`)}}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={()=>{delProduct(product._id)}}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};