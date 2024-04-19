const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');
const route = express.Router();

route.post('/signup', authController.signup);
route.post('/login', authController.login);

route.post('/forgotPassword', authController.forgotPassword);
route.patch('/resetPassword/:token', authController.resetPassword);

route
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

route
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = route;
