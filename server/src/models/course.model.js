import { Schema , model} from 'mongoose'

const courseSchema = new Schema({
    title: {
        type: String ,
        required:[true,'Title is required'] , 
        minLength:[8 ,'Title must be at least 8 characters'] ,
        maxLength: [59,'Title should be less than 60 characters'] 
    } ,
    description: {
        type: String , 
        required: [true ,'Description is required'] , 
        minLength:[8 ,'Title must be at least 8 characters'] ,
        maxLength: [200,'Title should be less than 200 characters'] 

    } ,
    category: {
        type: String , 
        required: [true ,'Category is required'] , 
         
    } ,
    lectures: [
        {
            title: String ,
            description: String ,
            lecture:{
                public_id: {
                    type:String ,
                    required: true , 
                } , 
                secure_url: {
                    type: String , 
                    required: true , 
                },
                comments: [
                    {
                      text: String,
                      user: String,
                      date: {
                        type: Date,
                        default: Date.now,
                      },
                    },
                  ],
            } , 
        }
    ] , 
    thumbnail: {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
      },
    paid: {
         type: String , 
         required:[true, 'Paid field is required'] , 
    },
    numbersOfLectures: {
        type: Number , 
        default:0 , 
    } , 
    createdBy: {
        type: String , 
        required: true 
    }
} , {
    timestamps : true
})


const Course = model('Course' , courseSchema) ; 

export default Course ; 