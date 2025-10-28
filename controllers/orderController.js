


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay"


//global variables
const currency = 'INR'
const deliveryCharge = 10

const razorpayInstance = new razorpay({
     key_id : process.env.Razorpay_KEY_ID,
     key_secret: process.env.Razorpay_KEY_SECRET
})

// placing order using cash on delivery mehtod
const placeOrder = async (req , res) => {
    try {
          const {userId,items,amount,address} = req.body;
          const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment: false,
            date:Date.now()
          }
        
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        //after order is placed and we have save it so after it we will clear the data 
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        
        res.json({success:true,message:"Order Placed"})


    } catch (error ) {
          console.log(error)
          res.json({success:false,message:error.message})
    }
}


// placing order using razorpay
const placeOrderRazorpay  = async (req,res) => {
        try {
             const{userId,items,amount,address} = req.body;
             
             const orderData = {
                userId,
                items,
                address,
                amount,
                paymentMethod:"Razorpay",
                payment:false,
                date:Date.now()
             }
             const newOrder = new orderModel(orderData)
             await newOrder.save()

             const options = {
                amount: amount*100,
                currency: currency,
                receipt: newOrder._id.toString()

             }

            //  await razorpayInstance.orders.create(options,(error,orders)=>{
            //     if(error){
            //         console.log(error)
            //         return res.json({success:false, message:error})
            //     }
            //     res.json({success:true,order})
            //  })
            const order = await razorpayInstance.orders.create(options);
            console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);

             res.json({ success: true, order });

        } catch (error) {
             console.log(error)
             res.json({success:false,message:error.message})
        }
}

const verifyRazorpay = async(req,res)=>{
     try {
         const {userId, razorpay_order_id} = req.body

         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
         if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true, message:"payment successful"})
         }else{
            res.json({success:false, message:"payment failed"})
         }
     } catch (error) {
           console.log(error)
          res.json({success:false,message:error.message})
       
     }
}

//All orders data for admin panel
const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
         console.log(error)
          res.json({success:false,message:error.message})
    }
}


//user order data for frontend
const userOrders = async (req,res) => {
    try {
          const {userId} = req.body

          const orders = await orderModel.find({userId})
          res.json({success:true,orders})
    } catch (error) {
            console.log(error)
          res.json({success:false,message:error.message})
    }
}

//update order status from admin panel
const updateStatus = async (req,res) =>{
       try {
           const {orderId,status} = req.body
           

           await orderModel.findByIdAndUpdate(orderId,{status})
           res.json({success:true,message:'Status Updated'})
          
       } catch (error) {
             console.log(error)
          res.json({success:false,message:error.message})
       }
}


export {verifyRazorpay,placeOrder,placeOrderRazorpay,allOrders,userOrders,updateStatus}