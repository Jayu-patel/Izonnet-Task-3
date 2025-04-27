'use client'
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {loadStripe} from "@stripe/stripe-js"
import axios from "axios";
import { clearCartItems } from "../redux/slice/cartSlice";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function Checkout() {
  const {userInfo} = useSelector(s=> s?.auth)
  const cart = useSelector((state) => state.cart);
  const {cartItems} = cart
  const dispatch = useDispatch()
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: userInfo?.email || "",
    fullName: userInfo?.username || "", 
    mobile: userInfo?.number ||  "",
    address: userInfo?.address ||  "",
    city: userInfo?.city || "",
    state: userInfo?.state || "",
    zip: "",
    country: "India"
  });

  const [loading, setLoading] = useState(false)

  const makePayment = async()=>{
    setLoading(true)
    const stripe = await loadStripe("pk_test_51QqtgFFWZDwZ5XVYvXoNrRonDmGAsCF4boAiMQSL6iYXJjuEFqX3Y3fvl6AGNeReg9rMc2YnjUSYH9MYKlHGXYFO00mqgYE5BA")

    const body = {
      products: cartItems,
    }

    // axios.post(`http://localhost:8000/api/stripe/check-out`, body).then(res=>{
    axios.post(`/api/stripe`, body).then(res=>{
      let orderId
      if (typeof window !== "undefined"){
        orderId = document.cookie.split("; ").find((row) => row.startsWith("orderId="))?.split("=")[1];
      }
      // axios.put(`http://localhost:8000/api/order/setPaymentId/${orderId}`, {
      axios.put(`/api/order/payment?id=${orderId}&paymentId=${res?.data?.id}`).catch(err=>console.log(""))

      const result = stripe.redirectToCheckout({
        sessionId: res.data.id
      })

      setLoading(false)
      dispatch(clearCartItems())
      if (typeof window !== "undefined"){
        document.cookie = `paymentId=${res.data?.id}; path=/; max-age=${5 * 60}; SameSite=Strict;"`;
      }

      if(result.error){console.log(result.error)}
    })
    .catch(err=>{
      toast.error(err?.response?.data?.message)
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = () => {
    const {email, fullName, mobile, address, city, state, zip} = formData
    
    if(!email){ return toast.error("Enter your email") }
    if(email.includes(" ") || !emailRegex.test(email)) {return toast.error("Please enter a valid email address.")}
    if(mobile.length < 10 || mobile.length > 10){ return toast.error("Enter valid mobile number")}
    if(!zip){ return toast.error("Enter zip code")}
    if(zip.length < 6 || zip.length > 6){ return toast.error("Enter valid zip code")}
    if(!fullName){ return toast.error("Enter your name")}
    if(!address){ return toast.error("Enter your address")}
    if(!city){ return toast.error("Enter your city")}
    if(!state){ return toast.error("Enter your state")}

    createOrder()
    makePayment()
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const createOrder=async()=>{
    const {address, city, state, zip} = formData
    axios.post(`api/order`,{
      userId: userInfo?._id,
      orderItems: cartItems,
      address,
      city,
      state,
      zip,
      total: getTotalPrice()
    }).then(res => {
      if (typeof window !== "undefined"){
        document.cookie = `orderId=${res?.data?._id}; path=/; max-age=${5 * 60}; SameSite=Strict;"`;
      }
    })
    .catch(err=>{
      toast.error(err?.response?.data?.message)
    })
  }

  useEffect(()=>{
    if(cartItems.length <=0 ){
      router.push("/")
    }
  },[])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg flex gap-6 medium:flex-col-reverse">

      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-4 medium:text-3xl">Checkout</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shipping Details</h3>
          
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded-md" required />
          <input type="number" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full p-2 border rounded-md" required />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded-md" required />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded-md" required />
          
          <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded-md" required>
            <option value="">Select State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <input type="number" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" className="w-full p-2 border rounded-md" required />
          
          <input type="text" name="country" value={formData.country} readOnly className="w-full p-2 border rounded-md bg-gray-100" />
          
          <button onClick={handleSubmit} className="w-full p-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
            {
              loading ? "processing..." : "Place Order"
            }
          </button>
        </div>
      </div>
      
      <div className="w-1/3 p-4 border rounded-md h-96 overflow-y-auto medium:w-full medium:h-auto">
        <h3 className="text-xl font-semibold mb-2">Cart Summary</h3>
        <h2 className="text-lg font-semibold mb-2">Total: ₹{getTotalPrice().toFixed(2)}</h2>
        {
          cartItems?.map((item,id)=>{
            return(
              <div key={id} className="p-3">
                <p className="font-bold">{item.name}</p>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}
