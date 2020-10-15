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

let graphJSON
let userJSON

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3000, () => console.log('Server Started'))

const socketServer = new WebSocket.Server({ port: 3030 })

socketServer.on('connection', (ws) => {
    console.log('connected')

    // sending userInfo/configuration JSON to client when connected
    fs.readFile('./public/client.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        userJSON = JSON.parse(jsonString)
        const stringData = JSON.stringify(userJSON)
        ws.send(stringData)
    })

    fs.readFile('./clientGraph.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        graphJSON = JSON.parse(jsonString)
    })


    // send JSON object to the client every 5 second


    ws.on('message', (message) => {
        console.log(`we have received a message: `)
        console.log(JSON.parse(message))
        let received = JSON.parse(message)

        // updating the most recent user configuration
        if (received.dataType == "userInfo") {
            fs.writeFile('./client.json', message, (err) => {
                if (err) console.log("Error: ", err)
            })
        } else if (received.dataType == "graphData"){
            fs.writeFile('./clientGraph.json', message, (err) => {
                if (err) console.log("Error: ", err)
            })
        } else if (received.dataType == "configuration"){
            userJSON.configuration.videoQuality = received.videoQuality
            let amplitude = received.amplitude
        } else if (received.dataType == "videoTrigger"){
            //command to stream video

        }
    })
})

fs.readFile('./public/clientGraph.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    graphJSON = JSON.parse(jsonString)
    console.log(graphJSON)

    renew5sec();

})

function renew5sec() {

    var dataArray = [Math.floor((Math.random() * 20) + 30),
    Math.floor((Math.random() * 100) + 1),
    Math.floor((Math.random() * 100) + 1),
    Math.floor((Math.random() * 100) + 1),
    Math.floor((Math.random() * 100) + 1),
    Math.floor((Math.random() * 100) + 1),
    Math.floor((Math.random() * 100) + 1)]
    graphJSON.graphData.data.datasets[0].data = dataArray

    //let newGraph = JSON.stringify(graphJSON)

    fs.writeFile('./public/clientGraph.json', JSON.stringify(graphJSON, null, "\t"), (err) => {
        if (err) console.log("Error: ", err)
    })

    setTimeout(renew5sec, 1000)
}