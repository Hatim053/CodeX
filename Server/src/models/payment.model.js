import mongoose from 'mongoose';
import { type } from 'os';

const paymentSchema = new mongoose.Schema({
    transaction_id : { 
        type : String,
        required : true,
    },
    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
    },
    amount : {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        required : true,
        enum : ['success' , 'failed' , 'pending'],
    },
    payment_for : [
    {
     type : mongoose.Schema.Types.ObjectId,
     ref : 'Course',   
    }
    ],
    transactionDate : {
        type : String,
        required : true,
    }
} , { timestamps : true });

const payment = mongoose.model('Payment' , paymentSchema);


export default payment;