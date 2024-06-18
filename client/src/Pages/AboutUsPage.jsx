import React from 'react'
import HomeLayout from '../Layouts/HomeLayout'
import aboutMainImage from '../assets/aboutMainImage.png'

import CarouselSlide from '../Components/CarouselSlide'
import { celebrities } from '../Constants'

export default function AboutUsPage() {

    
  return (
    <HomeLayout>
        <div className="mr-25 pl-20 pt-20 flex flex-col text-white ">
             <div className="flex items-center justify-around  mx-10 ">
                 <section className='w-[60%] space-y-10'>
                     <h1 className='text-5xl text-yellow-500 font-semibold'>
                        Affordable and quality education
                     </h1>
                     <p className='text-2xl text-gray-200'>
                        Our goal is to provide the affordable and quality 
                        education to the world.<br/> We are providing the platform 
                        for the aspiring teachers and students to <br/>share their 
                        skills ,creativity and knowledge to each other to empower 
                        <br/>and contribute in the growth and wellness of mankind.
                     </p>
                 </section>

                 <div className="w-[30%]">
                    <img 
                    id='test1'
                    style={{
                        filter:"drop-shadow(0px 10px 10px rgb(0,0,0));"
                    }}
                     src={aboutMainImage}
                     className='drop-shadow-2xl'
                     alt="about main image"
                     height={"600px"}
                     width={"600px"}
                    />
                 </div>
             </div>

             <div className="carousel w-1/2 mx-auto mb-[7.7rem]">
                {
                 celebrities &&  celebrities.map((celebrity) => (<CarouselSlide
                     key={celebrities.slideNumber}
                      {...celebrity}
                      totalSlides = {celebrities.length}
                      />))
                }
            </div>
        </div>
    </HomeLayout>
  )
}
