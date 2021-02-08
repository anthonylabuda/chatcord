// Initialize the WebSocket
const socket = io();

// Listen for a message on the WebSocket
socket.on(`message`, (message) => {
  console.log(message);
});
