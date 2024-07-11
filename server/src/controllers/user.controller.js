import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'

const domain = process.env.FRONTEND_URL || 'https://lms-frontend-7kkl68otv-krrish-nichaniis-projects.vercel.app';


const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    origin:process.env.FRONTEND_URL
  };

const register = asyncHandler(async (req,res,next) => {
    const {fullName , email , password} = req.body ; 
    if(!fullName || !email || !password){
        return  next(ApiError(400 ,'All fields are required')) ; 
    }

    const userExists = await User.findOne({email}) ;

    if(userExists){
        return  next(new ApiError(400 , 'Email already exists'))
    }

    const user = await User.create({
        fullName , 
        email , 
        password , 
        avatar : {
            public_id: email
        } , 
        subscription  : {
            
        }
    })

    if(!user){
        throw new ApiError(400 , 'User registration failed , please try again')
    }
    console.log('Req file ',req);
    const avatarLocalPath = req.file?.path
    if(req.file){
        console.log('Req.file ',req.file);
        try {
            const avatar = await uploadOnCloudinary(avatarLocalPath)
           console.log('Avatar ',avatar);
           if(avatar){
            user.avatar.public_id = avatar.public_id ; 
            user.avatar.secure_url = avatar.secure_url ; 
           }
        } catch (error) {
            console.log('Avatar upload ERROR !!',error);
            throw new ApiError(400 , 'Unable to upload avatar') ;
            return  ; 
        }
    }
    

    await user.save() ; 

    user.password = undefined ; 

    const token = await user.generateJWTToken() ; 
    

    res.cookie('token' ,token , cookieOptions) ; 
    return res.status(200).json(new ApiResponse(200,user,'User created successfully'))
})

const login = asyncHandler(async (req,res) => {
    const { email , password} = req.body ; 

    if(!email || !password) {
        throw new ApiError(400 , 'All fields are required')
    }

    const user = await User.findOne({
        email
    }).select('+password') ; 

    if(!user){
        throw new ApiError(400,'No such user exists') ; 
    }

    if(!(await user.isPasswordCorrect(password))){
        throw new ApiError(400 , 'Incorrect credentials') ; 
    }
    
    const token = await user.generateJWTToken() ; 
    user.password = undefined ; 

    res.cookie('token' , token , cookieOptions) ; 
    console.log('Sending token ',token);
    return res.status(201).json(new ApiResponse(200 ,user , 'User logged in successfully'))
})

const logout = asyncHandler(async (req,res) => {
    res
      .status(200)
      .clearCookie('token',cookieOptions)
      .json(new ApiResponse(200 , {},'User logged out successfully'))
})

const getUser = asyncHandler(async (req,res) => {
    const userId = req.user.id ; 

    const user = await User.findById(userId) ; 

    res.status(200).json(new ApiResponse(200,user,'User details')) ; 
})

const forgotPassword = asyncHandler(async (req,res) => {
    const { email } = req.body ; 

    if(!email){
        throw new ApiError(400 , 'Email is required') ; 
    }

    const user = await User.findOne({email}) ; 

    if(!user){
        throw new ApiError(400,'Email not registered') ;
    }

    const resetToken = await user.generatePasswordResetToken() ; 
    
    await user.save() ; 

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    console.log('Message ',resetPasswordURL);
    const message = `${resetPasswordURL}`
    const subject = 'Reset Password' ; 
    try {
        await sendEmail(email , subject , message) ; 

        res.status(200).json(new ApiResponse(200 , {},`Reset password token has been sent to ${email} successfully`)) ; 

    } catch (error) {
        user.forgotPasswordExpiry = undefined ; 
        user.forgotPasswordToken = undefined ; 

        await user.save() ;

        throw new ApiError(400 ,'Unable to send email') ; 
    }
}
) ;

const resetPassword = asyncHandler(async (req,res) => {
    const { resetToken } = req.params ; 

    const { password } = req.body ; 
     
    if(!password){
        throw new ApiError(400 , 'Password is required') ; 
    }


    const forgotPasswordToken = crypto
                                   .createHash('sha256')
                                   .update(resetToken)
                                   .digest('hex') ; 
    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    }) ;

    if(!user){
        throw new ApiError(400,'Token is invalid or expired ,please try again ')
    }

    user.password = password ; 
    user.forgotPasswordExpiry = undefined ;
    user.forgotPasswordToken = undefined ; 

    user.save() ; 

    res.status(200).json(new ApiResponse(200 , 'Password changed successfully')) ; 
}) ;

const changePassword = asyncHandler(async (req,res) => {
    const { oldPassword,newPassword } = req.body ; 
    
    const { id } = req.user ; 

    if(!oldPassword || !newPassword){
        throw new ApiError(400 , 'All fields are required') ; 
    }

    const user = await User.findById(id).select('+password') ; 
    

    if(!user){
        throw new ApiError(400 , 'User does not exist') ; 
    }

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword) ;

    if(!isPasswordCorrect){
        throw new ApiError(400 , 'Invalid old password')
    }

    user.password = newPassword ; 
    await user.save() ; 
    user.password = undefined ; 
    res.status(200).json(new ApiResponse(200 , 'Password changed successfully')) ; 
})

const updateUser = asyncHandler(async (req,res) => {
    const { fullName } = req.body ; 
    const { id } = req.user ; 
    const user = await User.findById(id) ; 
    //console.log('Body ',req.body);
    if(!user){
        throw new ApiError(400,'User does not exist') ; 
    }

    if(fullName){
        user.fullName = fullName ;
    }
    // console.log('Fullname',fullName);
    // console.log('File',req.file);

    if(req.file){
        await deleteFromCloudinary(user.avatar.public_id) ; 
        try {
            const avatar = await uploadOnCloudinary(req.file.path)
           //console.log('Avatar ',avatar);
           if(avatar){
            user.avatar.public_id = avatar.public_id ; 
            user.avatar.secure_url = avatar.secure_url ; 
           }
        } catch (error) {
            console.log('Avatar upload ERROR !!',error);
            throw new ApiError(400 , 'Unable to upload avatar') ;
            return  ; 
        }
    }

    await user.save() ; 
    user.password = undefined ; 
     //console.log('Updated user ',user);
    res.status(200).json(new ApiResponse(200 ,user,'Profile updated successfully')) ; 
})


export {
    register , 
    login , 
    logout , 
    getUser,
    forgotPassword,
    resetPassword,
    changePassword ,
    updateUser
}