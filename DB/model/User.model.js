
import mongoose, {Schema,model} from 'mongoose';
const userSchema = new Schema ({
    userName:{
        type:String,
        required:[true, 'userName is required'],
        min:[2],
        max:[20],
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    profilePic:{
        type:Object,
    },
    phone:{
        type:String,
    },
    role:{
        type:String,
        default:'User',
        enum : ['Admin','User'],
    },
    status:{
        type:String,
        default:'Active',
        enum : ['Active','Not_Active'],
    },
    gender:{
        type: String,
        enum: ['Male', 'Female'],
    },
    adress:{
        type:String,
    },
    forgetCode:{
        type:String,
        default:null
    }
},
{
    timestamps:true,
})
const userModel = mongoose.models.User ||  model('User', userSchema);
export default userModel;


