import Router from 'express';
import { handleUserLogin,
         handleUserSignUp,
          }   from '../controllers/user.controllers.js';

const userRoutes = Router();


userRoutes.get('user-login' , handleUserLogin);
userRoutes.post('student-signup' , handleUserSignUp);

export default userRoutes;
