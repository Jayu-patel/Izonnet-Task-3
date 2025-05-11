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
 
export default function Register(){

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const router = useRouter();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [errorBool, setErrorBool] = useState({
        username: false, email: false, password: false, confPassword: false
    })

    const [errorList, setErrorList] = useState({
        username: "", email: "", password: "", confPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleTogglePassword2 = () => {
        setShowPassword2((prev) => !prev);
    };

    const handleSubmit=async()=>{
        if(!username){setErrorBool(prev=>({...prev, username: true})); setErrorList(prev=>({...prev, username: "Please Enter Username"})); return}
        if(username.includes(" ")) {setErrorBool(prev=>({...prev, username: true})); setErrorList(prev=>({...prev, username: "Username cannot contain spaces. Please use only letters, numbers, or allowed symbols"})); return}
        setErrorBool(prev=>({...prev, username: false})); setErrorList(prev=>({...prev, username: ""}))

        if(!email){setErrorBool(prev=>({...prev, email: true})); setErrorList(prev=>({...prev, email: "Please Enter Email"})); return}
        if(email.includes(" ") || !emailRegex.test(email)){setErrorBool(prev=>({...prev, email: true})); setErrorList(prev=>({...prev, email: "Please enter a valid email address."})); return}
        setErrorBool(prev=>({...prev, email: false})); setErrorList(prev=>({...prev, email: ""}))

        if(!password){setErrorBool(prev=>({...prev, password: true})); setErrorList(prev=>({...prev, password: "Please Enter Password"})); return}
        if(password.includes(" ")){setErrorBool(prev=>({...prev, password: true})); setErrorList(prev=>({...prev, password: "Passwod cannot contain spaces"})); return}
        if(password.length < 5){setErrorBool(prev=>({...prev, password: true})); setErrorList(prev=>({...prev, password: "Password must be at least 5 characters long."})); return}
        setErrorBool(prev=>({...prev, password: false})); setErrorList(prev=>({...prev, password: ""}))

        if(!confPassword || (password != confPassword)){setErrorBool(prev=>({...prev, confPassword: true})); setErrorList(prev=>({...prev, confPassword: "Please Confirm password"})); return}
        setErrorBool(prev=>({...prev, confPassword: false})); setErrorList(prev=>({...prev, confPassword: ""}))

        setLoading(true)
            // axios.post("http://localhost:8000/api/user/register",{
        axios.post("/api/user/register",{
            username,
            email,
            password
        }).then((res)=>{
            if(res.status !== 201){
                return toast.error(res.data.message)
            }
            else{
                toast.success("Profile created successfully!")
                dispatch(setCredentials(res.data));
    
                setUsername("")
                setEmail("")
                setPassword("")
                setConPassword("")
                router.push("/dashboard/profile")
            }
            setLoading(false)
        }).catch(err=>{
            if(err?.response?.data?.message){
            toast.error(err?.response?.data?.message)
            setLoading(false)
        }
        })

    }

    return(
        <div>
            <div className="w-[340px] h-[75vh] p-5 my-6 mx-auto shadow-[0px_6px_6px_-3px_rgba(0,0,0,0.2),0px_10px_14px_1px_rgba(0,0,0,0.14),0px_4px_18px_3px_rgba(0,0,0,0.12)]">
                <div className="w-full grid place-items-center">
                    <Avatar style={{backgroundColor: 'green'}}><LockIcon/></Avatar>
                    <h1 className="p-2 text-[2rem] font-bold">Sign Up</h1>
                </div>
                <div>
                    <TextField value={username} onChange={e=>setUsername(e.target.value)} label="Username" placeholder="Enter username" fullWidth required className="" error={errorBool.username} helperText={errorList.username?? ""} />
                    <TextField value={email} onChange={e=>setEmail(e.target.value)} label="Email" placeholder="Enter email" fullWidth required style={{margin: "16px auto"}} error={errorBool.email} helperText={errorList.email?? ""} />
                    <TextField value={password} onChange={e=>setPassword(e.target.value)} label="Password" placeholder="Enter password" fullWidth required style={{marginBottom: "16px"}}
                        helperText={errorList.password?? ""}
                        error={errorBool.password}
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
                    <TextField value={confPassword} onChange={e=>setConPassword(e.target.value)} label="Confirm password" placeholder="Confirm password" fullWidth required 
                        helperText={errorList.confPassword?? ""}
                        error={errorBool.confPassword}
                        type={showPassword2 ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleTogglePassword2} edge="end">
                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                    />
                    {
                        loading ?
                        <Button onClick={handleSubmit} style={{margin: "16px auto"}} type="submit" variant="contained" color="inherit" fullWidth>Loading...</Button> :
                        <Button onClick={handleSubmit} style={{margin: "16px auto"}} type="submit" variant="contained" color="primary" fullWidth>Sign up</Button>
                    }
                    <div className="mt-3">
                        <span>
                            Already have an account?
                        </span>
                        <Link className="underline text-blue-500 ml-2" href="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
