import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayout'
import toast from 'react-hot-toast';
import { isEmail } from '../Helpers/regexMatcher';
import axiosInstance from '../Helpers/axiosInstance';

function ContactPage() {

    const [userInput , setUserInput] = useState({
        name: "",
        email: "" ,
        message: "" ,
    })

    const handleInputChange = (e) => {
        const {name,value} = e.target ; 

        setUserInput({
            ...userInput,
            [name]: value
        })
        //console.log(userInput);
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() ; 

        if(!userInput.email || !userInput.message || ! userInput.name){
            toast.error('All fields are mandatory') ; 
            return ; 
        }
        
        if(!isEmail(userInput.email)){
            toast.error('Invalid Email') ;
            return ; 
        }
        
        try {
            const response = axiosInstance.post('/contact',userInput);
            toast.promise(response,{
                loading: 'Submitting your message',
                success:'Form submitted successfully',
                error:" Failed to submit the form",
            })
            const contactResponse = await response ; 

            if(contactResponse?.data?.success){
                setUserInput({
                    name: "",
                    email: "" ,
                    message: "" ,
                })
            }
        } catch (error) {
            toast.error("Operation failed ...")
        }
    }

  return (
    <HomeLayout>
        <div className="flex items-center justify-center h-screen">
            <form noValidate onSubmit={onFormSubmit} className='flex flex-col items-center justify-center gap-5 p-5 rounded-md text-white shadow-[0_0_10px_black] w-[30rem] h-[37rem]'>
                <h1 className='text-4xl font-semibold'>
                    Contact Form
                </h1>

                <div className="flex flex-col w-full gap-4">
                    <label htmlFor="name" className='text-2xl font-semibold'>
                        Name
                    </label>
                    <input
                     type="text"
                     className='bg-transparent border px-2 py-1 rounded-md h-[3rem] text-xl'
                     id="name"
                     name="name"
                     placeholder='Enter your name'
                     onChange={handleInputChange}
                     value={userInput.name}
                     />
                </div>
                <div className="flex flex-col w-full gap-4">
                    <label htmlFor="email" className='text-2xl font-semibold'>
                        Email
                    </label>
                    <input
                     type="email"
                     className='bg-transparent border px-2 py-1 rounded-md h-[3rem] text-xl'
                     id="email"
                     name="email"
                     placeholder='Enter your email'
                     onChange={handleInputChange}
                     value={userInput.email}
                     />
                </div>

                <div className="flex flex-col w-full gap-4">
                    <label htmlFor="message" className='text-2xl font-semibold'>
                        Message
                    </label>
                    <textarea
                     className='bg-transparent border px-2 py-1 rounded-sm resize-none h-40 text-xl'
                     id="message"
                     name="message"
                     placeholder='Enter your message'
                     onChange={handleInputChange}
                     value={userInput.message}
                     />
                </div>
                <button type='submit' className='w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md py-2 font-semibold text-lg cursor-pointer'>
                    Submit
                </button>
            </form>
        </div>
    </HomeLayout>
  )
}

export default ContactPage