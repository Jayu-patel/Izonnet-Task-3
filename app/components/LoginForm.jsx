"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { setCredentials } from "../redux/slice/userSlice";
import { toast } from "react-toastify";
import LockIcon from '@mui/icons-material/Lock';
import { Avatar, TextField, IconButton, InputAdornment, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
 
export default function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dispatch = useDispatch()
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [errorBool, setErrorBool] = useState({
        email: false, password: false
    })

    const [errorList, setErrorList] = useState({
        email: "", password: ""
    })

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit=async()=>{
        if(!email){setErrorBool(prev=>({...prev, email: true})); setErrorList(prev=>({...prev, email: "Please Enter Email"})); return}
        if(email.includes(" ") || !emailRegex.test(email)){setErrorBool(prev=>({...prev, email: true})); setErrorList(prev=>({...prev, email: "Please enter a valid email address."})); return}
        setErrorBool(prev=>({...prev, email: false})); setErrorList(prev=>({...prev, email: ""}))

        if(!password){setErrorBool(prev=>({...prev, password: true})); setErrorList(prev=>({...prev, password: "Please Enter Password"})); return}
        if(password.includes(" ")){setErrorBool(prev=>({...prev, password: true})); setErrorList(prev=>({...prev, password: "Passwod cannot contain spaces"})); return}
        if(password.length < 5){setErrorBool(prev=>({...prev, password: true})); setErrorList(prev=>({...prev, password: "Password must be at least 5 characters long."})); return}
        setErrorBool(prev=>({...prev, password: false})); setErrorList(prev=>({...prev, password: ""}))

        setLoading(true)
        axios.post("/api/user/login",{
            email,
            password
        }).then((res)=>{
        if(res.status !== 201){
            toast.error(res.data.message);
        }
        else{
            dispatch(setCredentials(res.data));
            
            setEmail("");
            setPassword("");
            router.push("/dashboard/profile")
        }
        setLoading(false)
        }).catch((err) =>{
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message);
                setLoading(false)
            }
        })

    }

    return(
        <div>
            <div className="w-[340px] h-[70vh] p-5 my-5 mx-auto shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.2),0px_10px_14px_1px_rgba(0,0,0,0.14),0px_4px_18px_3px_rgba(0,0,0,0.12)]">
                <div className="w-full grid place-items-center">
                    <Avatar style={{backgroundColor: 'green'}}><LockIcon/></Avatar>
                    <h1 className="p-2 text-[2rem] font-bold">Sign in</h1>
                </div>
                <div>
                    <TextField 
                        value={email} 
                        onChange={e=>setEmail(e.target.value)} 
                        label="Email" placeholder="Enter email" 
                        fullWidth 
                        required 
                        style={{margin: "16px auto"}}
                        error={errorBool.email}
                        helperText={errorList.email ?? ""}
                    />
                    <TextField value={password} onChange={e=>setPassword(e.target.value)} label="Password" placeholder="Enter password" fullWidth required 
                        error={errorBool.password}
                        helperText={errorList.password ?? ""}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleTogglePassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                    />

                    {
                        loading ?
                        <Button onClick={handleSubmit} style={{margin: "16px auto"}} type="submit" variant="contained" color="inherit" fullWidth>Loading...</Button> :
                        <Button onClick={handleSubmit} style={{margin: "16px auto"}} type="submit" variant="contained" color="primary" fullWidth>Sign in</Button>
                    }
                    <div className="mt-3">
                        <Link className="underline text-blue-500 block py-2" href="/login/generateOtp">Forgot password?</Link>
                        <span>
                            Don't have an account?
                        </span>
                        <Link className="underline text-blue-500 ml-2" href="/register">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
