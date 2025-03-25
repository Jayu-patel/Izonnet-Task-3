"use client"
import { logout } from "@/app/redux/slice/userSlice"
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux"
import {decode} from "jsonwebtoken"
import { useEffect, useState } from "react";
import { resetCart } from "@/app/redux/slice/cartSlice";
import Cookies from "js-cookie";
import axios from "axios";

export default function Profile(){
    const {userInfo} = useSelector(state=>state?.auth) || ""
    const dispatch = useDispatch()
    const router = useRouter();
    const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("jwtAdmin="))?.split("=")[1];
    const [loading, setLoading] = useState(false)

    const logoutFun = ()=>{
        setLoading(true)
        axios.delete("/api/user/logout")
        .then(()=>{
            dispatch(resetCart())
            dispatch(logout())
        })
        .then(()=> setLoading(false))
        .catch(e=>console.log(e))
        router.push("/")
    }
    useEffect(()=>{},[userInfo?.username])
    return(
        <div className="p-4">
            <h1 className="text-[2rem]">Welcome {userInfo?.username ?? ""}</h1>

            <div className="w-[80%] ml-5">
                <h1 className="mt-3">Email Address</h1>
                <input
                    type="text"
                    value={userInfo?.email ?? ""}
                    className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    disabled
                />
                <h1>Username</h1>
                <input
                    type="text"
                    value={userInfo?.username ?? ""}
                    className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    disabled
                />

                { userInfo?.number ? <>
                        <h1>Mobile No.</h1>
                        <input
                            type="text"
                            value={userInfo?.number ?? ""}
                            className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            disabled
                        /> </> : <></>
                }

                { userInfo?.address ? <>
                        <h1>Address</h1>
                        <input
                            type="text"
                            value={userInfo?.address ?? ""}
                            className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            disabled
                        /> </> : <></>
                }

                { userInfo?.city ? <>
                        <h1>city</h1>
                        <input
                            type="text"
                            value={userInfo?.city ?? ""}
                            className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            disabled
                        /> </> : <></>
                }

                { userInfo?.state ? <>
                        <h1>city</h1>
                        <input
                            type="text"
                            value={userInfo?.state ?? ""}
                            className="mt-1 mb-5 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                            disabled
                        /> </> : <></>
                }

                <div className="mt-5">
                    <button className="bg-black text-white px-4 py-2 rounded-lg mr-2" onClick={()=>{router.push("/dashboard/profile/updateProfile")}}>Update Account</button>
                    
                    {
                        loading ?
                            <button disabled className="bg-red-600 text-white px-4 py-2 rounded-lg">Loging Out...</button> :
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={logoutFun}>Log out</button>
                    }
                </div>
            </div>
        </div>
    )
}