const TataHall = require('../models/tatahall')
const CyrusHall = require('../models/cyrushall')


const postTataHall = async (req, res) => {
    try {

        // console.log(req.body)
        const startDateTimeStr = `${req.body.bookingDate}T${req.body.startTime}:00.000Z`;
        const startDateTimeUTC = new Date(startDateTimeStr);
        const endDateTimeStr = `${req.body.bookingDate}T${req.body.endTime}:00.000Z`;
        const endDateTimeUTC = new Date(endDateTimeStr);

        const date = req.body.bookingDate
        const bookedBy = req.body.name
        const purpose = req.body.purpose
        const email = req.body.userEmail

        const data = new TataHall({
            date: date,
            bookedBy: bookedBy,
            email: email,
            startTime: startDateTimeUTC,
            endTime: endDateTimeUTC,
            purpose: purpose
        })

        await data.save()
        // res.send({})
        let details = await TataHall.find({ date: date })
        if (details.length > 0)
            return res.send({details : details,hallName : "tatahall"})
        else
            return res.send({ noDataAvailable: true })

    } catch (err) {
        console.log(err)
    }

}

const getTataHall = async (req, res) => {
    try {
        const { date } = req.params
        let data = await TataHall.find({ date: date })
        if (data.length > 0)
            return res.send(data)
        else
            return res.send({ noDataAvailable: true })
    } catch (err) {
        console.log(err)
    }
}

const deleteTataHall = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(req.body)
        const date = req.body.bookingDate
        let result = await TataHall.findByIdAndDelete(id)
        if (result) {
            let details = await TataHall.find({ date: date })
            if (details.length > 0)
                return res.send({details : details,hallName : 'tatahall'})
            else
                return res.send({ noDataAvailable: true })
        } else {
            return res.send({ deletionFailed: true })
        }


    } catch (err) {
        console.log(err)
    }
}

const postCyrusHall = async (req, res) => {
    try {

        // console.log(req.body)
        const startDateTimeStr = `${req.body.bookingDate}T${req.body.startTime}:00.000Z`;
        const startDateTimeUTC = new Date(startDateTimeStr);
        const endDateTimeStr = `${req.body.bookingDate}T${req.body.endTime}:00.000Z`;
        const endDateTimeUTC = new Date(endDateTimeStr);

        const date = req.body.bookingDate
        const bookedBy = req.body.name
        const purpose = req.body.purpose
        const email = req.body.userEmail

        const data = new CyrusHall({
            date: date,
            bookedBy: bookedBy,
            email: email,
            startTime: startDateTimeUTC,
            endTime: endDateTimeUTC,
            purpose: purpose
        })

        await data.save()
        // res.send({})
        let details = await CyrusHall.find({ date: date })
        if (details.length > 0)
            return res.send({details : details,hallName : "cyrushall"})
        else
            return res.send({ noDataAvailable: true })

    } catch (err) {
        console.log(err)
    }

}

const getCyrusHall =  async (req, res) => {
    try {
        const { date } = req.params
        let data = await CyrusHall.find({ date: date })
        if (data.length > 0)
            return res.send(data)
        else
            return res.send({ noDataAvailable: true })
    } catch (err) {
        console.log(err)
    }
}

const deleteCyrusHall = async (req, res) => {
    try {
        const { id } = req.params
        // console.log(req.body)
        const date = req.body.bookingDate
        let result = await CyrusHall.findByIdAndDelete(id)
        if (result) {
            let details = await CyrusHall.find({ date: date })
            if (details.length > 0)
            return res.send({details : details,hallName : 'cyrushall'})
            else
                return res.send({ noDataAvailable: true })
        } else {
            return res.send({ deletionFailed: true })
        }


    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    postTataHall,
    getTataHall,
    deleteTataHall,
    postCyrusHall,
    getCyrusHall,
    deleteCyrusHall
}