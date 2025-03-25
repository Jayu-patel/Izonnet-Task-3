'use client'
import axios from 'axios';
import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function PaymentSuccessful() {
  let orderId
  let paymentId
  if (typeof window !== "undefined"){
    orderId = document.cookie.split("; ").find((row) => row.startsWith("orderId="))?.split("=")[1];
    paymentId = document.cookie.split("; ").find((row) => row.startsWith("paymentId="))?.split("=")[1];
  }
  useEffect(()=>{
    console.log(orderId,paymentId)
    if(paymentId){
      // axios.get(`http://localhost:8000/api/stripe/verify-payment/${paymentId}`).then(res=>{
      axios.post(`/api/stripe/${paymentId}`).then(res=>{
        if(res.data.status == "paid"){
          alert(orderId)
          axios.post(`/api/order/payment`,{id: orderId}).then(res=>{
            if(res.status == 201){
              if (typeof window !== "undefined"){
               document.cookie = "orderId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
               document.cookie = "paymentId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
              }
            }
          })
          .catch(err=>{toast.error(err?.response?.data?.message)})
        }
      })
      .catch(err=>console.log(err))
    }
  },[orderId,paymentId])
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-green-100">
      <CheckCircleIcon className="text-green-600 w-24 h-24" />
      <h1 className="text-3xl font-bold text-green-700 mt-4">Payment Successful!</h1>
      <p className="text-lg text-green-800 mt-2">Thank you for your purchase.</p>
      <Link href="/" className="mt-6 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800" prefetch={false}>
        Go to Homepage
      </Link>
    </div>
  );
}