const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE_LOCAL;

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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
