
import {v2 as cloudinary} from "cloudinary"

import productModel from "../models/productModel.js";

//functions for adding the products
const addProducts = async(req , res)=>{
   try {
    console.log("adding products")
      const {name,description,price,category,subCategory,sizes,bestSeller} = req.body;
      const image1 = req.files.image1 && req.files.image1[0];
      const image2 = req.files.image2 &&req.files.image2[0];
      const image3 = req.files.image3 &&req.files.image3[0];
      const image4 = req.files.image4 &&req.files.image4[0];
      console.log("i am on the adding list")
      

      const images = [image1,image2,image3,image4].filter((item)=> item != undefined)

     let imagesUrl = await Promise.all(
        images.map(async(item)=>{
            let result = await cloudinary.uploader.upload(item.path,{resource_type:"image"});
            return result.secure_url
        })
     )
     console.log(typeof(imagesUrl));
     console.log(imagesUrl)

    //   console.log(name,description,price,category,subCategory,sizes,bestSeller)
    //   console.log(imagesUrl)
    console.log("shekhar")
    const productData = {
        name,
        description,
        category,
        price: Number(price),
        subCategory,
        bestSeller: bestSeller=== "true"?true: false,
        sizes: JSON.parse(sizes),
        images: imagesUrl,
        date: Date.now()

    }

    console.log(productData);
    const product = new productModel(productData)
    
    let a= await product.save();
    console.log(a);

    res.json({success:true,message:"Product Added"})

      // res.json({})
   } catch (error) {
    console.log("there is something in the error ")
        console.log(error); 
        res.json({success: false,message:error.message})
   }
}
//function for listing the products
const listProducts = async(req , res)=>{
    try {
        // await productModel.deleteMany({});
       const product = await productModel.find({});
        console.log(typeof((product)))
       console.log(product);
       res.json({success:true,product:product})
    } catch (error) {
        console.log(error); 
        res.json({success: false,message:error.message})
    }
}

//function for removing the products
const removeProducts = async(req , res)=>{
    try {
      await productModel.findByIdAndDelete(req.body.id)
      res.json({success:true,message:"PRODUCT  REMOVED"})

    } catch (error) {
         console.log(error); 
        res.json({success: false,message:error.message})
    }
}

//function for single  product info
const singleProducts = async(req , res)=>{
    try {
       const {productId} = req.body;
       const product = await  productModel.findById(productId)
       res.json({success:true,product})
    } catch (error) {
      console.log(error); 
        res.json({success: false,message:error.message})
    }
}

export {listProducts,addProducts,removeProducts,singleProducts}