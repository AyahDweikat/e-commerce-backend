
import mongoose, {Schema,Types,model} from 'mongoose';
const couponSchema = new Schema ({
    name:{
        type:String,
        required:true,
    },
    amount: {
        type : Number,
        default:1,
    },
    expireData: Date,// after prototype
    usedBy: {
        type:Types.ObjectId,
        ref:'User'
    },
    CreatedBy: {
        type: Types.ObjectId,
        ref:'User'
    }, // required true after prototype
},
{
    timestamps:true,
})

const couponModel = mongoose.models.Coupon ||  model('Coupon', couponSchema);
export default couponModel;


