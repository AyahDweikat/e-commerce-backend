import moment from 'moment';
import couponModel from './../../../../DB/model/Coupon.model.js';
import productModel from './../../../../DB/model/Product.model.js';
import orderModel from '../../../../DB/model/Order.model.js';
import cartModel from '../../../../DB/model/Cart.model.js';
import { createInvoiceFromOrder } from '../../../Services/orderInvoice.js';
export const addOrder = async(req, res, next)=>{
    const {products, address, phoneNumber, couponName, paymentType} = req.body
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName})
        if(!coupon){
            return next(new Error(`Invalid Coupon ${couponName}`, {cause:400}))
        }
        let now = moment()
        let parsed = moment(coupon.expireDate)
        let difference = parsed.diff(now, 'days')
        if(difference <= 0){
          return next(new Error(`Coupon is expired`, {cause:400}))
        }
        if(coupon.usedBy.includes(req.user._id)){
          return next(new Error(`Coupon is already used by user`, {cause:400}))
        }
        req.body.coupon = coupon;
    }
    const finalProductList =[];
    let subTotal= 0;
    const productIds= []
    for(let product of products){
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock:{$gte:product.qty},
            isDeleted:false
        })
        if(!checkProduct){
          continue;
        }
        product.name = checkProduct.name;
        product.description = checkProduct.description;
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = checkProduct.finalPrice * product.qty;
        subTotal += product.finalPrice;
        productIds.push(product.productId)
        finalProductList.push(product)
    }
    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProductList,
        address,
        phoneNumber,
        paymentType,
        subTotal,
        finalPrice: subTotal,
        couponId: req.body.coupon?._id,
        finalPrice: subTotal * (1 - ((req.body.coupon?.amount |0)/100)),
        status: (paymentType =='card')? 'approved':'pending'
    })
    createInvoiceFromOrder(order, req.user)
    for(let product of finalProductList){
        await productModel.findOneAndUpdate({_id:product.productId}, {$inc:{stock:-product.qty}})
    }
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }
    await cartModel.updateOne(
        {userId: req.user._id},{
            $pull:{
                products:{
                    productId:{$in:productIds}
                }
            }
        }
    )
    return res.status(201).json({message:"successfully added Order", order})
}




export const addAllToOrder = async(req, res, next)=>{
    const { address, phoneNumber, couponName, paymentType} = req.body
    
    const cart = await cartModel.findOne({userId: req.user._id})
    if(!cart?.products?.length){
        return next(new Error(`Empty Cart`, {cause:400}))
    }
    req.body.products = cart.products;
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName})
        if(!coupon){
            return next(new Error(`Invalid Coupon ${couponName}`, {cause:400}))
        }
        let now = moment()
        let parsed = moment(coupon.expireDate)
        let difference = parsed.diff(now, 'days')
        if(difference <= 0){
          return next(new Error(`Coupon is expired`, {cause:400}))
        }
        if(coupon.usedBy.includes(req.user._id)){
          return next(new Error(`Coupon is already used by user`, {cause:400}))
        }
        req.body.coupon = coupon;
    }
    const finalProductList =[];
    let subTotal= 0;
    const productIds= []
    for(let product of req.body.products){
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock:{$gte:product.qty},
            isDeleted:false
        })
        if(!checkProduct){
        //   return next(new Error(`Quantity not enough `, {cause:400}))
          continue;
        }
        product = product.toObject();
        product.unitPrice = checkProduct.finalPrice;
        product.finalPrice = checkProduct.finalPrice * product.qty;
        subTotal += product.finalPrice;
        productIds.push(product.productId)
        finalProductList.push(product)
    }
    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProductList,
        address,
        phoneNumber,
        paymentType,
        subTotal,
        finalPrice: subTotal,
        couponId: req.body.coupon?._id,
        finalPrice: subTotal * (1 - ((req.body.coupon?.amount |0)/100)),
        status: (paymentType =='card')? 'approved':'pending'
    })
    for(let product of finalProductList){
        await productModel.findOneAndUpdate({_id:product.productId}, {$inc:{stock:-product.qty}})
    }
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }
    await cartModel.updateOne(
        {userId: req.user._id},{
            $pull:{
                products:{
                    productId:{$in:productIds}
                }
            }
        }
    )
    return res.status(201).json({message:"successfully added Order", order})
}


export const cancelOrder = async(req, res, next)=>{
    const {orderId} = req.params;
    const {reasonRejected} = req.body;
    const order = await orderModel.findOne({_id: orderId, userId: req.user._id})
    if(!order){
        return next(new Error(`Invalid Order`, {cause:400}))
    }
    if(order.status == 'approved' ||  order.status =='onWay' || order.status == 'delivered' || order.paymentType !=='cash'){
        return next(new Error(`Can not cancel this Order`, {cause:400}))
    }
    if(order.status == 'canceled'){
        return next(new Error(`Order is already canceled`, {cause:400}))
    }
    const canceledOrder = await orderModel.updateOne({_id: order._id, userId: req.user._id},{status:'canceled', reasonRejected, updatedBy:req.user._id},{new:true})
    for(let product of order.products){
        await productModel.updateOne({_id:product.productId}, {
            $inc:{stock:product.qty}
        })
    }
    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{
            $pull:{
                usedBy : req.user._id
            }
        })
    }
    return res.status(201).json({message:"successfully Order canceled", canceledOrder})
}

export const changeOrderState = async(req, res, next)=>{
    const {orderId} = req.params;
    const {status} = req.body;
    const order = await orderModel.findOne({_id: orderId})
    if(!order || order.status =='delivered'){
        return next(new Error(`Can not change order state`, {cause:400}))
    }
    const updatedOrder = await orderModel.updateOne({_id: order._id},{status, updatedBy: req.user._id},{new:true})
    if(!updatedOrder.modifiedCount) return next(new Error(`Fail to change order status`, {cause:400}))
    return res.status(201).json({message:`successfully Order status changed to ${status}`})
}






