"use client"
import ConfirmationPopup from "@/app/components/Pop-up";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from '../../components/Loader';

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [uId, setUid] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true)

  const handleConfirm=()=>{
    // axios.delete(`http://localhost:8000/api/user/deleteUser/${uId}`).then((res)=>{
    axios.delete(`/api/user/${uId}`).then((res)=>{
        setUid("")
        setShowPopup(false);
      })
    }
  const handleCancle=()=>{
      setUid("")
      setShowPopup(false);
  }

  const delUser=(id)=>{
    setUid(id)
    setShowPopup(true)
  }

  useEffect(()=>{
    // axios.get("http://localhost:8000/api/user/getAllUsers").then((res)=>{
    axios.get("/api/user").then((res)=>{
        setUsers(res.data)
        setLoading(false)
    }).then(()=>{console.log(users)})
  },[uId])

  if(loading) return <Loader/>
  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <div className="w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
          User List
        </h2>
        <div className="flex flex-row-reverse pb-3">
          <Link href={"/dashboard/manageUsers/addUser"} className="px-3 py-2 rounded-md bg-green-500 text-white" prefetch={false}>Add User</Link>
        </div>
        <div className="overflow-x-auto">
          <ConfirmationPopup showPopup={showPopup} setShowPopup={setShowPopup} handleConfirm={handleConfirm} handleCancel={handleCancle}/>
          <table className="min-w-full border border-gray-300 text-gray-800">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Id</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users?.map((user) => {
                    if(!(user.isAdmin))
                    return(
                        <tr
                            key={user._id}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-2">{user._id ?? ""}</td>
                            <td className="px-4 py-2">{user.username ?? ""}</td>
                            <td className="px-4 py-2">{user.email ?? ""}</td>
                            <td className="px-4 py-2 flex items-center justify-center space-x-4">
                            {/* <button
                                onClick={() => {("")}}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                            >
                                Update
                            </button> */}
                            <button
                                onClick={() => {delUser(user._id)}}
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                            </td>
                        </tr>
                    )
                })
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};