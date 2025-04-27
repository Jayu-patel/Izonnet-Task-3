"use client"

import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

export default function CartCount(){
    const [isHydrated, setIsHydrated] = useState(false)
    const cart = useSelector((state) => state.cart);
    const {cartItems} = cart
    const itemCount = cartItems.length

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return <></>
    return (
        <div className="relative">
            <button className="relative flex items-center p-2 text-white">
                Cart
            </button>
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </div>
    )
}