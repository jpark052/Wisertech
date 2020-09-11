const http = require("http");
const WebSocketServer = require("websocket").server

// let connection = null;

const httpserver = http.createServer((req, res) => {

    console.log("we have a received a request");
})

const websocket = new WebSocketServer({
    "httpServer" : httpserver
})

websocket.on("request", request => {

    connection = request.accept(null, request.origin)
    connection.on("open", e => console.log("opened!!"))
    connection.on("close", e => console.log("closed!!"))
    connection.on("message", message => {

        console.log(`We received message from client: ${message.utf8Data}`)
    })
    
   // send5secs();
})

httpserver.listen(8080, () => console.log("my server is listening on port 8080"))

// function send5secs(){
//     connection.send(`Message ${Math.random()}`)
//     setTimeout(send5secs, 5000)
// }