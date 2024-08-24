const express = require('express')
const { PORT, MONGOURL } = require('./config')
const mongoose = require('mongoose')
const cors = require('cors')
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express()
app.use(cors())
const server = createServer(app)
// const io = new Server(server)
const io = require('socket.io')(server, { cors: { origin: "*" } })


const resources = require('./routes/resources')
const user = require('./routes/user')
const labs = require('./routes/lab')


// io.listen(5000);

app.use(express.json())

// Routers
app.use('/resources', resources)
app.use('/user', user)
app.use('/labs', labs)



mongoose.connect(MONGOURL).then(() => {
  console.log("connected to the db");
  server.listen(PORT, () => {
    console.log("listening to port " + PORT);
  })

}).catch((err) => console.log(err))


io.on('connection', (socket) => {
  console.log('user connected')
  // FOR HALLS
  socket.on('slot-added', (data) => {
    io.emit('slot-details-sent', data)
  })
  socket.on('slot-deleted', (data) => {
    io.emit('slot-updated-deletion', data)
  })

  // FOR LABS
  socket.on('lab-Schedule-Updated', (data) => {
    console.log('labscheduleupdated')
    io.emit('lab-Schedule-Updated', data)
  })

  socket.on('lab-slot-deleted',(data)=>{
    io.emit('lab-slot-deleted',data)
  })

})

