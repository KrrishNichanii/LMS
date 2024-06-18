import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema({
    fullName: {
        type: String ,
        required: [true , 'Name is required'],
        minLength: [5 , 'Name must be atleast 5 characters'],
        maxLength: [50,'Name should be less than 50 characters'] ,
        lowercase: true , 
        trim: true , 
    } ,
    email: {
        type: String ,
        required: [true,'Emai; is required'],
        lowercase: true , 
        unique: true , 
        trim: true ,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
           ,'Please fill in a valid email address']
    } ,
    password: {
        type: String ,
        required:[true,'Password is required'],
        minLength:[8,'Password must be at least 8 characters'],
        select: false  ,
    } ,
    subscription: {
        id: String,
        status: String,
      },
    avatar: {
        public_id: {
            type: String , 
        } ,
        secure_url: {
            type: String
        }
    } , 
    forgotPasswordToken: String , 
    forgotPasswordExpiry: Date , 
    subscription: {
        id: String , 
        status: String , 
    } , 
    role: {
        type: String , 
        enum: ['USER','ADMIN'],
        default: 'USER'
    }
} , {
    timestamps : true
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next() ; 
    this.password = await bcrypt.hash(this.password , 10) ;
    next() ;  
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(""+password , this.password) ; 
}

userSchema.methods.generateJWTToken = async function(){
    return await jwt.sign({
        id: this._id  , 
        email: this.email , 
        subscription: this.subscription , 
        role: this.role , 
    } ,
    process.env.TOKEN_SECRET ,
     {
        expiresIn: process.env.TOKEN_EXPIRY ,
     }
)
}

userSchema.methods.generatePasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(20).toString('hex') ;

    this.forgotPasswordToken = crypto
                                   .createHash('sha256')
                                   .update(resetToken)
                                   .digest('hex') ; 
    this.forgotPasswordExpiry = Date.now() + 15*60*1000 ; 
    return resetToken ; 
}

const User = model('User',userSchema) ;

export default User ; 