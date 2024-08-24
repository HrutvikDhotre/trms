const express = require('express')
const router = express.Router()

const {updateLabs,getLabDetails,deleteLabSlot} = require('../controller/lab')

router.put('/update',updateLabs)
router.get('/get/:name/:day',getLabDetails)
router.delete('/delete/:slotNumber',deleteLabSlot)

module.exports = router