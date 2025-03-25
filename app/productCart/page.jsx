"use client"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { removeFromCart, add, decrese } from "../redux/slice/cartSlice";
import { useRouter } from "next/navigation";

export default function ProductCart() {
  const cart = useSelector((state) => state.cart);
  const {userInfo} = useSelector(state => state?.auth) || ""
  const {cartItems} = cart
  const router = useRouter()
  const dispatch = useDispatch()

  const checkout=()=>{
    if(!userInfo){
      router.push("/login")
    }
    else{
      router.push("/checkout")
    }
  }
  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Shopping Cart</h1>
        <div className="bg-white shadow-xl rounded-lg p-6">
          {cartItems.length === 0 ? (
            <p className="text-lg text-gray-500">Your cart is empty.</p>
          ) : (
            <div>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Product</th>
                    <th className="py-3 px-6 text-center">Quantity</th>
                    <th className="py-3 px-6 text-center">Price</th>
                    <th className="py-3 px-6 text-center">Total</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
                  {cartItems?.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      {/* Product */}
                      <td className="py-4 px-6 flex items-center space-x-4">
                        <img
                          src={item.image ?? ""}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                        <div>
                          <h2 className="font-semibold text-gray-800">
                            {item.name ?? ""}
                          </h2>
                          <p className="text-gray-500 text-sm">
                            ₹{item.price.toFixed(2) ?? ""}
                          </p>
                        </div>
                      </td>
                      {/* Quantity */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={()=>{dispatch(decrese(item))}}
                            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100 border border-gray-200 text-gray-800 w-12 text-center">
                            {item.quantity ?? ""}
                          </span>
                          <button
                            onClick={()=>{dispatch(add(item))}}
                            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      {/* Price */}
                      <td className="py-4 px-6 text-center">₹{item.price ?? ""}</td>
                      {/* Total */}
                      <td className="py-4 px-6 text-center font-semibold">
                        ₹{(item.price * item.quantity) ?? ""}
                      </td>
                      {/* Remove Button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={()=>{dispatch(removeFromCart(item))}}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right mt-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Total: ₹{getTotalPrice().toFixed(2)}
                </h2>
                <button className="mt-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                        onClick={()=>{checkout()}}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}