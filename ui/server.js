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

    // sending userInfo/configuration JSON to client when connected
    fs.readFile('./client.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        const jsonData = JSON.parse(jsonString)
        const stringData = JSON.stringify(jsonData)
        ws.send(stringData)
    })

    // send JSON object to the client every 5 second
    function send5sec() {
        let dat = {
            "dataType": "number",
            "num": `${Math.random()}`
        };
        ws.send(JSON.stringify(dat))
        setTimeout(send5sec, 5000)
    }

    send5sec()

    ws.on('message', (message) => {
        console.log(`we have received a message: `)
        console.log(JSON.parse(message))

        // updating the most recent user configuration
        fs.writeFile('./client.json', message, (err) => {
            if (err) console.log("Error: ", err)
        })
    })
})