import couponModel from './../../../../DB/model/Coupon.model.js';
export const addCoupon = async(req, res, next)=>{
    let date = new Date(req.body.expireDate)
    const now = new Date()
    if(now.getTime() >= date.getTime()){
        next(new Error(`Invalid Time`, {cause:409}))
    }
    req.body.expireDate = date.toLocaleDateString()
    if(await couponModel.findOne({name: req.body.name})){
        return next(new Error(`Duplicate Coupon name ${req.body.name}`, {cause:400}))
    }
    req.body.createdBy= req.user._id;
    req.body.updatedBy= req.user._id;


    const newCoupon = await couponModel.create(req.body)
    return res.status(201).json({message:"successfully added Coupon", newCoupon})
}






export const updateCoupon = async(req, res, next)=>{
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

