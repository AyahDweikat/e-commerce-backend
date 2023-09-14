import cloudinary from '../../../Services/cloudinary.js';
import brandModel from './../../../../DB/model/Brand.model.js';
import * as dotenv from 'dotenv';
export const addBrand = async(req, res, next) =>{
    const {name, categoryId} = req.body;
    if(await brandModel.findOne({name})){
        return next(new Error(`Duplicate Category name ${name} `, {cause:409}))
    }
    const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.APP_NAME}/brand`})
    const newBrand = await brandModel.create({name, categoryId, image:{public_id, secure_url}, createdBy:req.user._id, updatedBy: req.user._id  })
    return res.status(201).json({message:"successfully added Category", newBrand})
}
export const getBrands = async(req, res, next) =>{
    const {categoryId} = req.params;
    const brands = await brandModel.find({categoryId})
    res.json({test:"Getting brands successfully", brands})
}
export const getAllBrands = async(req, res, next) =>{
    const brands = await brandModel.find()
    res.json({test:"Getting All brands successfully", brands})
}













export const updateBrand = async(req, res, next) =>{
    const brand = await brandModel.findById(req.params.brandId)
    if(!brand) return next(new Error(`Invalid Brand Id`, {cause:400}))
    if(req.body.name) {
        if(brand.name === req.body.name) return next(new Error(`Old name match new name`, {cause:409}))
        if(await brandModel.findOne({name:req.body.name})) return next(new Error(`Invalid Brand name`, {cause:409}))
        brand.name = req.body.name;
    }
    if(req.file){
        const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.APP_NAME}/brand`})
        await cloudinary.uploader.destroy(brand.image.public_id)
        brand.image = {public_id, secure_url}
    }
    if(req.body.categoryId) {
        if(brand.categoryId === req.body.categoryId) return next(new Error(`Old name match new name`, {cause:409}))
        brand.categoryId = req.body.categoryId;
    }
    brand.updatedBy= req.user._id 
    await brand.save()
    return res.json({message:"Brand updated successfully", brand})
} 