
import mongoose, {Schema,Types,model} from 'mongoose';
const brandSchema = new Schema ({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    categoryId:{
        type: Types.ObjectId,
        ref:'Category',
        required:true,
    },
    createdBy: { type: Types.ObjectId, ref: "User", required:true}, // required true after prototype
    updatedBy: { type: Types.ObjectId, ref: "User", required:true}, // required true after prototype
},
{
    timestamps:true,
})
const brandModel = mongoose.models.Brand ||  model('Brand', brandSchema);
export default brandModel;


