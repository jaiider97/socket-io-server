const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const  {  resolve, dirname  } = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initializations
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(resolve("frontend/dist")));

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (body) => {
    io.emit('message', body);
    
  });
});

app.post('/emitir-evento', async (req, res) => {
    // Recibe datos del front
    const eventData = await req.body;
    console.log(`🚀 ~ eventData:------------>>>>>>`, await eventData);
    let event = req.body?.event;
    console.log(`🚀 ~ event:------------>>>>>>`, event);
  
    // Emite un evento a través de Socket.IO
    io.emit(event, eventData);
    res.status(200).send('Evento emitido exitosamente');
  });

server.listen(8080);
console.log(`server on port ${8080}`);