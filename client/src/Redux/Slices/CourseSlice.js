import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const initialState = {
    courseData: [] , 
}


export const getAllCourses = createAsyncThunk('/course/get',async () =>{
    try {
        const response = axiosInstance.get('/courses') ;
        //console.log('Res ',response);
        toast.promise(response,{
            loading: 'loading course data',
            success: "Courses loaded successfully",
            error: "Failed to get courses" , 
        })
        const courseData = await response ; 
        //console.log('Course data ',courseData);
        return courseData.data.data ; 
    } catch (error) {
       // console.log('Error check',error);
        toast.error(error?.response?.data?.message) ; 
        //navigate('/');
    }
})

export const deleteCourse = createAsyncThunk('/course/delete',async (id) =>{
    try {
        const response = axiosInstance.delete(`/courses/${id}`) ;
        //console.log('Res ',response);
        toast.promise(response,{
            loading: 'Deleting course ...',
            success: "Courses deleted successfully",
            error: "Failed to delete courses" , 
        })
        
        return (await response).data ; 
    } catch (error) {
        console.log('Error check',error);
        toast.error(error?.response?.data?.message) ; 
        //navigate('/');
    }
})


export const createNewCourse = createAsyncThunk('/course/create',async (data) =>{
    try {
        let formData = new FormData() ; 
        formData.append("title",data?.title);
        formData.append("description",data?.description);
        formData.append("category",data?.category);
        formData.append("createdBy",data?.createdBy);
        formData.append("thumbnail",data?.thumbnail);
        formData.append("paid",data?.paid) ; 

        const response = axiosInstance.post("/courses",formData) ; 

        toast.promise(response,{
            loading: 'Creating new course',
            success:'Course created successfully',
            error:'Failed to create course'
        })

        return (await response).data ; 
    } catch (error) {
        toast.error(error?.response?.data?.message) ;
    }
})

const courseSlice = createSlice({
    name:"courses" , 
    initialState , 
    reducers:{} ,
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled,(state,action) => {
            if(action.payload){
                state.courseData = [...action.payload] ; 
            }
        })
    }

})

export default courseSlice.reducer ; 

export const {} = courseSlice.actions
