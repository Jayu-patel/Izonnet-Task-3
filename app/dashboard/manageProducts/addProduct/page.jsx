"use client"

import LoadingOverlay from "@/app/components/Loader2"
import Loader3 from "@/app/components/Loader3"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function AddProduct(){
    const [image, setImage] = useState('/click-here-button.webp')
    const [categories, setCat] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        brand: "",
        category: "",
        image: "",
        quantity: "",
        countInStock: "",
        description: "",
    })
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [imageArr, setImageArr] = useState([])
    
    const upload=(e)=>{
        e.preventDefault()
        setLoading(true)
        const form_data = new FormData()
        form_data.append("image", e.target.files[0])

        axios.post("/api/image_upload", form_data).then(res=>{
            if(res.data?.success){
                const img = res.data?.imageData?.url
                setImage(res.data?.imageData?.url)
                setFormData(prev=>({...prev, image: img}))
            }
        }).then(()=>{
            setLoading(false)
        })
    }

    const addImage=(e)=>{
        e.preventDefault()
        setLoading2(true)
        const form_data = new FormData()
        form_data.append("image", e.target.files[0])

        axios.post("/api/image_upload", form_data).then(res=>{
            if(res.data?.success){
                const img = res.data?.imageData?.url
                setImageArr(prev => [...prev, img])
            }
        }).then(()=>{
            setLoading2(false)
        })
    }

    const changeImage=(e,i)=>{
        e.preventDefault()
        setLoading2(true)
        const form_data = new FormData()
        form_data.append("image", e.target.files[0])

        axios.post("/api/image_upload", form_data).then(res=>{
            if(res.data?.success){
                const img = res.data?.imageData?.url
                setImageArr(prev =>{
                    const newArr = [...prev]
                    newArr[i] = img
                    return newArr
                } 
            )}
        }).then(()=>{
            setLoading2(false)
        })
    }

    useEffect(()=>{},[imageArr.length])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit=()=>{
        const {name, brand, price, image, category, countInStock, quantity, description} = formData

        if(!name) return toast.error(`Please enter product name`,{position: "top-center"})
        if(!price) return toast.error(`Please enter price`,{position: "top-center"})
        if(!brand) return toast.error(`Please enter brand`,{position: "top-center"})
        if(!category) return toast.error(`Please enter category`,{position: "top-center"})
        if(!quantity) return toast.error(`Please enter quantity`,{position: "top-center"})
        if(!countInStock) return toast.error(`Please enter countInStock`,{position: "top-center"})
        if(!image || image == "/click-here-button.webp") return toast.error(`Please enter Image`,{position: "top-center"})
        
        console.log(formData)
        // axios.post("http://localhost:8000/api/product/addProduct",{
        axios.post("/api/product",{
            ...formData, imageList: imageArr
          }
        ).then((res)=>{
            if(res.status !== 201){
              return setError(res.data.message);
            }
            else{
              setFormData({
                name: "",
                price: "",
                brand: "",
                category: "",
                quantity: "",
                countInStock: "",
                description: ""
              })
              setImageArr([])
              setImage("/click-here-button.webp")
              toast.success(`Product added successfully`,{
                    position: "top-center"
              })
            }
        })
    }

    useEffect(()=>{
        // axios.get("http://localhost:8000/api/category/getCategory").then((res)=>{
        axios.get("/api/category").then((res)=>{
            setCat(res.data)
        })
        .catch(err=>console.log(err))
    },[])

    useEffect(()=>{
        console.log("updated")
    },[image])

    // if(loading) {return  <LoadingOverlay/>}
    return(
        <div>
            <div className="w-full py-4">
                <h1 className="text-center text-[1.5rem] font-bold">Add Product</h1>
            </div>
            <div className="flex h-screen medium:flex-col medium:my-2">
                <div className="flex-[2] w-full h-full">
                    <div className="w-[95%] mt-1 bg-white mx-auto relative">
                        <input
                            className="absolute z-[5] w-full h-full opacity-0 cursor-pointer"
                            type="file" 
                            accept="image/*" 
                            name="image" 
                            onChange={upload}
                        />
                        {
                            loading ? 
                            <div className="h-[330px]">
                                <Loader3/> 
                            </div> 
                            :
                            <img src={image} alt="loading..." className="border-black border-[2px]" />
                        }
                    </div>
                    <h3 className="p-3 text-[1.3rem]">Click on above box to select image</h3>

                    {
                        image == '/click-here-button.webp' ?
                        <></> :
                        <div>
                            <h1 className="text-[1.2rem] font-semibold ml-2 my-2">Add more Images</h1>
                            <div className="flex">
                                <div className="flex">
                                    {
                                        imageArr?.map((e,i)=>{
                                            return(
                                            <div key={i} className='w-[120px] h-[100px] cursor-pointer mx-2 relative'>
                                                <input
                                                    className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                                                    type="file" 
                                                    accept="image/*" 
                                                    name="image" 
                                                    onChange={e=> {changeImage(e,i)}}
                                                />
                                                <img src={e} alt="loading..." className='w-full h-full object-cover' />
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                {
                                    imageArr.length < 3 ?
                                    <div className="flex flex-row ml-3">
                                        <div 
                                            className="w-[100px] h-[120px] cursor-pointer mx-2 relative border-black border-[1px] text-center grid place-items-center">
                                            <input className="absolute w-full h-full opacity-0 cursor-pointer" type="file" accept="image/*" name="addImage" onChange={addImage} />
                                            {
                                                loading2 ?
                                                <Loader3/> :
                                                <AddCircleIcon fontSize="large" color="action"/> 
                                            }
                                        </div>
                                    </div>
                                    : <></>
                                }
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="flex-[3] w-full h-full">
                    <div className="ml-5 mt-5">
                        <div className="flex flex-col">
                            <label htmlFor="name">Product name</label>
                            <input 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                type="text" 
                                name="name" 
                                id="name" 
                                placeholder="Enter product name"
                                value={formData.name ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col py-3">
                            <label htmlFor="price">Price</label>
                            <input 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                type="number" 
                                name="price" 
                                id="price"
                                placeholder="Enter price"
                                min={"1"}
                                value={formData.price ?? ""}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="flex flex-col py-3">
                            <label htmlFor="brand">Brand</label>
                            <input 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                type="text" 
                                name="brand" 
                                id="bran"
                                placeholder="Enter product name"
                                value={formData.brand ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col py-3">
                            <label htmlFor="quantity">Quantity</label>
                            <input 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                type="number" 
                                name="quantity" 
                                id="quantity"
                                placeholder="Enter product name"
                                min={"1"}
                                value={formData.quantity ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col py-3">
                            <label htmlFor="countInStock">CountInStock</label>
                            <input 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                type="number" 
                                name="countInStock" 
                                id="countInStock"
                                placeholder="Enter product name"
                                min={"1"}
                                value={formData.countInStock ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                            >
                                Category
                            </label>
                            <select 
                                name="category" 
                                id="category"
                                onChange={handleChange}
                                className="block bg-white w-[70%] rounded-md p-2 border"
                                value={formData.category ?? ""}
                            >

                            <option value="">-- Select an option --</option>
                            {
                                categories?.map(e=>{
                                return(
                                    <option value={e._id} key={e._id}>{e.name}</option>
                                )
                                })
                            }
                            </select>
                        </div>

                        <div className="flex flex-col py-3">
                            <label htmlFor="description">Description</label>
                            <textarea 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                name="description" 
                                id="description"
                                placeholder="Enter product description"
                                value={formData.description ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="mt-4 py-2 px-4 medium:mb-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}