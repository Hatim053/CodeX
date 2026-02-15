import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Payment from "../models/payment.model.js";
import course from '../models/course.model.js';
import instructor from '../models/instructor.model.js';
import { json } from 'stream/consumers';
import instructor from '../models/instructor.model.js';
import instructor from '../models/instructor.model.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
const auth = Buffer.from(`${process.env.RAZORPAY_API_KEY}:${process.env.RAZORPAY_API_SECRET}`).toString('base64');

async function handleGenerateOrderId(req, res) {
  var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET })
  const { amount, currency } = req.body
  var options = {
    amount,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency,
    receipt: uuidv4()
  };
  await instance.orders.create(options, function (err, order) {
    console.log(order)
    return res
      .status(200)
      .json(order)
  });



}

async function handleValidateAndSaveTransaction(req, res) {

  //  console.log("Headers:", req.headers);
  // console.log("Body type:", typeof req.body);
  // console.log("Raw body:", req.body);

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, items } = req.body;
  const { studentId } = req.user._id;
  const sha = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)

  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)

  const digest = sha.digest('hex')

  let status;
  if (digest !== razorpay_signature) {
    console.log("❌ Invalid signature");
    status = "failed";
  }

  // Step 2: Capture Payment
  let captureResponse;
  try {
    captureResponse = await razorpay.payments.capture(
      razorpay_payment_id,
      amount,
      "INR"
    );
  } catch (err) {
    console.error("❌ Razorpay capture failed:", err);
    status = "pending"; // still authorized but not captured
  }

  // Step 3: Determine final status
  status = captureResponse?.status === "captured" ? "success" : "pending";

  const payment = await Payment.create({
    transaction_id: razorpay_payment_id,
    status,
    amount: amount / 100,
    payment_for: items,
    studentId: studentId,
    transactionDate: new Date().toLocaleDateString()
  })
  if (Array.isArray(items)) {
    for (const item of items) {
      // each item is _id of the course so loop over it and update each course sales by one
      const purchasedCourse = await course.updateOne({ _id: item }, {
        $inc: { sales: 1 }
      });
    }
  }


  return res
    .status(201)
    .json({
      message: 'transaction recorded succesfully in the database'
    })

}

async function handleFailedTransaction(req, res) {
  const { razorpay_payment_id, amount } = req.body;
  const { studentId } = req.user._id;
  const payment = await Payment.create({
    transaction_id: razorpay_payment_id,
    status,
    amount: amount / 100,
    payment_for: items,
    studentId: studentId,
    transactionDate: new Date().toLocaleDateString()
  })


  if (payment) console.log(payment)
  else console.log('document not formed')

  return res
    .status(201)
    .json({
      message: 'failed transaction recorded in the data base',
    })

}

async function handlleFetchStudentTransactions(req, res) {
  const studentId = req.user._id;

  const transactions = await Payment.find({
    studentId: studentId,
  })

  return res
    .status(200)
    .json({
      status: 200,
      message: 'Transactional History Fetched Successfully',
      transactions,
    })
}

async function handleCreateInstructorRazorpayContact(name, email, contact) {
  try {
    const contact = await fetch('https://api.razorpay.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        name: name,
        email: email,
        contact: contact,
        type: "instructor",
        reference_id: "Acme Contact ID 12345",
        notes: {}
      })
    });
    const contactResponse = contact.json();
    const contactId = contactResponse.id;
    console.log(contactId);
    return contactId;

  } catch (error) {
    console.log('something went wrong while creating rzorpay contact', error);
  }
}

async function handleCreateInstructorRazorpayFundAccount(req, res) {
  const { accountNumber, bankingName, ifsc } = req?.body;
  const { contactId } = req?.user;
  if (!accountNumber || !bankingName || !ifsc) {
    return res
      .status(404)
      .json({
        message: 'all bank details are required',
      })
  }
  try {
    const fundAccount = await fetch('https://api.razorpay.com/v1/fund_accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        "contact_id": contactId,
        "account_type": "bank_account",
        "bank_account": {
          "name": bankingName,
          "ifsc": ifsc,
          "account_number": accountNumber
        }
      })
    })
    const fundAccountResponse = await fundAccount.json();
    const funcAccountId = fundAccountResponse.id;
    const instructor = await instructor.findByIdAndUpdate(req?.user?._id,
      { razorpayFundAccountId: funcAccountId, accountNumber: accountNumber },
      { new: true }
    );
    return res
      .status(201)
      .json({
        message: 'bank details updated successfully',
      })
  } catch (error) {
    console.log('something went wrong while create razorpay fund account');
  }
}

async function handlePayoutToInstructor(req, res) {
  const {accountNumber , razorpayFundAccountId} = req?.user;
  const {amount} = req?.body;
  try {
    const payout = await fetch('https://api.razorpay.com/v1/payouts', {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Basic ${auth}`
      },
      body: JSON.stringify({
        "account_number": accountNumber,
        "fund_account_id": razorpayFundAccountId,
        "amount": amount,
        "currency": "INR",
        "mode": "IMPS",
        "purpose": "withdraw",
        "queue_if_low_balance": true,
        "reference_id": "Acme Transaction ID 12345",
        "narration": "Acme Corp Fund Transfer",
        "notes": {
          "notes_key_1": "Tea, Earl Grey, Hot",
          "notes_key_2": "Tea, Earl Grey… decaf."
        }
    })
    });
    const payoutResponse = await payout.json();
    return res
    .status(200)
    .json({
      message : 'payout successfully',
      payoutId : payoutResponse.id,
    })

  } catch (error) {
    console.log('something went wrong', error)
  }
}

async function handleFetchInstructorTransactions(req , res) {
  const {accountNumber} = req?.user;
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payouts?account_number=${accountNumber}` , {
      method : 'GET',
      headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Basic ${auth}`
      },
    });
    const jsonResponse = await response.json();
    const transactions = jsonResponse?.items;
    return res
    .status(200)
    .json({
      message : 'transactions fetched successfully',
      transactions : transactions,
    })
  } catch (error) {
    console.log('something went wrong' , error);
  }
}

export {
  handleFailedTransaction,
  handleGenerateOrderId,
  handleValidateAndSaveTransaction,
  handlleFetchStudentTransactions,
  handleCreateInstructorRazorpayContact,
  handleCreateInstructorRazorpayFundAccount,
  handlePayoutToInstructor,
  handleFetchInstructorTransactions,
}