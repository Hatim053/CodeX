import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/user.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: '16kb' }))
const corsOptions = {
    origin: process.env.CLIENT_SIDE_BASE_URL,
    methods: 'GET , POST , DELETE',
};
app.use(cors(corsOptions));


app.use('/user' , userRoutes);

export {
    app
}