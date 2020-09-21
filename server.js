"use strict";
const express = require('express');
const path = require('path');
const app = express();
const imageToBase64 = require('image-to-base64');
const WebSocket = require('ws');
const fs = require("fs");

const { StillCamera } = require("pi-camera-connect");
const stillCamera = new StillCamera();
const port = 8765;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});

const socketServer = new WebSocket.Server({ port: 3030 });

socketServer.on('connection', (ws) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);

  ws.on('message', (message) => {

    /* 
     * function takes() is triggered when server receives a message from the client
     * i. e. when user press the button
     * It takes the picture, saves it in the folder 'pics', format it in base64 string and send it to client 
   */
    function takes() {
      stillCamera.takeImage().then(image => {
        fs.writeFileSync(`/home/pi/pics/testing.jpg`, image);
        
        let base64
        imageToBase64("/home/pi/pics/testing.jpg") // Path to the image
          .then((response) => {
            base64 = response
          })
          .catch((error) => {
            console.log(error); // Logs an error if there was one
          })
        ws.send(base64)
      })
    }
    setInterval(takes, 5000);
  });

  ws.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});