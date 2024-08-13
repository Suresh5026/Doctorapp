const mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['User','Admin','Doctor'],
        default : 'User'

    }
},{ timestamps: true })

const userModel = mongoose.model('users',userSchema);
module.exports = userModel