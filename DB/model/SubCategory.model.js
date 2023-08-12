
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
    createdBy: { type: Types.ObjectId, ref: "User"},
    updatedBy: { type: Types.ObjectId, ref: "User"},
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps:true
})
subCategorySchema.virtual('products',{
    localField:"_id",
    foreignField: 'subCategoryId',
    ref: 'Product'
})
const subCategoryModel = mongoose.models.SubCategory ||  model('SubCategory', subCategorySchema);
export default subCategoryModel;


