import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import HomeLayout from '../../Layouts/HomeLayout'
import { useSelector } from 'react-redux';


function CourseDescription() {
  const { state } = useLocation();
  const navigate  = useNavigate() ; 
  const { role,data } = useSelector(state => state.auth);
  useEffect(()=>{
  },[])
  //console.log('State ',state);
  return (
    <HomeLayout>
      <div className="min-h-[90vh] w-[60%] pt-12 px-20 flex flex-col items-enter justify-center text-white mx-auto">
         <div className="grid grid-cols-2 gap-10 py-10 relative">
          <div className="space-y-5">
            <img
             src={state?.thumbnail?.secure_url}
             alt = 'thumbnail'
             className='w-100 h-100'
            />
            <div className="space-y-4">
                <div className="flex flex-col items-center justify-between text-xl">
                  <p className='font-semibold'>
                    <span className='text-yellow-500 font-bold'>
                      Total lectures :{" "}
                    </span>
                    {state?.numbersOfLectures}
                  </p>

                  <p className='font-semibold'>
                    <span className='text-yellow-500 font-bold'>
                      Instructor :{" "}
                    </span>
                    {state?.createdBy}
                  </p>
                </div>
                {  
                  role === 'ADMIN' || data?.subscription?.status === 'active' ||state?.paid == 'false' ? (
                    <button onClick={() => navigate('/course/displaylectures',{state:{...state}})} className='bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300'>
                      Watch lectures
                    </button>
                  ) : (
                    <button onClick={() => navigate('/checkout')} className='bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all ease-in-out duration-300'>
                      Subscribe
                    </button>
                  )
                }
            </div>
          </div>
          <div className="space-y-2 text-xl">
            <h1 className='text-4xl font-bold text-yellow-500 mb-4 text-center'>
              {state?.title}
            </h1>
            <p className='text-yellow-500 text-xl'>Course decription</p>
            <p>
              {state?.description}
            </p>
          </div>
         </div>
      </div>
    </HomeLayout>
  )
}

export default CourseDescription