"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation";

export default function LoginButton(){
    const {userInfo} = useSelector(s=> s?.auth)
    const [isHydrated, setIsHydrated] = useState(false)
    const router = useRouter()

    const handleClick=()=>{
        if(!userInfo){
            router.push('/login')
        }
        else{
            router.push('/dashboard/profile')
        }
    }
    
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">Loading..</button>
    return (
        // <div>
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={handleClick}>
                {userInfo ? 'Profile': 'Login'}
            </button>
        // </div>
    )
}