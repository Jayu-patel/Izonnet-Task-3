"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GenerateOTP = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  const handleGenerateOTP = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    toast.loading("Generating OTP...");
    // axios.get(`http://localhost:8000/api/user/generateOtp/${email}`).then(res => {
    axios.get(`/api/user/otp?email=${email}`).then(res => {
      setLoading(false);
      toast.dismiss();
      
      if(res.status == 201){
        router.push(`/login/confirmOtp`)
        toast.success("OTP sent to your email!");
        localStorage.setItem("email", email)
      }
      else{
        toast.error(res.data.message);
      }
    })
    .catch(err=>{
      toast.error(err?.response?.data?.message)
  })
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Generate OTP
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleGenerateOTP}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 mt-4 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate OTP"}
        </button>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default GenerateOTP;
