const express = require(`express`);
const http = require(`http`);
const path = require(`path`);
const socketio = require(`socket.io`);

const formatMessage = require(`./utilities/messages`);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Constants
const CHATBOT = `ChatCord Bot`;

// Set static folder
app.use(express.static(path.join(__dirname, `public`)));

// Run when a client connects
io.on(`connection`, (socket) => {
  // Welcome the current User
  socket.emit(`message`, formatMessage(CHATBOT, `Welcome to ChatCord!`));

  // Broadcast when a User connects
  socket.broadcast.emit(
    `message`,
    formatMessage(CHATBOT, `A User has joined the chat`)
  );

  // Runs when a User disconnects
  socket.on(`disconnect`, () => {
    io.emit(`message`, formatMessage(CHATBOT, `A User has left the chat`));
  });

  // Listent for chatMessage
  socket.on(`chatMessage`, (msg) => {
    // Emit the message to all Users
    io.emit(`message`, formatMessage(`USER`, msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
