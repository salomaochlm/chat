const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(express.json())

app.get('*', (req, res) => res.render('.'))

const server = require('http').createServer(app)
const socketIO = require('socket.io')(server)
const allData = []

socketIO.on('connection', socket => {

	console.log(`user connected: ${socket.id}`)

	socket.on('link_user_code', data => {
		socket.join(data.code)
		socket.emit('message_from_server', allData.filter(allData => allData.code === data.code))
		console.log(data)
	})

	socket.on('disconnect', () => console.log(`user disconnected: ${socket.id}`))

	socket.on('message_from_client', data => {
		allData.push(data)
		socketIO.to(data.code).emit('message_from_server', [data])
		console.log(data)
	})
})

require('dotenv').config()
const port = process.env.PORT || 3001
server.listen(port, () => console.log(`app listening at http://localhost:${port}/`))
