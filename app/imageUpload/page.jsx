"use client"

import axios from "axios"
import { useEffect, useState } from "react"

export default function ImageUpload(){
    const [image, setImage] = useState(null)
    const [data, setData] = useState({})
    const upload=(e)=>{
        const formData = new FormData()
        formData.append("image", e.target.files[0])

        axios.post("/api/image_upload", formData).then(res=>{
            if(res.data?.success){
                setData(res.data)
                setImage(res.data?.imageData?.url)
            }
        })
    }
    useEffect(()=>{
        console.log(data)
    },[image,data])
    return (
        <div>
            <div>
                <label htmlFor="image">Select your image</label>
                <input type="file" accept="image/*" name="image" onChange={upload} />
                <img src={image} alt="error" className="w-[80vw]" />
            </div>
        </div>
    )
}