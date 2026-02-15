import mongoose from 'mongoose';
import student from '../models/student.model.js';
import instructor from '../models/instructor.model.js';
import { handleCreateInstructorRazorpayContact } from '../controllers/payment.controller.js'

const cookieOptions = {
    httpOnly : true,
    secure : true,
    sameSite : 'strict',
}

async function handleUserLogin(req, res) {
    const { email , token } = req.body;
    if (!email || ! token) {
        return res
            .status(404)
            .json({
                message: 'email required for login',
            });
    }
    const studentAccount = await student.findOne({email : email});
    return res
    .status(200)
    .cookie('accessToken' , token , cookieOptions)
    .json({
        message : 'student loggedIn successfully',
        studentAccount : studentAccount,
    })
  
    // auth has been done at the client side set the cookies only
}

async function handleUserSignUp(req, res) {
    const { email } = req.body;
    if (!email) {
        return res
            .status(404)
            .json({
                message: 'email required for signup',
            });
    }

    const createdStudentAccount = await student.create({
        email: email,
    });
    if (!createdStudentAccount) {
        return res
            .status(501)
            .json({
                message: 'failed to create user',
            })
    }
    return res
        .status(201)
        .json({
            message: 'user signup sucessfully',
        })

}

async function handleInstructorAccountSignUp(req , res) {
    try {
        const {name , about , contact} = req.body;
        const {email} = req.user; // before this run authentication middleware
        if(!name || ! about || !contact) {
            return res
            .status(404)
            .json({
                message : 'all the fields are required',
            })
        }
        const contactId = await handleCreateInstructorRazorpayContact(name , email , contact);
        const createdInstructorAccount = await instructor.create({
            name : name,
            email : email,
            about : about,
            contact : contact,
            razorpayContactId : contactId,
        });
        
        if(! createdInstructorAccount) {
            return res
            .status(501)
            .json({
                message : 'something went wrong',
            })
        }
        return res
        .status(201)
        .json({
            message : 'instructor account created successfully',
        })
    } catch (error) {
        console.log('something went wrong' , error);
    }
}

async function handleInstructorAccountSwitch(req , res) {
    const { email } = req.user; // run middleware before hitting this route
    const instructorAccount = await instructor.findOne({email : email});
    if(! instructorAccount) {
        return res
        .status(501)
        .json({
            message : 'something went wrong',
        })
    }
    return res
    .status(200)
    .json({
        message : 'account switched successfully',
        instructorAccount : instructorAccount,
    })
}

export {
    handleUserLogin,
    handleUserSignUp,
    handleInstructorAccountSignUp,
    handleInstructorAccountSwitch
}