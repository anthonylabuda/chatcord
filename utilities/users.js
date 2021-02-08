// Track the Users in memory
const users = [];

// Get current User
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// Get the Users in a given room
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

// Join User to chat
const userJoin = (id, room, username) => {
  const user = { id, room, username };

  users.push(user);

  return user;
};

// Leave the chat
const userLeave = (id) => {
  // Get the index of the User
  const index = users.findIndex((user) => user.id === id);

  // Check if index was found
  if (index !== -1) {
    // Remove the User
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  getCurrentUser,
  getRoomUsers,
  userJoin,
  userLeave,
};
