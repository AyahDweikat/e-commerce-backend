import joi from 'joi'
import { Types } from 'mongoose';
const dataMethods = ['body','query','params','headers','file'];
const validationObjectId =(value,helper)=>{
    if(Types.ObjectId.isValid(value)){
        return true 
    }else {
        return helper.message("id is invalid")
    }
}
export const generalFeilds = {
    email:joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password:joi.string().min(3).required(),
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        mimetype:joi.string().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        path:joi.string().required(),
        size:joi.number().positive().required(),
        dest:joi.string(),
    }),
    id:joi.string().custom(validationObjectId),
}

const validation = (schema)=>{
    return (req,res,next)=>{
        let inputsData = {...req.body, ...req.query, ...req.params }
        if(req.file) inputsData = {...inputsData, file:req.file }
        const validationResult = schema.validate(inputsData, {abortEarly:false})
        
        if(validationResult?.error?.details.length){
            return res.json({message:"valiation error",valiadtionArray: validationResult?.error?.details});
        }return next();
    }
}
export default validation;