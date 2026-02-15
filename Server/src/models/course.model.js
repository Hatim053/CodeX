import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({

    instructorId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Instructor',
    },
    videos : {
        type : Array,  // array of objects
        default : [],
     },
    price : {
        type : Number,
        required : true,
    },
    reveiws : {
        type : Array,
        default : [],
    },
    title : {
        type : String,
        required : true,
    },
    category : {
        trpe : String,
        enum : ['Web Development' , 'Data Structure And Algorithmn' , 'Data-Science' , 'Ai And Machine Learning'],
    },
    description : {
        type : String,
    },
    sales : {
        type : Number,
        default : 0,
    }

} , { timestamps : true });

const course = mongoose.model('Course' , courseSchema);

export default course;