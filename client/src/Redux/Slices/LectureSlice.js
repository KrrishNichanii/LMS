import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    lectures: [] , 
}


export const getCourseLectures = createAsyncThunk('/course/lecture/get',async (cid) => {
    try {
        const response = axiosInstance.get(`/courses/${cid}`) ; 
        toast.promise(response,{
            loading:"Fetching course lectures",
            success:"Lectures fetched successfully",
            error:'Failed to load lectures',
        })
        //console.log(response);
        return (await response).data ; 
    } catch (error) {
        toast.error(error?.response?.data?.message) ; 
    }
})

export const addCourseLecture = createAsyncThunk('/course/lecture/add',async (data) => {
    try {
        console.log('data',data);

        const formData = new FormData();
        formData.append("lecture",data.lecture) ; 
        formData.append("title",data.title) ; 
        formData.append("description",data.description) ; 
        
        const response = axiosInstance.post(`/courses/${data.id}`,formData) ; 
        toast.promise(response,{
            loading:"Adding course lecture",
            success:"Lecture added successfully",
            error:'Failed to add lecture',
        })
        return (await response).data ; 
    } catch (error) {
        toast.error(error?.response?.data?.message) ; 
    }
})

export const deleteCourseLecture = createAsyncThunk('/course/lecture/delete',async (data) => {
    try {
       
        const response = axiosInstance.delete(`/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`) ; 
        toast.promise(response,{
            loading:"Deleting course lecture",
            success:"Lecture deleted successfully",
            error:'Failed to delete lecture',
        })
        return (await response).data ; 
    } catch (error) {
        toast.error(error?.response?.data?.message) ; 
    }
})

export const deleteCommentFromLecture = createAsyncThunk('/course/commentDelete',async (data) => {
    const {courseId ,lectureId , commentId} = data ; 
    console.log(commentId , lectureId , courseId);
    try {
         const response = axiosInstance.delete(`courses/comment?courseId=${courseId}&lectureId=${lectureId}&commentId=${commentId}`) ; 
         toast.promise(response,{
         loading:'Deleting comment' , 
         success: 'Comment deleted successfully' , 
         error: 'Failed to delete comment'
         })
       return (await response).data ; 
    } catch (error) {
     toast.error(error?.response?.data?.message) ;
    }
 })

export const addCommentToLecture = createAsyncThunk('/course/commentAdd',async (data) => {
    const {courseId ,lectureId , text , user} = data ; 
    console.log(courseId , lectureId , text , user);
    try {
         const response = axiosInstance.post(`courses/comment?courseId=${courseId}&lectureId=${lectureId}`,{text,user}) ; 
         toast.promise(response,{
         loading:'Adding comment' , 
         success: 'Comment added successfully' , 
         error: 'Failed to add comment'
         })
         return (await response).data ; 
    } catch (error) {
     toast.error(error?.response?.data?.message) ;
    }
})

const lectureSlice = createSlice({
    name: "lecture",
    initialState ,
    reducers: {} ,
    extraReducers: (builder) => {
            builder 
               .addCase(getCourseLectures.fulfilled,(state,action) => {
                   //console.log('Lec While getting lectures ',action?.payload);
                  state.lectures = action?.payload?.data ; 
               })
               .addCase(addCourseLecture.fulfilled,(state,action)=> {
                //console.log(action.payload); 
                state.lectures = action?.payload?.course?.lectures ; 
               })
               .addCase(deleteCommentFromLecture.fulfilled,(state,action) => {
                //console.log('Lec While deleting comment ',action?.payload);
                 state.lectures = action?.payload?.data
               }) 
               .addCase(addCommentToLecture.fulfilled,(state,action) => {
                state.lectures = action?.payload?.data ; 
               })
    }
})

export default lectureSlice.reducer ; 