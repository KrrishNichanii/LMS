import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Razorpay from 'razorpay' ; 
import crypto from 'crypto' ; 
import Payment from "../models/payment.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_SECRET
})


const getRazorpayApiKey = asyncHandler(async (req,res) => {
    // console.log('Key test');
    res.status(200).json(new ApiResponse(200 ,{
        key: process.env.RAZORPAY_KEY_ID
    },'Razorpay API key'))
} )


const buySubscription = asyncHandler(async (req,res,next) => {
    const { id } = req.user ;
    // console.log('Sub test');
    const user = await User.findById(id) ; 

    if(!user) {
        return next(new ApiError(400 , 'Unauthorized , please login')) ; 
    }

    if(user.role === 'ADMIN'){
        return next(new ApiError(400,'Admin cannot purchase a subscription')) ;
    }

    console.log('Sub id ');
    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID , 
        customer_notify: 1 ,
        total_count: 12, 
    })
    user.subscription.id = subscription.id ;
    user.subscription.status = subscription.status ; 

    await user.save() ; 

    res.status(200).json(new ApiResponse(200,{sub_id : subscription.id},'Subscribed successfully'))
})

const verifySubscription = asyncHandler(async (req,res,next) => {
    const { id } = req.user ; 
    const {razorpay_payment_id , razorpay_signature,razorpay_subscription_id} = req.body ; 
    
    const user = await User.findById(id) ; 

    if(!user){
        return next(new ApiError(400 , 'Unauthorized , please login'))
    }

    const subscriptionId = user.subscription.id ; 
    // console.log('Sub id from user model ',subscriptionId);
    // console.log('Sub id from req.body' , razorpay_subscription_id);
    const generatedSignature = crypto
                                  .createHmac('sha256',process.env.RAZORPAY_SECRET)
                                  .update(`${razorpay_payment_id}|${subscriptionId}`)
                                  .digest('hex') ; 
    console.log('Gen sig ',generatedSignature);
    console.log('Gen sig ',razorpay_signature);
    if(generatedSignature !== razorpay_signature){
        return next(new ApiError(500,'Payment not verified ,please try again'))
    }  
    
    await Payment.create({
        razorpay_payment_id , 
        razorpay_signature ,
        razorpay_subscription_id
    })
    
    user.subscription.status = 'active' ; 
    console.log('User sub ',user.subscription);
    await user.save();

    res.status(200).json(new ApiResponse(200 , {},'Payment verified successfully')) ; 
}) 

const cancelSubscription = asyncHandler(async (req,res,next) => {
    try {
        const { id } = req.user ; 
        
        const user = await User.findById(id) ; 
    
         if(!user) {
            return next(new ApiError(400 , 'Unauthorized , please login')) ; 
        }
    
        if(user.role === 'ADMIN'){
            return next(new ApiError(400,'Admin cannot purchase a subscription')) ;
        }
    
        const subscriptionId = user.subscription.id ; 
        console.log('S ID ',user.subscription.id);
        const subscription = await razorpay.subscriptions.cancel(subscriptionId) ; 
        user.subscription.status = subscription.status ;  
    
        await user.save() ;
          // Finding the payment using the subscription ID
      const payment = await Payment.findOne({
        razorpay_subscription_id: subscriptionId,
      });

      // Getting the time from the date of successful payment (in milliseconds)
      const timeSinceSubscribed = Date.now() - payment.createdAt;

      // refund period which in our case is 14 days
      const refundPeriod = 14 * 24 * 60 * 60 * 1000;

      // Check if refund period has expired or not
      if (refundPeriod <= timeSinceSubscribed) {
        return next(
          new ApiError(
            400 , 
            'Refund period is over, so there will not be any refunds provided.',
          )
        );
      }

      // If refund period is valid then refund the full amount that the user has paid
      await razorpay.payments.refund(payment.razorpay_payment_id, {
        speed: 'optimum', // This is required
      });

      user.subscription.id = undefined; // Remove the subscription ID from user DB
      user.subscription.status = undefined; // Change the subscription Status in user DB

      await user.save();
      await payment.remove();

      // Send the response
      res.status(200).json({
        success: true,
        message: 'Subscription canceled successfully',
      });
    } catch (error) {
         console.log(error);
         return next(new ApiError(500 ,error.message)) ;
    }
})

const allPayments = asyncHandler(async (req, res, _next) => {
    const { count, skip } = req.query;
  
    // Find all subscriptions from razorpay
    const allPayments = await razorpay.subscriptions.all({
      count: count ? count : 10, // If count is sent then use that else default to 10
      skip: skip ? skip : 0, // // If skip is sent then use that else default to 0
    });
  
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    const finalMonths = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };
  
    const monthlyWisePayments = allPayments.items.map((payment) => {
      // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
      const monthsInNumbers = new Date(payment.start_at * 1000);
  
      return monthNames[monthsInNumbers.getMonth()];
    });
  
    monthlyWisePayments.map((month) => {
      Object.keys(finalMonths).forEach((objMonth) => {
        if (month === objMonth) {
          finalMonths[month] += 1;
        }
      });
    });
  
    const monthlySalesRecord = [];
  
    Object.keys(finalMonths).forEach((monthName) => {
      monthlySalesRecord.push(finalMonths[monthName]);
    });
  
    res.status(200).json({
      success: true,
      message: 'All payments',
      allPayments,
      finalMonths,
      monthlySalesRecord,
    });
  });

export {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments
}