
import express from "express"
import upload from "../middleware/multer.js";
import {listProducts,addProducts,removeProducts,singleProducts}  from '../controllers/productController.js'
import adminAuth from "../middleware/adminauth.js";

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProducts);
productRouter.post('/remove',removeProducts);
productRouter.post('/single',adminAuth,singleProducts);
productRouter.get('/list',listProducts);

export default productRouter