const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    phonenumber :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    spe : {
        type : String,
        required : true
    },
    exp : {
        type : Number,
        required : true
    },
    fees : {
        type : Number,
        required : true
    },
    fromTiming : {
        type : String,
        required : true
    },
    toTiming : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ['Pending', 'Approved','Rejected'],
        default : 'Pending'
    }
},{ timestamps : true })

const doctorModel = mongoose.model('doctor',doctorSchema);
module.exports = doctorModel;


