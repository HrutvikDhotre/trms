const User = require('../models/login')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')





const sendMail = async (email, password) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bmccproject123@gmail.com',
            pass: 'sbhd zldd egaj xwxb'
        }
    })

    const mailOptions = {
        from: 'bmccproject123@gmail.com',
        to: email,
        subject: `BMCC USER SIGNUP`,
        text: `Email = ${email}  Password = ${password}`
    }

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            return false
        } else {
            console.log('Email sent: ' + info.response)
            return true
        }
    })
}


function generateRandomPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// const randomPassword = generateRandomPassword();
// console.log(randomPassword);



const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const userDetails = await User.findOne({ $or: [{ username: username }, { email: username }] })

        if (!userDetails) {
            return res.send({ loginSuccess: false, userNotFound: true })
        } else if (userDetails) {

            const passwordResult = await bcrypt.compare(password, userDetails.password)
            if (passwordResult)
                return res.send({ loginSuccess: true, email: userDetails.email, name: userDetails.name, userType: userDetails.userType })
            else
                return res.send({ loginSuccess: false, passwordResult })
        }

    } catch (err) {
        console.log(err);
    }

}

const changePassword = async (req, res) => {
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const username = req.body.username;

        // console.log(req.body)

        const userDetails = await User.findOne({ $or: [{ username: username }, { email: username }] })
        const passwordResult = await bcrypt.compare(oldPassword, userDetails.password)
        const areOldNNewSame = await bcrypt.compare(newPassword, userDetails.password)

        if (!passwordResult) {
            return res.send({ incorrectOldPassword: true, samePasswords: false })
        } else if (areOldNNewSame)
            return res.send({ incorrectOldPassword: false, samePasswords: true })
        else {
            const hash = await bcrypt.hash(newPassword, 5)
            const updatedResponse = await User.updateOne({ $or: [{ username: username }, { email: username }] }, {
                $set: { 'password': hash }
            })
            if (updatedResponse.modifiedCount === 1)
                return res.send({ passwordUpdateSuccessfull: true })
            else
                return res.send({ passwordUpdateSuccessfull: false })
        }

    } catch (err) {
        console.log(err)
    }
}


const addUser = async (req, res) => {
    try {
        console.log(req.body)
        const email = req.body.useremail
        const name = req.body.name
        const userType = req.body.userType
        const password = generateRandomPassword()
        const hashedPassword = await bcrypt.hash(password, 5)

        const userDetails = await User.findOne({ email: email })
        console.log(userDetails)
        if (userDetails)
            return res.send({ userAlreadyExists: true })


        const newUser = new User({
            email: email,
            password: hashedPassword,
            name: name,
            userType: userType
        })


        if (sendMail(email, password)) {
            console.log("Returned true")
            await newUser.save()
            return res.send({ userAlreadyExists: false, userAddedSuccessfully: true })
        }
        else {
            console.log("inside error")
            throw new Error()
        }

    } catch (err) {
        console.log(err)
        res.send({ errorOccured: true })
    }


}

const deleteUser = async (req, res) => {
    try {
        console.log("inside delete")
        const {useremail} = req.params
        const userDetails = await User.findOneAndDelete({ email: useremail })
        if (!userDetails)
            return res.send({ userDoesNotExists: true })
        else
           return res.send({userDeletedSuccessfully : true})

    } catch (err) {
        console.log(err)
        res.send({ errorOccured: true })
    }
}

module.exports = { login, changePassword, addUser,deleteUser }