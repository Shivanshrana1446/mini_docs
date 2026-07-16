const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seededUsers = [
  { name: 'Alice Johnson', email: 'alice@example.com', password: 'Password123' },
  { name: 'Bob Lee', email: 'bob@example.com', password: 'Password123' }
];

const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count > 0) {
    return;
  }

  const users = await Promise.all(
    seededUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10);
      return {
        name: user.name,
        email: user.email,
        passwordHash
      };
    })
  );

  await User.insertMany(users);
  console.log('Seeded users into database');
};

module.exports = seedUsers;
