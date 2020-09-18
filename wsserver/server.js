const express = require('express');
const path = require('path');
const app = express();
const imageToBase64 = require('image-to-base64');
const WebSocket = require('ws');
const fs = require("fs");
const { StillCamera } = require("pi-camera-connect");
const stillCamera = new StillCamera();
const port = 8765;
var server = app.listen(port, "127.0.0.1");
var base64

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
  console.log(`listening http://localhost:${port}`);
});

const socketServer = new WebSocket.Server({ port: 3030 });

const messages = ['Start Chatting!'];

socketServer.on('connection', (socketClient) => {
  console.log('connected');
  console.log('client Set length: ', socketServer.clients.size);
  socketClient.send(JSON.stringify(messages));

  socketClient.on('message', (message) => {
    
    function takes() {
	stillCamera.takeImage().then(image => {
		fs.writeFileSync(`/home/pi/pics/testing.jpg`, image);
        
        imageToBase64("/home/pi/pics/testing.jpg") // Path to the image
    .then((response) => {
            base64 = response
        })
    .catch((error) => {
            console.log(error); // Logs an error if there was one
        })
        
        
        socketClient.send(base64)
		})
}
    setInterval(takes, 5000);
    
   // socketClient.send(base64)
    
  });

  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});

imageToBase64("./cutedog.jpeg") // Path to the image
    .then((response) => {
            base64 = response
        })
    .catch((error) => {
            console.log(error); // Logs an error if there was one
        })
        

