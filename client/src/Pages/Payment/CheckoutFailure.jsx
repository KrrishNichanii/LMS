import React from 'react'
import HomeLayout from '../../Layouts/HomeLayout'
import { AiFillCheckCircle } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { RxCrossCircled } from 'react-icons/rx'

function CheckoutFailure() {
  return (
    <HomeLayout>
        <div className="min-h-[90vh] flex items-center justify-center text-white">
            <div className="w-[30rem] h-[34rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
                <h1 className='bg-red-500 absolute top-0 w-full py-4 text-4xl font-bold rounded-tl-lg rounded-tr-lg text-center'>Payment Failed</h1>
                <div className="px-4 flex flex-col items-center justify-center space-y-2">
                    <div className="text-center space-y-4">
                        <h2 className='text-3xl font-semibold'>
                            Oops ! Your payment failed
                        </h2>
                        <p className='text-center text-lg'>
                            Please try again later
                        </p>
                    </div>
                    <RxCrossCircled className='text-red-500 text-5xl'/>
                </div>
                <Link to="/checkout" className='bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full py-2 text-2xl font-bold text-center rounded-br-lg rounded-bl-lg'>
                   Try again
                </Link>
            </div>
        </div>
    </HomeLayout>
  )
}

export default CheckoutFailure