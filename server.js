const express = require(`express`);
const http = require(`http`);
const path = require(`path`);
const socketio = require(`socket.io`);

const formatMessage = require(`./utilities/messages`);
const { getCurrentUser, userJoin } = require(`./utilities/users`);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Constants
const CHATBOT = `ChatCord Bot`;

// Set static folder
app.use(express.static(path.join(__dirname, `public`)));

// Run when a client connects
io.on(`connection`, (socket) => {
  // Join a room
  socket.on(`joinRoom`, ({ room, username }) => {
    // Create a new User
    const user = userJoin(socket.id, room, username);

    // Join the room
    socket.join(user.room);

    // Welcome the current User
    socket.emit(`message`, formatMessage(CHATBOT, `Welcome to ChatCord!`));

    // Broadcast when a User connects
    socket.broadcast
      .to(user.room)
      .emit(
        `message`,
        formatMessage(CHATBOT, `${user.username} has joined the chat`)
      );
  });

  // Listent for chatMessage
  socket.on(`chatMessage`, (msg) => {
    // Emit the message to all Users
    io.emit(`message`, formatMessage(user.username, msg));
  });

  // Runs when a User disconnects
  socket.on(`disconnect`, () => {
    io.emit(`message`, formatMessage(CHATBOT, `A User has left the chat`));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
