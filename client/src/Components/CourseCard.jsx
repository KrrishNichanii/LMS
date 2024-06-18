import React from 'react'
import { FaTag } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'

function CourseCard({ data }) {
    const navigate = useNavigate() ; 

  return (
    <div
     onClick={() => navigate('/course/description/',{state: {...data}})}
    className='relative text-white w-[27rem] h-[550px] rounded-xl shadow-lg cursor-pointer group overflow-hidden bg-zinc-700'>
        <div className="overflow-hidden">
            <img
             className='h-[20rem] w-full rounded-tl-lg rounded-tr-lg transition-all ease-in-out duration-500 group-hover:scale-110'
             src={data?.thumbnail?.secure_url}
             alt="course thumbnail"
            />
            <div className="p-3 space-y-1 text-white ">
                <h2 className='text-2xl font-bold text-yellow-500 line-clamp-2'>
                    {data?.title}
                </h2>
                <p className='line-clamp-2 text-lg'>
                    {data?.description}
                </p>
                <p className='font-semibold text-xl'>
                    <span className='text-yellow-500 text-xl font-bold'>Category : </span>
                    {data?.category}
                </p>

                <p className='font-semibold'>
                    <span className='text-yellow-500 text-lg font-bold'>Total lectures : </span>
                    {data?.numbersOfLectures}
                </p>

                <p className='font-semibold text-xl'>
                    <span className='text-yellow-500  text-xl font-bold'>Instructor : </span>
                    {data?.createdBy}
                </p>
                {
                    data?.paid == 'false' && <div className="absolute hover:scale-125 transition-all ease-in-out duration-500 bg-green-400 w-[5rem]  flex gap-2 h-[2rem] rounded-tl-md rounded-bl-md p-1 right-[0.15rem] bottom-4">
                        <FaTag className='w-6 h-6'/> 
                        <span className='font-bold'> Free</span>
                        </div>
                }
            </div>
        </div>
    </div>
  )
}

export default CourseCard