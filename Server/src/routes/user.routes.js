import Router from 'express';
import { handleUserLogin,
         handleUserSignUp,
         handleInstructorAccountSignUp,
         handleInstructorAccountSwitch,
          }   from '../controllers/user.controllers.js';

const userRoutes = Router();


userRoutes.get('user-login' , handleUserLogin);
userRoutes.post('student-signup' , handleUserSignUp);
userRoutes.post('instructor-signup' , handleInstructorAccountSignUp);
userRoutes.post('instructor-login' , handleInstructorAccountSwitch);


export default userRoutes;
