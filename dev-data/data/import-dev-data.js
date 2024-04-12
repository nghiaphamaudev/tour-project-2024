const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
require('dotenv').config({ path: './../../config.env' });
const DB = process.env.DATABASE_LOCAL;
console.log(DB);

const mongooseConnect = async (db) => {
  try {
    await mongoose.connect(db);
    console.log('The connect is succesfully');
  } catch (error) {
    console.log('The connect is failed', error);
  }
};
mongooseConnect(DB);
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data succesfully loaded');
    process.exit();
  } catch (error) {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data succesfully delete');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
