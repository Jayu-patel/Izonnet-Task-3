"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Loader3 from "@/app/components/Loader3";

export default function ProductUpdate({params}){
    const [image, setImage] = useState('/click-here-button.webp')
    const [cat, setCat] = useState("")
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        image: "",
        price: 0,
        countInStock: 0,
        quantity: 0,
        category: "",
        description: "",
    })
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [imageArr, setImageArr] = useState([])
    const router = useRouter();
    const { id } = React.use(params);
    
    const upload=(e)=>{
        e.preventDefault()
        setLoading(true)
        const form_data = new FormData()
        form_data.append("image", e.target.files[0])

        axios.post("/api/image_upload", form_data).then(res=>{
            if(res.data?.success){
                const img = res.data?.imageData?.url
                setImage(res.data?.imageData?.url)
                setProduct(prev=>({...prev, image: img}))
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
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit=()=>{
        const {name, brand, image, price, countInStock, quantity, description} = product
        // return console.log(product)
        if(!name || !brand || !image || !price || !countInStock || !quantity) toast.error("Please provide all data", {position: "top-center"})
        
        // axios.put(`http://localhost:8000/api/product/updateProduct/${id}`, {
        axios.put(`/api/product/${id}`, {
            name,
            brand,
            image,
            price,
            countInStock,
            quantity,
            category: cat,
            description,
            imageList: imageArr
        }).then(res=>{
            toast.success("Product updated!!", {position: "top-center"})
            router.refresh()
        })
    }

    useEffect(() => {
        // axios.get(`http://localhost:8000/api/product/getProduct/${id}`).then(res=>{
        axios.get(`/api/product/${id}`).then(res=>{
            const {name, brand, image, category, price, countInStock, quantity, description, imageList} = res.data
            setProduct({
                name,
                brand,
                image,
                price,
                countInStock,
                quantity,
                description,
            })

            setImageArr(imageList)
            setImage(image)
            setCat(category?._id)
            console.log(category?._id)
        })
        .catch(err=>console.log(err))
      }, [id]);

    useEffect(()=>{
        console.log("updated")
    },[image])

    return(
        <div>
            <div className="w-full py-4">
                <h1 className="text-center text-[1.5rem] font-bold">Edit Product</h1>
            </div>
            <div className="flex h-screen medium:flex-col medium:my-2">
                <div className="flex-[2] w-full h-full">
                    <div className="w-[95%] mt-5 bg-white mx-auto relative">
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
                                            <div key={i} className='w-[120px] h-[100px] cursor-pointer mx-2 relative' >
                                                <input
                                                    className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                                                    type="file" 
                                                    accept="image/*" 
                                                    name="image" 
                                                    onChange={e=> {changeImage(e,i)}}
                                                />
                                                <img src={e} alt="image" className='w-full h-full object-cover' />
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                                <div>
                                    {
                                        imageArr.length < 3 ?
                                        <div className="flex flex-col ml-3">
                                            <div 
                                                className="w-[90px] h-[100px] cursor-pointer mx-2 relative border-black border-[1px] text-center grid place-items-center">
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
                                value={product.name ?? ""}
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
                                value={product.price ?? ""}
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
                                value={product.brand ?? ""}
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
                                value={product.quantity ?? ""}
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
                                value={product.countInStock ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col py-3">
                            <label htmlFor="description">Description</label>
                            <textarea 
                                className="border bg-white p-2 rounded-md w-[70%]" 
                                name="description" 
                                id="description"
                                placeholder="Enter product description"
                                value={product.description ?? ""}
                                onChange={handleChange}
                                
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="mt-4 py-2 px-4 medium:mb-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            Update Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}