import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    transaction_id : { 
        type : String,
        required : true,
    },
    amount : {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        required : true,
        enum : ['Sucess' , 'Failed' , 'Pending'],
    },
    payment_for : {
     type : mongoose.Schema.Types.ObjectId,
     ref : 'Course',   
    }
} , { timestamps : true });

const payment = mongoose.model('Payment' , paymentSchema);


export default payment;