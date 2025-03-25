"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function NavbarDashboard(){
    const { userInfo } = useSelector((state) => state.auth) || ""
    const pathname = usePathname()
    const adminNavLinks = [
        {name: "Profile", href: "/dashboard/profile"},
        {name: "Manage Users", href: "/dashboard/manageUsers"},
        {name: "Manage Products", href: "/dashboard/manageProducts"},
        {name: "Orders", href: "/dashboard/orders/allOrders"},
    ]
    const userNavLinks = [
        {name: "Profile", href: "/dashboard/profile"},
        {name: "My orders", href: "/dashboard/orders/userOrders"},
    ]
    return(
        userInfo?.isAdmin ?
        <div className="w-64 h-screen fixed bg-blue-600 text-white flex flex-col">
            <div className="p-4 font-bold text-xl">Admin Dashboard</div>
            <div className="flex-1 flex flex-col">
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
                                    {link.name}
                                </Link>
                        )
                    })
                }
            </div>
        </div> :
        <div className="w-64 h-screen fixed bg-blue-600 text-white flex flex-col">
            <div>
                <div className="p-4 font-bold text-xl">User Dashboard</div>
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
                                    {link.name}
                                </Link>
                        )
                    })
                }
                </ul>
            </div>
        </div>
    )
}