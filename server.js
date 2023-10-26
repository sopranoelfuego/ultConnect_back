// npm
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')

// routes
const userRoute = require('./routes/userRoutes.js')
const dashBoardRoutes = require('./routes/dashBoardRoutes.js')
const postRoutes = require('./routes/postRoutes')
const messageRoutes = require('./routes/messageRoutes')
const conversationRoutes = require('./routes/conversationRoutes')
const departementRoutes = require('./routes/departementRoutes')
const formationRoutes = require('./routes/formationRoutes')
const faculteRoutes = require('./routes/faculteRoutes')
const mentionsRoutes = require('./routes/mentionsRoutes')
const classes = require('./routes/classRoutes')
const suggestionRoutes = require('./routes/suggestionRoutes')

const provinceRoutes = require('./routes/provinceRoutes')

const errorHandler = require('./middleware/errorHandler')
const fileHandler = require('./utils/fileHandler')
// imports
const { createServer } = require('http')
const { Server } = require('socket.io')

const dbConnect = require('./config/db')
const cloudinary = require('cloudinary').v2
const app = express()
const httpServer = createServer(app)
// CLOUDINARY INIT
dotenv.config()
cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.API_KEY,
 api_secret: process.env.API_SECRET,
})
// MIDLLEWARES

app.use(cors())
app.use(express.json())

const io = new Server(httpServer, {
 cors: {
  //   origin: 'https://objective-banach-01d263.netlify.app',
  origin: 'http://localhost:3000',
 },
})

// DATABASE
dbConnect()

// ROUTES
app.use('/api/user', fileHandler, userRoute)
app.use('/api/dashboard',  dashBoardRoutes)
app.use('/api/post', fileHandler, postRoutes)
app.use('/api/message', fileHandler, messageRoutes)
app.use('/api/conversation', conversationRoutes)
app.use('/api/departement', departementRoutes)
app.use('/api/faculte', faculteRoutes)
app.use('/api/formation', formationRoutes)
app.use('/api/province', provinceRoutes)
app.use('/api/class', classes)
app.use('/api/mention', mentionsRoutes)
app.use('/api/suggestion', suggestionRoutes)

app.use(errorHandler)

app.use('/uploads', express.static('uploads'))
app.get('/', (req, res) => res.json('welcome to our app'))

// ========================SOCKET==================================================================

let users = []

const addUser = (userId, socketId) => {
 !users.some(user => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = socketId => {
 users = users.filter(user => user.socketId !== socketId)
}

const getUser = userId => {
 return users.find(user => user.userId === userId)
}

io.on('connection', socket => {
 socket.on('connected', userId => {
  console.log('connectedUser:', userId)
  addUser(userId, socket?.id)
  getUser(userId)
  io.emit('usersConnected', users)
 })

 socket.on('disconnect', () => {
  removeUser(socket.id)
  io.emit('usersConnected', users)
 })

 //HERE MEANS THAT SEND EMIT sendMessage and then the reciever will
 // catch messagge through getMessage
 //  content,to,from,conversationId

 socket.on(
  'sendMessage',
  ({ to, from, content, conversationId, file, type }) => {
   const user = getUser(to)

   io.to(user?.socketId).emit('getMessage', {
    to,
    from,
    content,
    conversationId,
    file,
    type,
   })
  }
 )
})

// END OF SOCKET=================================================================================

const port = process.env.PORT || 5001
httpServer.listen(port, () =>
 console.log(`server ready running on port ${port}`.rainbow)
)
