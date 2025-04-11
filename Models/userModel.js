
import mongoose  from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'superadmin'],
        default: 'admin',
    },
    city:String,
    country:String,
    phone:String,
    state:String,
    occupation:String,
    transaction:Array,

},{timestamps:true});
    
// Create a model from the schema

export const User = mongoose.model("User", userSchema);


  