import mongoose from "mongoose";
import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";
 

export  const postCartData=async(req,res)=>{
    try {
      
        const { pid,userid } =req.body; 
        const user=await userModel.findById(userid);
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "User not found",
          });
        } 
        user.productId.push(pid);
        await user.save();
          return res.status(200).send({
            success: true,
            message: "Cart added successfully",
           
          });
        
         
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in adding cart",
          });
    }

} 

export const getCartData=async(req,res)=>{
    try {
      const {userid}=req.query;
       const user = await userModel.findById(userid)
       if (!user) {
        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    }
    const carts = user.productId;
      return res.status(200).send({
        success: true,
         carts 
      });
       
    }catch (error) {
      return res.status(500).send({
          success: false,
          message: "Error in getting cart",
        });
}
}

export const deleteCartData=async(req,res)=>{

  try {
    const {userid,pid}=req.body;
    if (userid && pid) {
      await userModel.findByIdAndUpdate(
        userid,
        {
          $pull: {
            productId: pid,
          },
        },
        { new: true }
      );
    }else{
      console.log("invalid data")
    }
   
    return res.status(200).send({
      success: true,
      message: "Cart deleted successfully",
      
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in addind cart",
    });
  }
}


export const multipleDelete=async(req,res)=>{
  const {userid,cartIdsToDelete}=req.body;
  try {
    await cartModel.deleteMany({ _id: { $in: cartIdsToDelete } })
    await userModel.findByIdAndUpdate(userid, { $pull: { carts: { $in: cartIdsToDelete } } }, { new: true })
   

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in addind cart",
    });
  }
}

export const incrementDecrementCount=async(req,res)=>{
  const {cartid,Newcount}=req.body;
  try {
    await cartModel.updateOne({ _id: cartid }, { $set: { count: Newcount } });
    return res.status(200).send({
      success: true,
      message: "Cart count updated",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in  cart",
    });
  }
}