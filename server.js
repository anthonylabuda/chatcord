const express = require(`express`);
const http = require(`http`);
const path = require(`path`);
const socketio = require(`socket.io`);

const formatMessage = require(`./utilities/messages`);
const {
  getCurrentUser,
  getRoomUsers,
  userJoin,
  userLeave,
} = require(`./utilities/users`);

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

    // Send users and room info
    io.to(user.room).emit(`roomUsers`, {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listent for chatMessage
  socket.on(`chatMessage`, (msg) => {
    // Get the current User
    const user = getCurrentUser(socket.id);

    // Emit the message to all Users
    io.to(user.room).emit(`message`, formatMessage(user.username, msg));
  });

  // Runs when a User disconnects
  socket.on(`disconnect`, () => {
    // Get the current User
    const user = userLeave(socket.id);

    // Check if the User exists
    if (user) {
      // Broadcast when a User leaves
      io.to(user.room).emit(
        `message`,
        formatMessage(CHATBOT, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit(`roomUsers`, {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
