import { log } from "console";
import Course from "../models/course.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary"
import fs from 'fs/promises'
import path from 'path';


const getAllCourses = asyncHandler(async (req,res) => {
        const courses = await Course.find({}).select('-lectures') ; 

        res.status(200).json(new ApiResponse(200 , courses , 'All courses'))
})


const getLecturesByCourseId = asyncHandler(async (req,res ) => {
      const { cid } = req.params ; 
      console.log('Course',cid);

      const course = await Course.findById(cid) ; 
      if(!course){
        throw new ApiError(400,'No such course exists') ;
      }

      res.status(200).json(new ApiResponse(200 , course.lectures , 'Course lectures fetched successfully')) ; 

})

// const createCourse = asyncHandler(async (req,res,next) => {
//       const {title , description , category , createdBy ,paid} = req.body ; 

//       if(!title || !description || !category || !createdBy || !paid){
//         return next(new ApiError(400 , 'All fields are required')) ; 
//       }

//       const course = await Course.create({
//         title , 
//         description , 
//         category , 
//         createdBy ,  
//         paid
//       }) ; 

//       if(!course){
//         return next(new ApiError(400 , 'Course could not be created , Please try again')) ;
//       }

//       if(req.file){
//         try {
//             const result = await uploadOnCloudinary(req.file.path) ; 
          
//             if(result) {
//                 course.thumbnail.public_id = result.public_id ;
//                 course.thumbnail.secure_url = result.secure_url ; 
//             }
//         } catch (error) {
//             await Course.findByIdAndDelete(course._id) ; 
//             return next(new ApiError(400 , 'Error processing thumbnail')) ; 
//         }
//       }

//       await course.save() ; 

//       res.status(200).json(new ApiResponse(200 , course , 'Course created successfully')) ; 
// }) ; 

 const createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, category, createdBy ,paid } = req.body;

  if (!title || !description || !category || !createdBy || !paid) {
    return next(new ApiError(400,'All fields are required'));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    paid,
  });

  if (!course) {
    return next(
      new ApiError(400,'Course could not be created, please try again')
    );
  }

  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in array
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`public/temp/${req.file.filename}`);
    } catch (error) {
      console.log('Err ',error.message);
      await Course.findByIdAndDelete(course._id) ; 
      for (const file of await fs.readdir('public/temp/')) {
        await fs.unlink(path.join('public/temp/', file));
      }

      // Send the error message
      return next(
        new ApiError(
          400 , 
          JSON.stringify(error) || 'File not uploaded, please try again',``
        )
      );
    }
  }

  await course.save();

  res.status(200).json(new ApiResponse(200 , course , 'Course created successfully')) ; 
});

const updateCourse = asyncHandler(async (req,res,next) => {
     try {
        const {id} = req.params ; 
        const course = await Course.findByIdAndUpdate(
            id , {
                $set: req.body , 
            } , 
            {
                runValidators: true ,
                new : true
            } 
        )

        if(!course){
           return next(new ApiError(400 , 'Course with given id does not exist'))
        }
        res.status(200).json(new ApiResponse(200,course , 'Course updated successfully'))
     } catch (error) {
        return next(new ApiError(400 , 'Error in updating course'))
     }
}) ; 

const removeCourse = asyncHandler(async (req,res,next) => {
   const { id } = req.params ; 

   const course = await Course.findByIdAndDelete(id) ; 

   if(course === null){
    return next(new ApiError(400 , 'Course with provided id does not exist')) ;
   }

   res.status(200).json(new ApiResponse(200 , course , 'Course deleted successfully')) ; 
}) ; 


 const addLectureToCourseById = asyncHandler(async (req, res, next) => {
  const { title, description  } = req.body;
  const { id } = req.params;
  console.log('Entering ');
  let lectureData = {};
  lectureData.comments= []
  if (!title || !description) {
    return next(new ApiError(400 , 'Title and Description are required'));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new ApiError(400 , 'Invalid course id or course not found.'));
  }

  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        //folder: 'lms', // Save files in a folder named lms
        chunk_size: 50000000, // 50 mb size
        resource_type: 'video',
      });
       console.log('res ',result);
      // If success
      if (result) {
        // Set the public_id and secure_url in array
        lectureData.public_id = result.public_id;
        lectureData.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`public/temp/${req.file.filename}`);
    } catch (error) {
      console.log('Error msg ',error.message);
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir('public/temp')) {
        await fs.unlink(path.join('public/temp', file));
      }

      // Send the error message
      return next(
        new ApiError(
          400,
          JSON.stringify(error) || 'File not uploaded, please try again'
        )
      );
    }
  }

  course.lectures.push({
    title,
    description,
    lecture: lectureData,
  });

  course.numbersOfLectures = course.lectures.length;

  // Save the course object
  await course.save();
   console.log("Exiting");
  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    course,
  });
});



const removeLectureById = asyncHandler(async (req, res, next) => {
    // Grabbing the courseId and lectureId from req.query
    const { courseId, lectureId } = req.query;
  
    console.log(courseId);
  
    // Checking if both courseId and lectureId are present
    if (!courseId) {
      return next(new ApiError(400 , 'Course ID is required'));
    }
  
    if (!lectureId) {
      return next(new ApiError(400 , 'Lecture ID is required'));
    }
  
    // Find the course uding the courseId
    const course = await Course.findById(courseId);
  
    // If no course send custom message
    if (!course) {
      return next(new ApiError(404 , 'Invalid ID or Course does not exist.'));
    }
  
    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
      (lecture) => lecture._id.toString() === lectureId.toString()
    );
  
    // If returned index is -1 then send error as mentioned below
    if (lectureIndex === -1) {
      return next(new ApiError( 404,'Lecture does not exist.'));
    }
  
    // Delete the lecture from cloudinary
    await cloudinary.v2.uploader.destroy(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: 'video',
      }
    );
  
    // Remove the lecture from the array
    course.lectures.splice(lectureIndex, 1);
  
    // update the number of lectures based on lectres array length
    course.numbersOfLectures = course.lectures.length;
  
    // Save the course object
    await course.save();
  
    // Return response
    res.status(200).json({
      success: true,
      message: 'Course lecture removed successfully',
    });
  });

  const addComment = asyncHandler(async (req, res, next) => {
    const { courseId, lectureId } = req.query;
    const { user, text, date } = req.body;
    if (!courseId || !lectureId) {
      return next(new ApiError(400, "Course ID and Lecture ID are required"));
    }
    
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return next(new ApiError(404, "Course not found"));
      }
      
      let lectureFound = false;
      course.lectures = course.lectures.map((lecture) => {
        if (lecture._id.toString() === lectureId) {
          lectureFound = true;
          console.log('Found lecture ',lecture);
          if (!lecture.lecture.comments) lecture.lecture.comments = [];
          lecture.lecture.comments.push({ user, text, date });
        }
        return lecture;
      });
      
      if (!lectureFound) {
        return next(new ApiError(404, "Lecture not found"));
      }
      console.log('CLec',course.lectures);
      // return res.json("test") ; 
      await course.save();
  
      return res.status(200).json(new ApiResponse(200, course.lectures, 'Comment added'));
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "Failed to add comment"));
    }
  });

  const deleteComment = asyncHandler(async (req,res,next) => {
    const { courseId, lectureId ,commentId } = req.query;

     const course = await Course.findById(courseId) ; 
     
     if(!course) return  next(new ApiError(400,'Course not found'))
     try {
      course.lectures.map(lecture => {
         
       if(lecture._id.toString() == lectureId){
          lecture.lecture.comments  = lecture.lecture.comments.filter(comment => comment._id.toString() != commentId) ; 
        console.log(lecture.lecture.comments)
       }
       
       return lecture ; 
      })
      await course.save() ; 
      return res.status(200).json(new ApiResponse(200,course.lectures,'Comment Deleted')) ; 
     } catch (error) {
       return next(new ApiError(400,error?.message)) ; 
     }

  })
  

export {
    getAllCourses , 
    getLecturesByCourseId , 
    createCourse ,
    updateCourse , 
    removeCourse , 
    addLectureToCourseById,
    removeLectureById , 
    addComment , 
    deleteComment
}