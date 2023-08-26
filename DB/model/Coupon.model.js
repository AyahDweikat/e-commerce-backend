
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
    expireDate: {type: String, required:true},
    usedBy: [{
        type:Types.ObjectId,
        ref:'User'
    }],
    createdBy: { type: Types.ObjectId, ref: "User", required:true}, // required true after prototype
    updatedBy: { type: Types.ObjectId, ref: "User", required:true}, // required true after prototype
},
{
    timestamps:true,
})

const couponModel = mongoose.models.Coupon ||  model('Coupon', couponSchema);
export default couponModel;


