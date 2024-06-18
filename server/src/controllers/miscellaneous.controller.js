import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

const contactUs = asyncHandler(async (req,res,next) => {
    const {name , email ,message} = req.body ;

    if(!name || !email || !message){
        return next(new ApiError(500,'Name, Email, Message are required')) ;
    }

    try {
        const subject = 'Contact Us Form' ; 
        const textMessage = `${name} - ${email} <br /> ${message}`;

        await sendEmail(process.env.CONTACT_US_EMAIL,subject,textMessage)
    } catch (error) {
        console.log(error);
        return next(new ApiError(400,error.message)) ; 
    }

    res.status(200).json(new ApiResponse(200,{},'Your request has been submitted successfully'));
})

const userStats = asyncHandler(async (req,res,next) => {
    const allUserCount = await User.countDocuments();

    const subscribedUsersCount = await User.countDocuments({
        'subscription.status' : 'active',
    })

    res.status(200).json(new ApiResponse(200,{allUserCount,subscribedUsersCount},'All registered users count'));
})

export {
    contactUs, 
    userStats
}