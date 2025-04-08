"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react";

export default function NavbarDashboard(){
    const { userInfo } = useSelector((state) => state.auth) || ""
    const pathname = usePathname()
    const [linkCss, setLinkCss] = useState('medium:hidden')
    const [sliderWid, setSliderWid] = useState("medium:w-14")
    const [isHydrated, setIsHydrated] = useState(false)

    const slide=()=>{
        linkCss == "medium:hidden" ? setLinkCss("medium:block") : setLinkCss("medium:hidden");
        sliderWid == "medium:w-14" ? setSliderWid("medium:w-30") : setSliderWid("medium:w-14");
    }
    const adminNavLinks = [
        {name: "Profile", href: "/dashboard/profile", icon: <AccountBoxIcon sx={{marginRight: "10px"}}/>},
        {name: "Manage Users", href: "/dashboard/manageUsers", icon: <PeopleAltIcon sx={{marginRight: "10px"}}/>},
        {name: "Manage Products", href: "/dashboard/manageProducts", icon: <ProductionQuantityLimitsIcon sx={{marginRight: "10px"}}/>},
        {name: "Orders", href: "/dashboard/orders/allOrders", icon: <BorderColorIcon sx={{marginRight: "10px"}}/>},
    ]
    const userNavLinks = [
        {name: "Profile", href: "/dashboard/profile", icon: <AccountBoxIcon sx={{marginRight: "10px"}}/>},
        {name: "My orders", href: "/dashboard/orders/userOrders", icon: <BorderColorIcon sx={{marginRight: "10px"}}/>},
    ]

    useEffect(()=>{},[sliderWid])
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return <></>
    return(
        userInfo?.isAdmin ?
        <div className={`large:w-64 ${sliderWid} h-screen fixed bg-blue-600 text-white flex flex-col z-50`}>
            <div className="p-4 font-bold text-xl"> 
                <span className="flex">
                    <MenuIcon className="block large:hidden" sx={{marginRight: "10px"}} onClick={slide}/> 
                    <span className={`block ${linkCss}`}>Dashboard</span>
                </span>
            </div>
            <div className="flex-1 flex flex-col transition-all">
                {
                    adminNavLinks.map((link,id)=>{
                        const isActive = pathname.includes(link.href)
                        return(
                                <Link 
                                    key={id}
                                    href={link.href} 
                                    className={isActive ? "p-4 font-bold text-[1.05rem] hover:bg-blue-500 cursor-pointer underline" : "p-4 font-thin hover:bg-blue-500 cursor-pointer"}
                                    prefetch={false}
                                >
                                    <span className="flex">
                                        <span>{link.icon}</span>
                                        <span className={`block ${linkCss}`}>{link.name}</span>
                                    </span>
                                </Link>
                        )
                    })
                }
            </div>
        </div> :
        <div className={`large:w-64 ${sliderWid} h-screen fixed bg-blue-600 text-white flex flex-col z-50`}>
            <div>
                <div className="p-4 font-bold text-xl">
                    <span className="flex">
                        <MenuIcon className="large:hidden" sx={{marginRight: "10px"}} onClick={slide}/> 
                        <span className={`block ${linkCss}`}>Dashboard</span>
                    </span>
                </div>
                <ul className="flex-1 flex flex-col">
                {
                    userNavLinks.map((link,id)=>{
                        const isActive = pathname.includes(link.href)
                        return(
                                <Link 
                                    key={id}
                                    href={link.href} 
                                    className={isActive ? "p-4 font-bold text-[1.05rem] hover:bg-blue-500 cursor-pointer underline" : "p-4 font-thin hover:bg-blue-500 cursor-pointer"}
                                    prefetch={false}
                                >
                                    <span className="flex">
                                        <span>{link.icon}</span>
                                        <span className={`block ${linkCss}`}>{link.name}</span>
                                    </span>
                                </Link>
                        )
                    })
                }
                </ul>
            </div>
        </div>
    )
}