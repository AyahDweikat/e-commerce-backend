import couponModel from './../../../../DB/model/Coupon.model.js';
export const addCoupon = async(req, res, next)=>{
    if(await couponModel.findOne({name: req.body.name})){
        return next(new Error(`Duplicate Coupon name ${req.body.name}`, {cause:409}))
    }
    const newCoupon = await couponModel.create({name:req.body.name, createdBy:req.user._id, updatedBy: req.user._id})
    return res.status(201).json({message:"successfully added Coupon", newCoupon})
}
export const updateCoupon = async(req, res)=>{
    const coupon = await couponModel.findById(req.params.couponId)
    if(!coupon) return next(new Error(`Invalid Coupon Id`, {cause:400}))
    if(req.body.name) {
        if(coupon.name === req.body.name) return next(new Error(`Old name match new name`, {cause:409}))
        if(await couponModel.findOne({name:req.body.name})) return next(new Error(`Invalid Coupon name`, {cause:409}))
        coupon.name = req.body.name;
    }
    if(req.body.amount){
        if(coupon.amount === req.body.amount) return next(new Error(`Old amount match new amount`, {cause:409}))
        coupon.amount = req.body.amount;
    }
    coupon.updatedBy= req.user._id 
    await coupon.save()
    return res.json({message:"Category updated successfully", coupon})
}






export const getCouponData = async(req, res, next)=>{
    const coupon = await couponModel.findById(req.params.couponId)
    if(!coupon) return next(new Error(`Invalid Coupon Id`, {cause:400}))
    return res.status(200).json({message:"Coupon data", results: coupon})
}
export const getCoupons= async(req, res, next)=>{
    const coupons = await couponModel.find()
    return res.status(200).json({message:"Coupon data", results: coupons})
}

