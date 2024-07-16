import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan  from 'morgan'
import userRouter from './routes/user.routes.js'
import errorMiddleware from './middlewares/error.middleware.js'
import courseRouter from './routes/course.routes.js'
import paymentRouter from './routes/payment.routes.js'
import miscRouter from './routes/miscellaneous.routes.js'

const app = express() ; 


//middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
})) ; 



app.use(express.json({limit:"32kb"})) ; 
app.use(express.urlencoded({extended:true ,limit: "32kb"})) ; 
app.use(express.static("public")) ; 
app.use(cookieParser()) ; 
app.use(morgan('dev')) ; 
app.use('/ping',(req,res) => {
    res.send('Pong')
})


//routes
app.use('/user',userRouter)
app.use('/courses',courseRouter)
app.use('/payments',paymentRouter)
app.use('/', miscRouter);
app.use(errorMiddleware) ; 

app.all('*', (req,res) => {
    res.status(404).send('OOPS !! 404 page not found')
})


export { app }