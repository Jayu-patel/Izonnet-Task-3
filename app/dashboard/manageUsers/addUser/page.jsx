"use client"
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AddUser(){
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPass: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoad] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = () => {
        const {username, email, password, confirmPass} = formData
        if(!username && !email && !password) return setError("Please fill all fields")
        if(!username) return setError("Please enter username")
        if(!email) return setError("Please enter email")
        if(!password) return setError("Please enter password")
        if(!confirmPass) return setError("Please confirm password")

        if(username.includes(" ")) return setError("There should no blank space in username")
        if(email.includes(" ") || !emailRegex.test(email)) return setError("Please enter a valid email address.")
        if(password.includes(" ") || password.length < 5) return setError("Password must be at least 5 characters long.")
        
        if(password != confirmPass) return setError("Confirm password should same as password.")

        console.log(formData)
        setLoad(true)
        // axios.post("http://localhost:8000/api/user/adminRegister",{
        axios.post("/api/user/addUser",{
            username,
            email,
            password
          }).then((res)=>{
            if(res.status !== 201){
                setLoad(false)
                return setError(res.data.message);
            }
            else{
              setFormData({
                username: "",
                email: "",
                password: "",
                confirmPass: ""
              })
              toast.success(`User added successfully`,{
                    position: "top-center"
                })
              setError("")
            }
            setLoad(false)
        })
        .catch(err=>{
            setLoad(false)
            toast.error(err?.response?.data?.message)
        })
    }
    return(
        <div className="flex items-center justify-center w-full h-screen mt-[-64px] bg-gray-100 medium:block medium:mt-0">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg medium:max-w-[calc(100vw-56px)] medium:h-screen">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Add User</h2>
                <div className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username ?? ""}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email ?? ""}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password ?? ""}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPass"
                            name="confirmPass"
                            value={formData.confirmPass ?? ""}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        {loading ? "Loading..." : "Add User"}
                    </button>
                </div>
            </div>
            </div>
    )
}