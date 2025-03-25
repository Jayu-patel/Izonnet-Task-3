"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSelector } from "react-redux"

export default function LoginButton(){
    const {userInfo} = useSelector(s=> s?.auth) || ""
    
    useEffect(()=>{},[userInfo?._id])
    return (
        (!userInfo) ?(
        <Link className="px-4" href={'/login'} prefetch={false}>
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Login
            </button>
        </Link>)
        :(<Link className="px-4" href={'/dashboard/profile'} prefetch={false}>
              <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                Profile
              </button>
        </Link>)
    )
}