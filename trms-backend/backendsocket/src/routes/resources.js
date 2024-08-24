const express = require('express')
const router = express.Router()

const {postTataHall,getTataHall,deleteTataHall,postCyrusHall,getCyrusHall,deleteCyrusHall}  = require('../controller/resources')
router.post('/tatahall',postTataHall)
router.get('/tatahall/:date',getTataHall)
router.delete('/tatahall/:id',deleteTataHall)

router.post('/cyrushall',postCyrusHall)
router.get('/cyrushall/:date',getCyrusHall)
router.delete('/cyrushall/:id',deleteCyrusHall)

module.exports = router