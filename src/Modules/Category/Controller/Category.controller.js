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