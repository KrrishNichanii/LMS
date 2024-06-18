import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayout'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {toast} from 'react-hot-toast'
import { login } from '../Redux/Slices/AuthSlice';


function LoginPage() {
  const dispatch = useDispatch() ; 
  const navigate = useNavigate() ; 
  const [loginData , setLoginData] = useState({
    email: "" ,
    password: "",
  })

  const handleUserInput = (e) => {
    const {name , value} = e.target ;
    setLoginData({
      ...loginData,
       [name]:  value
    }) 
  }
 

  const onLogin = async  (e) => {
    e.preventDefault();
    if(!loginData.email || !loginData.password){
      toast.error('Please fill all the details') ; 
      return ;
    }
    


    // dispatch create account action
  const response = await dispatch(login(loginData));
    if(response?.payload?.success)
        navigate("/");
    

     setLoginData({
      email: "" ,
      password: "",
     }) ; 

  }

  

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form noValidate onSubmit={onLogin} className='flex flex-col justify-center gap-3 rounded-lg p-8 text-white w-[30%] shadow-[0_0_10px_black]'>
           <h1 className='text-center text-3xl font-bold'>Login Page</h1>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <label htmlFor="email" className='font-semibold text-xl'> Email </label>
                    <input
                    type="email"
                    required
                    name="email"
                    id="email"
                    placeholder='Enter your email...'
                    className='bg-transparent p-2 border rounded-md h-[3rem] text-xl'
                    value = {loginData.email}
                    onChange={handleUserInput}
                    />

                </div>
                
                <div className="flex flex-col gap-3">
                    <label htmlFor="password" className='font-semibold text-xl'> Password </label>
                    <input
                    type="password"
                    required
                    name="password"
                    id="password"
                    placeholder='Enter your password...'
                    className='bg-transparent p-2 border rounded-md h-[3rem] text-xl'
                    value = {loginData.password}
                    onChange={handleUserInput}
                    />
                </div>
            </div>

            <button type='submit' className=' bg-yellow-600 hover:bg-yellow-500 transition-all  ease-in-out duration-300 rounded-md mt-3 py-2 font-semibold text-lg cursor-pointer h-[3rem]'>
                Login
                </button>
            <p className='text-center text-lg'>
              Don't have an account ? <Link className='link text-accent cursor-pointer' to='/signup'>Signup</Link>
            </p>
        </form>
      </div>
    </HomeLayout>
  )
}

export default LoginPage