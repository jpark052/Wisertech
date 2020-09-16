const express = require('express');
const path = require('path');
const app = express();
const WebSocket = require('ws');
const port = 8765;
var server = app.listen(port, "10.0.0.223");

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
    messages.push(message);
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message]));
      }
    });
  });

  socketClient.on('close', (socketClient) => {
    console.log('closed');
    console.log('Number of clients: ', socketServer.clients.size);
  });
});


// import Express from 'express';
// import http from 'http';
// import WebSocket from 'ws';

// const app = Express();

// //initialize a simple http server
// const server = http.createServer(app);

// //initialize the WebSocket server instance
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (ws) => {

//     //connection is up, let's add a simple simple event
//     ws.on('message', (message) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         ws.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection    
//     ws.send('Hi there, I am a WebSocket server');
// });

// //start our server
// server.listen(process.env.PORT || 8999, () => {
//     console.log(`Server started on port ${server.address().port} :)`);
// });

// import Server from 'ws';

// const wss = new Server({ port: 8080 });

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });

//   ws.send('something');
// });