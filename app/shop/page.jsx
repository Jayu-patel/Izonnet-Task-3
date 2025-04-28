'use client'
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/app/redux/slice/cartSlice';
import Loader from '../components/Loader'
import MenuIcon from '@mui/icons-material/Menu';

function page() {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [categories, setCategory] = useState([])
    const [categoryQuery, setCatQuery] = useState("");
    const [search, setSearch] = useState("")
    const [priceArrNum, setPriceArrNum] = useState(-1)
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [tabOpen, setTab] = useState("hidden")
    const [isHydrated, setIsHydrated] = useState(false)
    const dispatch = useDispatch();

    const priceArr = [
        [100,500], [501, 1000], [1001, 2000], [2001, 2500], [2501, 5000]
    ]

    const handleTab=()=>{
        tabOpen == "hidden" ? setTab("block") : setTab("hidden")
    }

    const handleCategory= (e) => {
        const newVal = e.target.value
        setCatQuery(prev=> (prev == newVal ? "" : newVal))
    };

    const handlePrice = (e)=>{
        const num = e.target.value
        setPriceArrNum(num)
        if(num == -1){
            setMinPrice("")
            setMaxPrice("")
            return
        }
        if(num > 4){
            setMinPrice(5001)
            setMaxPrice(99999999999)
            return
        }
        setMinPrice(priceArr[num][0])
        setMaxPrice(priceArr[num][1])
    }
    
    const fetchProducts=async()=>{
        // let query = `http://localhost:8000/api/product/getAllProducts?`;
        let query = `/api/product?`;

        if (search) query += `search=${search}&`;
        if (categoryQuery) query += `category=${categoryQuery}&`;
        if (minPrice) query += `minPrice=${minPrice}&`;
        if (maxPrice) query += `maxPrice=${maxPrice}&`;

        setLoading(true)
        axios.get(query).then(res=>{
            setProducts(res.data)
            setLoading(false)
        })
    }

    useEffect(()=>{fetchProducts(); console.log(categoryQuery)},[categoryQuery,minPrice,maxPrice])

    useEffect(()=>{
      fetchProducts()
    //   axios.get("http://localhost:8000/api/category/getCategory").then((res)=>{
      axios.get("/api/category").then((res)=>{
        setCategory(res.data)
      })
      .catch(err=> console.log(err))
    },[])
    
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return <></>
    return (
        <div className='flex w-screen'>
            <div className='w-[16%] h-screen fixed medium:hidden'>
                <div className='p-2'>
                    <span className='text-[1.2rem] font-extrabold'>Categories</span>
                    <div className='px-2'>
                                    <div className='my-[2px]'>
                                        <label>
                                            <input
                                                type="radio"
                                                value={""}
                                                name='options'
                                                onChange={handleCategory}
                                                checked={categoryQuery == ""}
                                            />
                                            <span className='ml-1'>
                                                All
                                            </span>
                                        </label>
                                    </div>
                        {
                            categories?.map((e,i)=>{
                                return(
                                    <div key={e._id} className='my-[2px]'>
                                        <label key={e._id}>
                                            <input
                                                type="radio"
                                                value={e._id}
                                                name='options'
                                                onChange={handleCategory}
                                                checked={categoryQuery == e._id}
                                            />
                                            <span className='ml-1'>
                                                {e.name}
                                            </span>
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='p-2'>
                    <h1 className='text-[1.2rem] font-extrabold'>Price</h1>
                    <div className='px-2'>
                    <div className='my-[4px]'>
                            <label>
                                <input
                                    type="radio"
                                    value={-1}
                                    name='options2'
                                    onChange={handlePrice}
                                    checked={priceArrNum == -1}
                                />
                                <span className='ml-1'>
                                    All
                                </span>
                            </label>
                        </div>
                        {
                            priceArr?.map((e,i)=>{
                                return(
                                    <div key={i} className='my-[4px]'>
                                        <label>
                                            <input
                                                type="radio"
                                                value={i}
                                                name='options2'
                                                onChange={handlePrice}
                                                checked={priceArrNum == i}
                                            />
                                            <span className='ml-1'>
                                                {e[0]} to {e[1]}
                                            </span>
                                        </label>
                                    </div>
                                )
                            })
                        }
                        <div className='my-[4px]'>
                            <label>
                                <input
                                    type="radio"
                                    value={5}
                                    name='options2'
                                    onChange={handlePrice}
                                    checked={priceArrNum == 5}
                                />
                                <span className='ml-1'>
                                    more than 5000
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            {
                loading ? <div className='w-[84%] ml-[16%]'><Loader/></div>
                : 
                <div className='w-[84%] ml-[16%] medium:w-full medium:ml-auto'>
                    <div className='pt-1 relative'>
                        <input
                            type="text"
                            id="textInput"
                            value={search}
                            placeholder="Type here..."
                            onChange={(e)=>{setSearch(e.target.value)}}
                            className="inp w-[400px] medium:w-auto my-2 p-2 ml-2 medium:ml-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button onClick={()=>{console.log(search); fetchProducts()}} className='px-3 py-2 ml-3 medium:ml-1 medium:text-[0.65rem] bg-blue-500 text-white rounded-lg'>Search</button>
                        <button className='absolute right-0 large:hidden' onClick={handleTab}>
                            <MenuIcon sx={{marginRight: "15px", marginTop: "15px"}}/>
                        </button>
                        <div className={`absolute w-[95%] h-[350px] bg-gray-300 left-[2.5%] shadow-lg flex gap-2 rounded-xl large:hidden ${tabOpen}`}>
                            <div className='flex-1 p-4'>
                                <h1 className='text-[1.2rem] font-extrabold'>Categories</h1>
                                    <div className='my-[2px]'>
                                        <label>
                                            <input
                                                type="radio"
                                                value={""}
                                                name='options3'
                                                onChange={handleCategory}
                                                checked={categoryQuery == ""}
                                            />
                                            <span className='ml-1'>
                                                All
                                            </span>
                                        </label>
                                    </div>
                                    {
                                        categories?.map((e,i)=>{
                                            return(
                                                <div key={e._id} className='my-[2px]'>
                                                    <label key={e._id}>
                                                        <input
                                                            type="radio"
                                                            value={e._id}
                                                            name='options3'
                                                            onChange={handleCategory}
                                                            checked={categoryQuery == e._id}
                                                        />
                                                        <span className='ml-1'>
                                                            {e.name}
                                                        </span>
                                                    </label>
                                                </div>
                                            )
                                        })
                                    }
                            </div>
                            <div className='flex-1 p-4'>
                            <h1 className='text-[1.2rem] font-extrabold'>Price</h1>
                            <div className='px-2'>
                            <div className='my-[4px]'>
                                    <label>
                                        <input
                                            type="radio"
                                            value={-1}
                                            name='options4'
                                            onChange={handlePrice}
                                            checked={priceArrNum == -1}
                                        />
                                        <span className='ml-1'>
                                            All
                                        </span>
                                    </label>
                                </div>
                                {
                                    priceArr?.map((e,i)=>{
                                        return(
                                            <div key={i} className='my-[4px]'>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value={i}
                                                        name='options4'
                                                        onChange={handlePrice}
                                                        checked={priceArrNum == i}
                                                    />
                                                    <span className='ml-1'>
                                                        {e[0]} to {e[1]}
                                                    </span>
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                                <div className='my-[4px]'>
                                    <label>
                                        <input
                                            type="radio"
                                            value={5}
                                            name='options2'
                                            onChange={handlePrice}
                                            checked={priceArrNum == 5}
                                        />
                                        <span className='ml-1'>
                                            more than 5000
                                        </span>
                                    </label>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-[95%] medium:mx-auto medium:w-[90%]">
                            {products?.map((product) => (
                            <div
                                key={product?._id}
                                className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <Link href={`/productList/${product._id}`} prefetch={false}>
                                <img
                                    src={product.image ?? ""}
                                    alt={product.name ?? ""}
                                    className="w-full h-48 medium:h-32 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    {product.name ?? ""}
                                    </h2>
                                    <p className="text-gray-600">Brand: {product.brand ?? ""}</p>
                                    <p className="text-gray-600">Category: {product.category.name ?? ""}</p>
                                    <p className="text-lg font-bold text-gray-800 mt-2">
                                    ₹{product.price ?? ""}
                                    </p>
                                    <p
                                    className={`text-sm font-medium mt-1 ${
                                        product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                    >
                                    {product.countInStock > 0
                                        ? `In Stock (${product.countInStock ?? ""})`
                                        : 'Out of Stock'}
                                    </p>
                                </div>
                                </Link>
                                <div className="p-4">
                                <button
                                    onClick={()=>{dispatch(addToCart({ ...product }));}}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                    disabled={product.countInStock === 0}
                                >
                                    Add to Cart
                                </button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default page
