'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios';
import { setCredentials } from '@/app/redux/slice/userSlice';
import { toast } from "react-toastify";

export default function UpdateProfile(){
  const router = useRouter();
  const dispatch = useDispatch()
  const {userInfo} = useSelector(state=>state.auth) || ""
  const [user, setUser] = useState(
    {   
        username: userInfo?.username, 
        email: userInfo?.email,
        number: userInfo?.number,
        address: userInfo?.address,
        city: userInfo?.city,
        state: userInfo?.state,
    });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    const {username, email, number, address, city, state} = user

    if(!email && !username) return toast.error("Please enter email and username", {position: "top-center"})
    if(!username) return toast.error("Please enter your username", {position: "top-center"})
    if(!email) return toast.error("Please enter your email", {position: "top-center"})
      
    if(username.includes(" ")) return toast.error("There should no blank space in your name", {position: "top-center"})
    if(email.includes(" ") || !emailRegex.test(email)) return toast.error("Please enter a valid email address.", {position: "top-center"})
    
    // axios.put(`http://localhost:8000/api/user/updateUser/${userInfo?._id}`, {
    axios.put(`/api/user/${userInfo?._id}`, {
        username,
        email,
        number,
        address,
        city,
        state,
    }).then(res=>{
        dispatch(setCredentials(res.data))
        toast.success("Profile updated!!", {position: "top-center"})
        router.back()
    }).catch(err=>{console.log(err)})
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">Update Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={user.username ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mobile NO.</label>
          <input
            type="number"
            name="number"
            value={user.number ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={user.address ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={user.city ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">State</label>
          <input
            type="text"
            name="state"
            value={user.state ?? ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
}