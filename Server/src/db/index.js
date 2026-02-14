import mongoose from "mongoose";


async function ConnectDB(url) {
try {
    const response = await mongoose.connect(url);
    // console.log('data base connection successful' , response);
} catch (error) {
    console.log('data base connection failed' , error);
}
}

export {
    ConnectDB
}