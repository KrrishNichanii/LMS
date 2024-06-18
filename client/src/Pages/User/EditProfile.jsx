import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { getUserData, updateProfile } from '../../Redux/Slices/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { AiOutlineArrowLeft } from 'react-icons/ai';



function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data,setData] = useState({
        previewImage: "",
        fullName: "" ,
        avatar: undefined , 
        userId: useSelector(state => state?.auth?.data?._id) ,
    });

    const handleImageUpload = (e) => {
        e.preventDefault() ; 

        const uploadedImage = e.target.files[0] ;

        if(uploadedImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",function (){
                setData({
                    ...data,
                    previewImage:this.result , 
                    avatar: uploadedImage  ,
                })
            })
        }
    }

    const handleInputChange = (e) => {
        const {name,value} = e.target ;
        setData({
            ...data,
            [name]:value ,
        })
    }

    const onFormSubmit = async (e) => {
        e.preventDefault() ; 

        if(!data.fullName || !data.avatar){
            toast.error('All fields are mandatory');
            return ; 
        }

        if(data.fullName.length < 5){
            toast.error('Name cannot be less than 5 characters') ;
            return ; 
        }

        const formData = new FormData() ;
        formData.append("fullName",data.fullName);
        formData.append("avatar",data.avatar);
        
        await dispatch(updateProfile(formData)) ; 
        await dispatch(getUserData()) ;

        navigate('/user/profile') ; 
    }

    return (
     <HomeLayout>
        <div className=" flex items-center justify-center h-screen">
            <form 
            onSubmit={onFormSubmit}
            className='flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[30rem] min-h-[30rem] shadow-[0_0_10px_black]'
            >
                <h1 className="text-center text-4xl font-semibold">Edit profile</h1>
               <label
                htmlFor="image_uploads"
                className='cursor-pointer'
                >
                {data.previewImage ? (
                    <img
                     className='w-28 h-28 rounded-full m-auto'
                     src={data.previewImage}
                    />
                ) : (
                    <BsPersonCircle className='w-[9rem] h-[9rem] rounded-full m-auto'/>
                )}
               </label>
               <input
               onChange={handleImageUpload}
               type="file"
               className='hidden'
               id="image_uploads"
               name='image_uploads'
               accept='.jpeg,.jpg,.png,.svg'
                />
                <div className="flex flex-col gap-3">
                    <label htmlFor="fullName" className='text-xl font-semibold'>Full Name</label>
                    <input
                     type="text"
                     required
                     name='fullName'
                     id="fullName"
                     className='bg-transparent px-2 py-1 h-[3rem] border rounded-md text-xl'
                     value={data.fullName}
                     onChange={handleInputChange} 
                      />
                </div>
                <button type='submit' className='w-full bg-yellow-600 hover:bg-yellow-500 transiton-all ease-in-out duration-300 rounded-md py-2 text-lg cursor-pointer font-semibold'>
                    Update profile
                </button>
                <Link to='/user/profile'>
                    <p className='link text-accent cursor-pointer flex item-center justify-center w-full text-lg gap-2'>
                        <AiOutlineArrowLeft className='relative top-[0.4rem]'/>
                        <span>Go back to profile</span> 
                    </p>
                </Link>
            </form>
        </div>
     </HomeLayout>
  )
}

export default EditProfile