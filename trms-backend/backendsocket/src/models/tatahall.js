const mongoose = require('mongoose')

const tataSchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    bookedBy: {
        type: String,
        required: true
    },
    email:{
        type : String,
        required : true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        required: true
    }
})


const TataHall = mongoose.model("TataHall", tataSchema, "TataHall");

module.exports = TataHall