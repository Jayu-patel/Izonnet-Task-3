"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setCredentials } from "../redux/slice/userSlice";

export default function LoginForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const router = useRouter();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async () => {
        if(!email && !password) return setError("Please enter email and password")
        if(!email) return setError("Please enter your email")
        if(!password) return setError("Please enter your password")

        if(email.includes(" ") || !emailRegex.test(email)) return setError("Please enter a valid email address.")
        if(password.includes(" ") || password.length < 5) return setError("Password must be at least 5 characters long.")
        
        try{
          setLoading(true)
          // axios.post("http://localhost:8000/api/user/login",{
          axios.post("/api/user/login",{
            email,
            password
          }).then((res)=>{
            if(res.status !== 201){
              setError(res.data.message);
            }
            else{
              dispatch(setCredentials(res.data));
              
              setEmail("");
              setPassword("");
              setError("")
              router.push("/dashboard/profile")
            }
            setLoading(false)
          }).catch((err) =>{
            if(err?.response?.data?.message){
              setError(err?.response?.data?.message);
              setLoading(false)
            }
          })
        }
        catch(error){
          if (error.response) {
            // console.error(`Request failed with status: ${error.response.status}`);
          } else {
            // console.error('Network error:', error.message);
          }
        }
      };
    
    return(
    <div className="grid place-items-center h-[calc(100vh-64px)] medium:block medium:mt-12">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400 medium:w-[90%] mx-auto">
        <h1 className="text-xl font-bold my-4">Login</h1>

        <div className="flex flex-col gap-3">
          <input
            className="inp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            className="inp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          {
            loading ?
            <button disabled className="bg-green-700 text-white font-bold cursor-pointer px-6 py-2">
              Loading...
            </button> :
            <button onClick={handleSubmit} className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
              Login
            </button>
          }
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <span className="flex justify-between"> 
            <Link className="text-sm mt-3" href={"/login/generateOtp"} prefetch={false}>
              Forgot password ? <span className="underline">Recover</span>
            </Link>

            <Link className="text-sm mt-3" href={"/register"} prefetch={false}>
              Don't have an account? <span className="underline">Register</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
)}