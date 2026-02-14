import mongoose from "mongoose";


const instructorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
      type : String,
      required : true,
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course',
        }
    ],
    about : {
        type : String,
    }
} , { timestamps : true });

const instructor = mongoose.model('Instructor' , instructorSchema);

export default instructor;