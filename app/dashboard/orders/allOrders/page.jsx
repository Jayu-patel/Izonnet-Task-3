"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "@/app/components/Loader";

export default function AllOrders() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(()=>{
    setLoading(true)
    axios.get(`/api/order`).then(res=>{
      setOrderList(res.data)
      setLoading(false)
    })
    .catch(err=>{
      console.log(err?.response?.data?.message)
      setLoading(false)
    })
  },[])
  if(loading) return <Loader/>
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="space-y-4">
        {orderList?.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-lg shadow-lg bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">User: {order.user?.username ?? ""}</h2>
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
            <p className="mt-2 font-semibold">Total: {order.total ?? ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}