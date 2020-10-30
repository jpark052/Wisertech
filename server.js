/**
 * Video streaming server using express/websocket.
 * mjpg_streamer is used for streaming fucntion.
 * 
 */

"use strict"
const express = require('express')
const path = require('path');
const WebSocket = require('ws')
const app = express();  // initialize express server
const cmd = require("node-cmd") // cmd package is required to execute shell command
const port = 8765
const fs = require("fs")

cmd.get(`ip route get 1.2.3.4 | awk '{print $7}'`, function (err, data, stderr) {
  if (err) {
    console.log('error: ', err)
  }
  const ipAddress = data
  module.exports = ipAddress
})


let graphJSON
let userJSON

app.use(express.static(__dirname + '/public'))  // using HTML files in 'public' folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`)
})

// initialize websocket server
const socketServer = new WebSocket.Server({ port: 3030 })

socketServer.on('connection', (ws) => {
  console.log('connected')
  console.log('client Set length: ', socketServer.clients.size) // showing the number of clients connected when initialize

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




  ws.on('message', (message) => {
    console.log('we have received a request')


    let received = JSON.parse(message)

    // updating the most recent user configuration
    if (received.dataType == "userInfo") {
      fs.writeFile('./client.json', message, (err) => {
        if (err) console.log("Error: ", err)

      })

    } else if (received.dataType == "graphData") {
      fs.writeFile('./clientGraph.json', message, (err) => {
        if (err) console.log("Error: ", err)
      })

    } else if (received.dataType == "configuration") {
      userJSON.configuration.videoQuality = received.videoQuality
      let amplitude = received.amplitude

    } else if (received.dataType == "videoTrigger") {

      // cmd.get(`ip route get 1.2.3.4 | awk '{print $7}'`, function (err, data, stderr) {
      //   if (err) {
      //     console.log('error: ', err)
      //   }
      //   ws.send(data)
      // })
      
      // executing the mjpg_streamer. It will be displayed in 'stream.html' page
      cmd.get(`cd /home/pi/Wisertech/mjpg-streamer/mjpg-streamer-experimental
    export LD_LIBRARY_PATH=.
    mjpg_streamer -i "./input_uvc.so -n -f 30 -r 640x480 -d /dev/video0"  -o "./output_http.so -w ./www"`,

        function (err, data, stderr) {
          if (err) {
            console.log('error: ', err)
          }
        })
    }
  })

  ws.on('close', (socketClient) => {
    console.log('closed')
    console.log('Number of clients: ', socketServer.clients.size)

    // shut down the streamer only if there's no client left
    if (socketServer.clients.size == 0) {
      //console.log('zero!')
      cmd.get(`kill $(pgrep mjpg_streamer) > /dev/null 2>&1`, function (err, data, stderr) {
        if (err) {
          console.log(err)
        }
      })
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
