import React from 'react'
import HomeLayout from '../Layouts/HomeLayout'
import { Link } from 'react-router-dom'
import HomePageImage from '../assets/homePageMainImage.png'




function HomePage() {
  return (
   <HomeLayout>
      <div className="pt-10 pl-20 text-white flex items-center justify-evenly  mx-16 h-[85vh]">
         <div className="w-1/2 space-y-6 ">
             <h1 className='text-5xl font-semibold '>
                Find out best     <span className='text-yellow-500 font-bold'>
                      Online Courses 
                </span>
             </h1>
             <p className='text-xl text-gray-200'>
                We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
             </p>

             <div className="space-x-6">
                <Link to='/courses'>
                    <button className='bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300'>
                        Explore courses
                    </button>
                </Link>

                <Link to='/contact'>
                    <button className='border border-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300'>
                        Contact Us
                    </button>
                </Link>
             </div>
         </div>

         <div className="w-1/2 flex items-center justify-center">

            <img className='h-[35.5em] w-[45.5em]' alt="homepage image" src={HomePageImage} />
         </div>
      </div>
   </HomeLayout>
  )
}

export default HomePage