
import express from 'express'
import {placeOrder,placeOrderRazorpay,allOrders,userOrders,updateStatus, verifyRazorpay} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminauth.js'
import authUser from '../middleware/authUser.js'

const orderRouter = express.Router()


//Admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//Payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

//user features
orderRouter.post('/userOrders',authUser,userOrders)

//verify payment
orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

export default orderRouter