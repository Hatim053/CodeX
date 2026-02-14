import 'dotenv/config';
import { app } from './app.js';
import { ConnectDB } from './src/db/index.js';
import { response } from 'express';



const url = process.env.MONGO_DB_URL;
const port = process.env.port

ConnectDB(url)
.then((response) => {
app.listen(port , () => {
    console.log('server is running on port , ' , port);
})
})
.catch((error) => {
    console.log(error);
});

