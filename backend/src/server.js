const app = require('./app');
const connectDB = require('./utils/db');
const seedUsers = require('./utils/seedUsers');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => seedUsers())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to start server', error);
    process.exit(1);
  });
