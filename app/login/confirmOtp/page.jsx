"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function ConfirmOtp() {
  const email = localStorage.getItem("email")
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    };
    setLoading(true)
    // axios.get(`http://localhost:8000/api/user/verifyOtp?otp=${otp}&email=${email}`).then(res=>{
    axios.post(`/api/user/otp`,{email,otp}).then(res=>{
      if(res?.status == 201){
        toast.success("OTP Verified successfully");
        router.push("/login/forgotPass");
      }
      else toast.error(res?.data?.message);

      setLoading(false)
    })
    .catch(err=>{
      toast.error(err?.response?.data?.message)
      setLoading(false)
    })
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Confirm OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Enter the 6-digit code sent to your email</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            // setError("");
          }}
          maxLength={6}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
          placeholder="Enter OTP"
        />
        {/* {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>} */}
        <button
          onClick={handleConfirm}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          { loading ? "Loading..." : "Confirm OTP"}
        </button>
      </div>
    </div>
  );
}
