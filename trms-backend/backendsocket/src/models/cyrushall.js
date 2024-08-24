const mongoose = require('mongoose')

const cyrusSchema = mongoose.Schema({
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


const CyrusHall = mongoose.model("CyrusHall", cyrusSchema, "CyrusHall");

module.exports = CyrusHall