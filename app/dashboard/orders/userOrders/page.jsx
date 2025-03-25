"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {loadStripe} from "@stripe/stripe-js"
import Link from 'next/link';
import { toast } from "react-toastify";
import Loader from "@/app/components/Loader";

export default function MyOrders() {
  const {userInfo} = useSelector(state=>state?.auth) || ""
  const [loading, setLoading] = useState(false)
  const [orderList, setOrderList] = useState([]);
  const [currentOrder, setCurrentOrder] = useState("")

  const handlePayment =async(payId,orderId) => {
    document.cookie = `paymentId=${payId}; path=/; max-age=${5 * 60}; SameSite=Strict;"`;
    document.cookie = `orderId=${orderId}; path=/; max-age=${5 * 60}; SameSite=Strict;"`;
    const stripe = await loadStripe("pk_test_51QqtgFFWZDwZ5XVYvXoNrRonDmGAsCF4boAiMQSL6iYXJjuEFqX3Y3fvl6AGNeReg9rMc2YnjUSYH9MYKlHGXYFO00mqgYE5BA")
    const result = stripe.redirectToCheckout({
      sessionId: payId
    })
    .catch(err=>console.log(err))
  };

  const makeNewOrder=async(order,payId,orderId)=>{

    const session = await fetch(`/api/stripe/${order.payId}`)
    const data = await session.json()
    
    if(data?.status == "open"){
      handlePayment(payId,orderId)
      return 
    }
    else{
      const {orderItems} = order
      document.cookie = `orderId=${orderId}; path=/; max-age=${5 * 60}; SameSite=Strict;"`;

      const stripe = await loadStripe("pk_test_51QqtgFFWZDwZ5XVYvXoNrRonDmGAsCF4boAiMQSL6iYXJjuEFqX3Y3fvl6AGNeReg9rMc2YnjUSYH9MYKlHGXYFO00mqgYE5BA")

      const body = {
        products: orderItems,
      }

      // axios.post(`http://localhost:8000/api/stripe/check-out`, body).then(res=>{
      axios.post(`/api/stripe`, body).then(res=>{
  
        const orderId = document.cookie.split("; ").find((row) => row.startsWith("orderId="))?.split("=")[1];
        // axios.put(`http://localhost:8000/api/order/setPaymentId/${orderId}`, {payId: res.data.id}).catch(err=>console.log(err))
        axios.put(`/api/order/payment?id=${orderId}}&paymentId=${res?.data?.id}`).catch(err=>console.log(err))
        const result = stripe.redirectToCheckout({
          sessionId: res.data.id
        })
        .catch(err=>{})

        document.cookie = `paymentId=${res.data?.id}; path=/; max-age=${5 * 60}; SameSite=Strict;"`;

        if(result.error){console.log(result.error)}
      })
      .catch(err=>{
        toast.error(err?.response?.data?.message)
      })
    }
  }

  useEffect(()=>{
    setLoading(true)
    axios.get(`/api/order/${userInfo?._id}`).then(res=>{
        setOrderList(res.data)
        setLoading(false)
    })
    .catch(err=>{
      toast.error(err?.response?.data?.message)
      setLoading(false)
    })
    console.log(userInfo._id)
  },[])

  if(loading) return <Loader/>;
  else{
    if(orderList.length <= 0){
      return(
        <div className="p-5">
          <div className="pb-4"><h1 className="text-[1.5rem] font-semibold">You haven't placed any orders yet. Start shopping now!</h1></div>
          <Link href="/" className="mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800" prefetch={false}>
            shop now
          </Link>
        </div>
      )
    }
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="space-y-4">
          {orderList?.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg shadow-lg bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order ID: {order._id ?? ""}</h2>
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full ${
                    order.isPaid ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {order.orderItems?.map((item, index) => (
                  <img
                      key={item.name}
                      src={item.image ?? ""}
                      alt={item.name ?? "Loading..."}
                      width={80}
                      height={80}
                      className="rounded-md border"
                  />
                ))}
              </div>
              
              <p className="mt-2 font-semibold">Total: ₹{order.total ?? ""}</p>
              {!order.isPaid && (
                <div>
                  <button
                    onClick={() => makeNewOrder(order,order.payId,order._id)}
                    className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}