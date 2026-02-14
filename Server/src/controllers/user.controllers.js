import mongoose from 'mongoose';
import student from '../models/student.model.js';
import instructor from '../models/instructor.model.js';

async function handleUserLogin(req, res) {
    const { email , token } = req.body;
    if (!email || ! token) {
        return res
            .status(404)
            .json({
                message: 'email required for login',
            });
    }
  
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

    const createdUser = await student.create({
        email: email,
    });
    if (!createdUser) {
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


export {
    handleUserLogin,
    handleUserSignUp,
}