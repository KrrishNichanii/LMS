import dotenv from 'dotenv'
import connectDB from "./db/db.js";
import { app } from './app.js';

dotenv.config({
    path: './env'
})
const PORT = process.env.PORT || 8000

connectDB()
.then(() => {
    app.listen(PORT ,() => {
        console.log(`Server running at port : ${PORT}`);
    })
})
.catch((e) => {
    console.log('MongoDB connection failed !!!',e);
})