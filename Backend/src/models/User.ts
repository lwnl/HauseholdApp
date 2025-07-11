import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'admin'],  
    default: 'user', 
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "00000000-0000-0000-0000-000000000000.avif",
  },
  profilePicture_ss: {
    type: String,
    default: "00000000-0000-0000-0000-000000000000_ss.avif",
  },
  notiz: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notiz', 
  }],
  einkaufslist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Einkauflist', 
  }],
  transaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction', 
  }],
})

const User = mongoose.model('User', userSchema)

export default User