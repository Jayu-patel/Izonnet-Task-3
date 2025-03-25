"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const email = localStorage.getItem("email")
  const router = useRouter();

  const handleUpdate = () => {
    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }
    // updatePass
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // axios.put(`http://localhost:8000/api/user/updatePass?email=${email}&password=${password}`).then(res=>{
    axios.put(`/api/user/password`,{email,password}).then(res=>{
      if(res.status == 201){
        toast.success("Password Updated successfully");
        router.push("/login");
      }
      else toast.error(res.data?.message);
    })
    .catch(err=>{toast.error(err?.response?.data?.message)})
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Update Password</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Enter your new password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New Password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError("");
          }}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
          placeholder="Confirm Password"
        />
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <button
          onClick={handleUpdate}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
