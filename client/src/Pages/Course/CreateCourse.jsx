import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { createNewCourse } from '../../Redux/Slices/CourseSlice';
import HomeLayout from '../../Layouts/HomeLayout';
import { AiOutlineArrowLeft } from 'react-icons/ai';

function CreateCourse() {
    const dispatch = useDispatch() ; 
    const navigate = useNavigate() ; 

    const [userInput,setUserInput] = useState({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail:null,
        previewImage: "",
        paid:"false" , 
    }) ;

    const handleImageUpload = (e) => {
        e.preventDefault() ; 
        const uploadedImage = e.target.files[0] ; 

        if(uploadedImage){
            const fileReader = new FileReader() ;
            fileReader.readAsDataURL(uploadedImage) ; 
            fileReader.addEventListener("load",function (){
                setUserInput({
                    ...userInput , 
                    previewImage: this.result , 
                    thumbnail: uploadedImage ,
                })
            })
        }
    }

    const handleUserInput = (e) => {
        const { name , value} = e.target ; 

        setUserInput({
            ...userInput,
            [name]: value
        })
    }


    const onFormSubmit = async(e) => {
        e.preventDefault() ; 
        if(!userInput.title || !userInput.description || !userInput.category || !userInput.thumbnail || !userInput.createdBy){
            toast.error('All fields are mandatory');
            return  ; 
        }
        
        const response = await dispatch(createNewCourse(userInput));
        
        if(response?.payload?.success){
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail:null,
                previewImage: ""
            })
            navigate('/courses') ; 
        }
    }

  return (
    <HomeLayout>
        <div className="flex items-center justify-center h-[100vh]">
            <form 
            onSubmit={onFormSubmit}
            className='flex flex-col justify-center gap-10 rounded-lg p-4 text-white h-[65%] w-[800px] shadow-[0_0_10px_black] relative'
            > 
              <Link className='absolute top-8 text-2xl link text-accent cursor-pointer'>
                 <AiOutlineArrowLeft onClick={() => navigate(-1)}/>
              </Link>
              <h1 className='text-center text-3xl font-bold '>
                Create New Course
              </h1>

              <main className='grid grid-cols-2 gap-x-10'>
                <div className="gap-y-8 mt-6 flex flex-col justify-center">
                    <div className="">
                        <label htmlFor="image_uploads" className='cursor-pointer h-[0rem]'>
                            {userInput.previewImage ? (
                                <img 
                                src={userInput.previewImage} 
                                alt="preview Image"
                                className='w-full h-[13rem] m-auto border'
                                />
                            ) : (
                                <div className="w-full h-44 m-auto flex items-center justify-center border">
                                   <h1 className='font-bold text-lg'> Upload your course thumbnail</h1>
                                </div>
                            )}
                        </label>
                        <input
                        className='hidden'
                        type="file" 
                         id='image_uploads'
                         accept=".jpg ,.jpeg,.png"
                         name="image_uploads"
                         onChange={handleImageUpload}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="paid" className='text-xl font-semibold'>
                            Paid
                        </label>
                        <select
                         name="paid"
                         id="paid"
                         value={userInput?.paid}
                         onChange={handleUserInput}
                         className='h-[3rem] p-2 rounded-md text-xl bg-transparent border'
                         >
                            <option value="true" className='bg-gray-400  text-black'>true</option>
                            <option value="false" className='bg-gray-400  text-black'>false</option>
                        </select>

                    </div>
                    <div className="flex flex-col gap-3 ">
                        <label htmlFor="title" className='text-xl font-semibold'>
                            Course title
                        </label>
                        <input 
                        type="text" 
                        required
                        name="title"
                        id="title"
                        placeholder='Enter course title'
                        className='bg-transparent px-2 py-1 border h-[3rem] text-xl rounded-md'
                        value={userInput.title}
                        onChange={handleUserInput}
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-3">
                        <label htmlFor="createdBy" className='text-xl font-semibold'>
                            Course instructor
                        </label>
                        <input 
                        type="text" 
                        required
                        name="createdBy"
                        id="createdBy"
                        placeholder='Enter course instructor'
                        className='bg-transparent px-2 py-1 border text-xl rounded-md h-[3rem]'
                        value={userInput.createdBy}
                        onChange={handleUserInput}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="category" className='text-xl font-semibold'>
                            Category
                        </label>
                        <input 
                        type="text" 
                        required
                        name="category"
                        id="category"
                        placeholder='Enter course category'
                        className='bg-transparent px-2 py-1 text-xl border rounded-md h-[3rem]'
                        value={userInput.category}
                        onChange={handleUserInput}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="description" className='text-xl font-semibold'>
                            Description
                        </label>
                        <textarea 
                        required
                        name="description"
                        id="description"
                        placeholder='Enter course description'
                        className='bg-transparent px-2 text-xl py-1 border h-36 overflow-y-scroll rounded-md resize-none'
                        value={userInput.description}
                        onChange={handleUserInput}
                        />
                    </div>
                </div>
              </main>

              <button type='submit' className='w-full py-2 rounded-md font-semibold text-lg cursor-pointer bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300'>
                Create Course
              </button>
            </form>
        </div>
    </HomeLayout>
  )
}

export default CreateCourse