
import mongoose, {Schema,Types,model} from 'mongoose';
const categorySchema = new Schema ({
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
    CreatedBy:{
        type: Types.ObjectId,
        ref:'User'
    }, // required true after prototype
},
{
    timestamps:true
})
const categoryModel = mongoose.models.Category ||  model('Category', categorySchema);
export default categoryModel;


