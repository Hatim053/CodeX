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
    contact : {
        type : Number,
        required : true,
    },
    razorpayContactId : {
        type : String,
    },
    razorpayFundAccountId : {
        type : String,
    },
    accountNumber : {
        type : Number,
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course',
        }
    ],
    about : {
        type : String,
        required : true,
    },
    wallet : {
        type : Number,
        default : 0,
    }
} , { timestamps : true });

const instructor = mongoose.model('Instructor' , instructorSchema);

export default instructor;