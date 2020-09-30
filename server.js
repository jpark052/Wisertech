"use strict"
const express = require('express')
const path = require('path');
const WebSocket = require('ws')
const fs = require("fs")
const app = express();
const cmd = require("node-cmd")
const port = 8765

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
    console.log('we have received a request')
    
    // executing the mjpg_streamer
    cmd.get(`cd /home/pi/Wisertech/mjpg-streamer/mjpg-streamer-experimental
             export LD_LIBRARY_PATH=.
             mjpg_streamer -i "./input_uvc.so -n -f 30 -r 640x480 -d /dev/video0"  -o "./output_http.so -w ./www"`,
        function(err, data, stderr){
               if (err) {
               console.log('error: ', err)
            }
             
        });
    ws.send('streaming started')
  })

  ws.on('close', (socketClient) => {
    clearInterval(interval)
    console.log('closed')
    console.log('Number of clients: ', socketServer.clients.size)
  })
})

