import slugify from "slugify";
import cloudinary from "../../../Services/cloudinary.js";
import * as dotenv from 'dotenv';
import categoryModel from './../../../../DB/model/Category.model.js';
dotenv.config()

export const addCategory = async(req, res, next)=>{
    const {name} = req.body;
    if(await categoryModel.findOne({name})){
        return next(new Error(`Duplicate Category name ${name}`, {cause:409}))
    }
    const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.APP_NAME}/category`})
    const newCategory = await categoryModel.create({name, slug:slugify(name), image:{public_id, secure_url}, createdBy:{} })
    return res.status(201).json({message:"successfully added Category", newCategory})
}
export const updateCategory = async(req, res, next)=>{
    const category = await categoryModel.findById(req.params.categoryId)
    if(!category) return next(new Error(`Invalid Category Id`, {cause:400}))
    if(req.body.name) {
        if(category.name === req.body.name) return next(new Error(`Old name match new name`, {cause:409}))
        if(await categoryModel.findOne({name:req.body.name})) return next(new Error(`Invalid Category name`, {cause:409}))
        category.name = req.body.name;
        category.slug =slugify(req.body.name)
    }
    if(req.file){
        const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.APP_NAME}/category`})
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = {public_id, secure_url}
    }
    await category.save()
    return res.json({message:"Category updated successfully", category})
}


export const getCategory = async(req, res, next)=>{
    const category = await categoryModel.findById(req.params.categoryId)
    if(!category) return next(new Error(`Invalid Category Id`, {cause:400}))
    return res.status(200).json({message:"Category data", results: category})
}

export const getAllCategories = async(req, res)=>{
    const categories =  await categoryModel.find().populate('subCategories')
    return res.status(200).json({message:"get all Categories", results: categories})
}