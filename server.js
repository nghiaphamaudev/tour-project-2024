const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE_LOCAL;
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXEPTION!🎆 Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

const mongooseConnect = async (db) => {
  try {
    await mongoose.connect(db);
    console.log('The connect is succesfully');
  } catch (error) {
    console.log('The connect is failed', error);
  }
};
mongooseConnect(DB);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION🎆 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
