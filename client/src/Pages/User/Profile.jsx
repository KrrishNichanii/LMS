import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HomeLayout from '../../Layouts/HomeLayout';
import { Link, useNavigate } from 'react-router-dom';
import { cancelCourseBundle } from '../../Redux/Slices/RazorpaySlice';
import { getUserData } from '../../Redux/Slices/AuthSlice';
import toast from 'react-hot-toast';

function Profile() {
    const dispatch = useDispatch() ; 
    const userData = useSelector(state => state?.auth.data) ;
    const navigate = useNavigate() ;
     
    const handleCancellation = async () => {
        toast('Initiating cancellation') ; 
        await dispatch(cancelCourseBundle()) ;
        await dispatch(getUserData()) ; 
        toast.success('Cancellation completed') ; 
        navigate('/')  ;
    }
    return (
    <HomeLayout>
        <div className="min-h-[90vh]  flex items-center justify-center">
            <div className="my-10 h-full flex flex-col gap-8 rounded-lg p-6 text-white w-[35rem] shadow-[0_0_10px_black]">
                <img
                 src={userData?.avatar?.secure_url}
                 className='w-40 m-auto rounded-full border border-black'
                 />
                 <h3 className='text-3xl font-semibold text-center capitalize'>
                    {userData?.fullName}
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <p className='text-xl font-semibold'>Email: </p><p className='text-xl'>{userData?.email}</p>
                    
                    <p className='text-xl font-semibold'>Role: </p><p className='text-xl'>{userData?.role}</p>
                    
                    <p className='text-xl font-semibold'>Subscription: </p>
                    <p className='text-xl'>{userData?.subscription?.status === 'active' ? 'Active' : 'Inactive'}</p>
                 </div>
                 <div className="flex items-center justify-between gap-4 mt-4 mb-0">
                    <Link 
                    to='/changepassword' 
                    className='w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 cursor-pointer text-center'
                    >
                        <button>Change password</button>
                    </Link>

                    <Link 
                    to='/user/editprofile' 
                    className='w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 cursor-pointer text-center'
                    >
                        <button>Edit profile</button>
                    </Link>
                 </div>
                 {userData?.subscription?.status === 'active' && (
                    <button onClick={handleCancellation} className='w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-md font-semibold py-2 cursor-pointer text-center'>
                        Cancel subscription
                    </button>
                 )}
            </div>
        </div>
    </HomeLayout>
  )
}

export default Profile