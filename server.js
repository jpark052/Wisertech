"use strict"
const express = require('express')
const path = require('path');
const imageToBase64 = require('image-to-base64')
const WebSocket = require('ws')
const fs = require("fs")

const app = express();
const { StillCamera } = require("pi-camera-connect")
const stillCamera = new StillCamera({
  width: '640',
  height: '480'
  })
const port = 8765
let base64 // base64 format image string
let interval // store 'serInterval' when user click 'Get Picture' button

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`)
})

const socketServer = new WebSocket.Server({ port: 3030 })

socketServer.on('connection', (ws) => {
  console.log('connected')
  console.log('client Set length: ', socketServer.clients.size)

  ws.on('message', (message) => {
    /** 
     * function takes() is triggered when server receives a message from the client
     * i. e. when user press the button
     * It takes the picture(hex buffer), convert it to base64 string and send it to client 
     */     
    function takes() {
      stillCamera.takeImage().then(image => {
      let buff = Buffer.from(image)
      let base64 = buff.toString('base64')
      ws.send(base64)
		})
}
    takes()
    interval = setInterval(takes, 5000)
  })

  ws.on('close', (socketClient) => {
    clearInterval(interval)
    console.log('closed')
    console.log('Number of clients: ', socketServer.clients.size)
  })
})

