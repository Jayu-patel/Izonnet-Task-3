"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setCredentials } from "../redux/slice/userSlice";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    if(!email && !password && !name) return setError("Please fill all fields")
    if(!email) return setError("Please enter your email")
    if(!name) return setError("Please enter your name")
    if(!password) return setError("Please enter your password")

    if(name.includes(" ")) return setError("There should no blank space in your name")
    if(email.includes(" ") || !emailRegex.test(email)) return setError("Please enter a valid email address.")
    if(password.includes(" ") || password.length < 5) return setError("Password must be at least 5 characters long.")

    setLoading(true)
    // axios.post("http://localhost:8000/api/user/register",{
    axios.post("/api/user/register",{
      username: name,
      email,
      password
    }).then((res)=>{
      if(res.status !== 201){
        toast.error(res.data.message)
        return setError(res.data.message);
      }
      else{
        toast.success("Profile created successfully!")
        dispatch(setCredentials(res.data));

        setEmail("");
        setPassword("");
        setName("")
        setError("")
        router.push("/dashboard/profile")
      }
      setLoading(false)
    }).catch(err=>{
      if(err?.response?.data?.message){
        toast.error(err?.response?.data?.message)
        setError(err?.response?.data?.message);
        setLoading(false)
      }
    })
  };

  return (
    <div className="grid place-items-center h-[calc(100vh-64px)]">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <div className="flex flex-col gap-3">
          <input
            className="inp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
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
              Register
            </button>
          }

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right" href={"/login"} prefetch={false}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}