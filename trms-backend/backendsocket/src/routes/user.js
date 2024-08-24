const express = require('express')
const router = express.Router()

const {login,changePassword,addUser,deleteUser} = require('../controller/user')

router.post('/login',login)
router.post('/changepassword',changePassword)
router.post('/adduser',addUser)
router.delete('/deleteuser/:useremail',deleteUser)



module.exports = router