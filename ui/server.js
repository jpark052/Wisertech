// var cmd = require('node-cmd');

// cmd.get(
//     'arp -na | grep -i b8:27:eb',
//     function (err, data, stderr) {
//         console.log('1', data)
//     }
// );

const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs')
const WebSocket = require('ws')

app.get('/', (req, res) => {
    res.send('Users Page')
  })

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'settings.html'))
})

app.get('/sensors', (req, res) => {
    res.sendFile(path.join(__dirname, 'sensors.html'))
})

app.get('/jsontest', (req, res) => {
    res.sendFile(path.join(__dirname, 'jsontest.html'))
})

app.listen(3000, () => console.log('Server Started'))

const socketServer = new WebSocket.Server({ port: 3030 })

socketServer.on('connection', (ws) => {
    console.log('connected')

    ws.on('message', (message) => {
      console.log(`we have received a message: `)
      //const data = JSON.parse(message)
      console.log(message)
    })

    fs.readFile('./client.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        const data = JSON.parse(jsonString)
        const tt = JSON.stringify(data)
        ws.send(tt)
        console.log(data)
    })
  
  })