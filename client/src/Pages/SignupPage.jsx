import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayout'
import { BsPersonCircle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {toast} from 'react-hot-toast'
import { createAccount } from '../Redux/Slices/AuthSlice';
import { isEmail, isValidPassword } from '../Helpers/regexMatcher';


function SignupPage() {
  const dispatch = useDispatch() ; 
  const navigate = useNavigate() ; 
  const [previewImage , setPreviewImage] = useState("") ; 
  const [signupData , setSignupData] = useState({
    fullName: "", 
    email: "" ,
    password: "",
    avatar:""
  })

  const handleUserInput = (e) => {
    const {name , value} = e.target ;
    setSignupData({
      ...signupData,
       [name]:  value
    }) 
  }
  const getImage = (e) => {
      e.preventDefault() ; 
      const uploadedImage = e.target.files[0] ;
    // console.log('Uploaded image ',uploadedImage);
      if(uploadedImage){
        setSignupData({
          ...signupData,
          avatar: uploadedImage
        }) ;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedImage);
        fileReader.addEventListener("load",function () {
          
          setPreviewImage(this.result) ; 
        })

      }
  }

  const createNewAccount =async  (e) => {
    e.preventDefault();
    if(!signupData.email || !signupData.password || !signupData.fullName ||!signupData.avatar){
      toast.error('Please fill all the details') ; 
      return ;
    }
    
    if(signupData.fullName.length < 5){
      toast.error("Name should be atleast 5 characters") ; 
      return ; 
    }

    if(!isEmail(signupData.email)){
      toast.error('Invalid email ID') ; 
      return ; 
    }
    
    if(signupData.password.length >16 || signupData.password.length < 8){
      toast.error('Password should be between 8 and 15 characters') ; 
      return ; 
    }
    else if(!isValidPassword(signupData.password)) {
      toast.error("Password should have  at least one lowercase alphabet , at least one uppercase alphabet , at least one Numeric digit and at least one special character") ; 
      return  ; 
    }
     
    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // dispatch create account action
    const response = await dispatch(createAccount(formData));
    if(response?.payload?.success)
        navigate("/");
    

     setSignupData({
      fullName: "", 
      email: "" ,
      password: "",
      avatar:""
     }) ; 

     setPreviewImage("") ; 
  }

  

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-screen">
        <form noValidate onSubmit={createNewAccount} className='flex flex-col justify-center gap-3 rounded-lg p-8 text-white w-[30%] shadow-[0_0_10px_black]'>
           <h1 className='text-center text-3xl font-bold'>Registration Page</h1>
           <label htmlFor="image_uploads" className='cursor-pointer'>
              {previewImage ? (
                <img 
                className='w-24 h-24 rounded-full m-auto'

                src={previewImage}
                />
              ) : (
                  <BsPersonCircle className='w-28 h-28 rounded-full m-auto' />
              )
            }
           </label>
           <input
            type="file"
            className='hidden'
            id="image_uploads" 

            accept=".jpg, .jpeg, .png, .svg"
            name="avatar"
            onChange={getImage}
            />
             

             <div className="flex flex-col gap-3">
                    <label htmlFor="fullName" className='font-semibold text-xl'> Full Name </label>
                    <input
                    type="text"
                    required
                    name="fullName"
                    id="fullName"
                    placeholder='Enter your full name...'
                    className='bg-transparent p-2 border rounded-md h-[3rem] text-xl'
                    value = {signupData.fullName}
                    onChange={handleUserInput}
                    />
                </div>


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
                    value = {signupData.email}
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
                    value = {signupData.password}
                    onChange={handleUserInput}
                    />
                </div>
            </div>

            <button type='submit' className=' bg-yellow-600 hover:bg-yellow-500 transition-all  ease-in-out duration-300 rounded-md mt-3 py-2 font-semibold text-lg cursor-pointer h-[3rem]'>Create account</button>
            <p className='text-center text-lg'>
              Already have an account ? <Link className='link text-accent cursor-pointer' to='/login'>Login</Link>
            </p>
        </form>
      </div>
    </HomeLayout>
  )
}

export default SignupPage