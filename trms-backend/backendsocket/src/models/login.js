const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userType : {
        type : String,
        required : true
    }
})

// email
// "hrutvikdhotre10@gmail.com"
// username
// "hrutvik"
// password
// "$2b$05$.XB//Tn/BetzscBOOpQe/uWx919DMHeRX.pnKnN9ph8YYiFmUK66G"
// name
// "Hrutvik Dhotre"
// userType
// "user"

const User = mongoose.model("User", userSchema);

module.exports = User