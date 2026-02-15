import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/user.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: '16kb' }));
app.use(cookieParser());
const corsOptions = {
    origin: process.env.CLIENT_SIDE_BASE_URL,
    methods: 'GET , POST , DELETE',
};
app.use(cors(corsOptions));


app.use('/user' , userRoutes);
app.use('/payment' , paymentRoutes);

export {
    app
}