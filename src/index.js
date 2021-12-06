const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage}= require('./utils/message.js')
const { addUser,
    removeUser,
    getUser,
    getUserInRoom} = require('./utils/user')
const { on } = require('events')


//const port = require('../../task-manager1/config/.env')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000

const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// let count =0

//server(emit)->client (receive) -countUpdate
//client(emit)->server(receive) -increment
 
//connect to client
io.on('connection',(socket) =>
 {
    console.log("New websocket connection")
    //welcome
    
    socket.on('join',(options,callback)=>
    {   
        const {error,user} =addUser({id:socket.id,...options})

        if(error)
        {
            return callback(error)
        }
        socket.join(user.room)
    socket.emit('message',generateMessage('Admin','Welcome!'))
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has Joined!`))
      io.to(user.room).emit('roomData',{
          room:user.room,
          users:getUserInRoom(user.room)
      })
    callback()
    })
    //get message from client   
    socket.on('sendMessage',(message, callback) =>
    {   const user =getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    socket.on('SendLocation',(location,ack)=>
    {
        const user = getUser(socket.id)
       // const url =`https://google.com/maps?q=${location.latitude},${location.longitude}`
        
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        ack()
    })
    //disconnect
    socket.on('disconnect',()=>{
       const user = removeUser(socket.id)
       if(user)
       {
        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`    ))   
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
    }
        
    })

    
     //count

    //  socket.emit("countUpdated",count)

    //  socket.on('increment',()=>
    //  {
    //     count++
    //     //socket.emit('countUpdated',count) // it works only currnt connection
       
    //     io.emit('countUpdated',count)// it work with every single connecton
    //  })
     
     
 })

server.listen(port,()=>
{
    console.log("server is up on "+ port)
})