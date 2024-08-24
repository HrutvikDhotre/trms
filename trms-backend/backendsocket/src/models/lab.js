const mongoose = require('mongoose')

const timeSlotSchema = {
    bookedBy: {
        type: String,
        required: true
    },
    slot: {
        type: Number,
        required: true
    },
    subject : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    }
}

const labSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    timeSlots: [timeSlotSchema]
})

const Lab = new mongoose.model('Lab', labSchema, 'Lab')
module.exports = Lab