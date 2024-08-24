const Lab = require('../models/lab')

const updateLabs = async (req, res) => {
    try {

        const { name, day, email, timeSlots } = req.body
        const labName = name.replace(/\s/g, '')
        const filter = { name: labName, day: day }
        const update = { $push: { timeSlots: { ...timeSlots, email: email } } }
        const options = { upsert: true, new: true }
        await Lab.findOneAndUpdate(filter, update, options)
        const data = await Lab.find({ name: labName, day: day })
        res.send({ labDetails: data })
    } catch (error) {
        console.log(error)
        res.send({ errorOccured: true, message: error })
    }
}

const getLabDetails = async (req, res) => {
    try {
        const { name, day } = req.params
        const labName = name.replace(/\s/g, '')
        const data = await Lab.find({ name: labName, day: day })
        res.send({ labDetails: data })
    } catch (error) {
        console.log(error)
        res.send({ errorOccured: true, message: error })
    }
}

const deleteLabSlot = async (req, res) => {
    try {

        console.log("inside delete")
        const { slotNumber } = req.params
        const { labName, day } = req.body
        const updatedLabName = labName.replace(/\s/g, '')

        const document = await Lab.findOne({ name: updatedLabName, day: day })
        if (!document) {
            return res.send({ notFound: true });
        }

        const index = document.timeSlots.findIndex(slot => slot.slot === parseInt(slotNumber))
        if (index === -1) {
            return res.send({ message: 'Time slot not found' });
        }

        document.timeSlots.splice(index, 1)
        await document.save()

        const data = await Lab.find({ name: updatedLabName, day: day })
        console.log(data)

        res.send({ labDetails: data })

    } catch (error) {
        console.log(error)
        res.send({ errorOccured: true, message: error })
    }
}

module.exports = { updateLabs, getLabDetails, deleteLabSlot }