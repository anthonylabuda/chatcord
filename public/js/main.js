// Get the chat form DOM element
const chatForm = document.getElementById(`chat-form`);

// Get the chat messages DOM element
const chatMessages = document.querySelector(`.chat-messages`);

// Initialize the WebSocket
const socket = io();

// Listen for a message on the WebSocket from the server
socket.on(`message`, (message) => {
  console.log(message);

  // Output the message to the DOM
  outputMessage(message);

  // Scroll to the bottom of the chat when a new message is emitted
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit the message
chatForm.addEventListener(`submit`, (event) => {
  // Prevent the form from submitting
  event.preventDefault();

  // Get the message from the form
  const msg = event.target.elements.msg.value;

  // Emit the message to server
  socket.emit(`chatMessage`, msg);

  // Clear chat form input
  event.target.elements.msg.value = "";

  // Focus on the chat form input
  event.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (message) => {
  // Create a new message DOM element
  const div = document.createElement(`div`);

  // Add message class to the new DOM element
  div.classList.add(`message`);

  // Set the inner HTML of the new DOM element
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p><p class="text">${message}</p>`;

  // Push the new DOM element to the document
  document.querySelector(`.chat-messages`).appendChild(div);
};
