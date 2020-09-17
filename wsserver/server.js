const express = require('express');
const path = require('path');
const app = express();
const imageToBase64 = require('image-to-base64');
const WebSocket = require('ws');
const port = 8765;
var server = app.listen(port, "10.0.0.223");
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
    // messages.push(message);
    // socketServer.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify([message]));
    //   }
    // });
    socketClient.send(base64)
    console.log("we got something!")
    console.log(message)
    
  });

  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});

imageToBase64("./cutedog.jpeg") // Path to the image
    .then(
        (response) => {
            //console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
            base64 = response
            //console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )