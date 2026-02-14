import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
name : {
    type : String,
},
email : {
    type : String,
    required : true,
},
courses_purchased : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course',
    }
],
certifications : {
    type : Array,
    default : [], // array of img urls of certifications
},
payment_history : [
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Payment',
    }
]
} , { timestamps : true });



const student = mongoose.model('Student' , studentSchema);

export default student;