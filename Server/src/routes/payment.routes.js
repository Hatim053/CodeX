import {Router} from 'express';
import { 
    handleFailedTransaction,
    handleGenerateOrderId,
    handleValidateAndSaveTransaction,
    handlleFetchStudentTransactions,
 } from '../controllers/payment.controller.js';

const paymentRoutes = Router();

paymentRoutes.post('/create-order' , handleGenerateOrderId);
paymentRoutes.post('/validate-transaction' , handleValidateAndSaveTransaction);
paymentRoutes.post('/failed-payment' ,handleFailedTransaction);
paymentRoutes.get('/student-transaction-history' , handlleFetchStudentTransactions);

export default paymentRoutes;