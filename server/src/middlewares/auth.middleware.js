import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { ApiResponse } from "../utils/ApiResponse.js";

const isLoggedIn = async (req,res,next) => {
    const {token} = req.cookies ; 
    if(!token){
        return next(new ApiError(400 , 'Unauthenticated ,please login to continue'))
    }
    try {
        
        const userDetails = await  jwt.verify(token , process.env.TOKEN_SECRET)
        req.user = userDetails ; 
    } catch (error) {
        return next(new ApiError(400,'Session expired login again')) ; 
    }
     
    next() ; 
}

const authorizedRoles = (...roles) => async (req,res,next) => {
    const currentUserRoles = req.user.role ; 

    if(!roles.includes(currentUserRoles)){
        return next(new ApiError(403 , 'You do not have permission to access this route'))
    }
    next() ; 
}

const authorizedSubScriber = async (req,res,next) => { 
    const user = await User.findById(req.user.id) ;

    if(user.role != 'ADMIN' && user.subscription.status !== 'active'){ 
        return next(new ApiError(403 , 'Please subscribe to access this route'))
   }
   next() ;
}

export { isLoggedIn , authorizedRoles , authorizedSubScriber}