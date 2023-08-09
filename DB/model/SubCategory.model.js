
import mongoose, {Schema,Types,model} from 'mongoose';
const subCategorySchema = new Schema ({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    categoryId:{type:Types.ObjectId, ref:'Category', required:true},
    CreatedBy: { type: Types.ObjectId, ref: "User"}, // required true after prototype
    updatedBy: { type: Types.ObjectId, ref: "User"}, // required true after prototype
},
{
    timestamps:true
})
const subCategoryModel = mongoose.models.SubCategory ||  model('SubCategory', subCategorySchema);
export default subCategoryModel;


