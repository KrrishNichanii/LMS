import dotenv from 'dotenv'
import connectDB from "./db/db.js";
import { app } from './app.js';

dotenv.config({
    path: './env'
})


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server running at port : ${process.env.PORT}`);
    })
})
.catch((e) => {
    console.log('MongoDB connection failed !!!',e);
})