// Track the Users in memory
const users = [];

// Get current User
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// Join User to chat
const userJoin = (id, room, username) => {
  const user = { id, room, username };

  users.push(user);

  return user;
};

module.exports = {
  getCurrentUser,
  userJoin,
};
