const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const route = express.Router();

route
  .route('/top-5-cheap')
  .get(tourController.aliasTours, tourController.getAllTours);

route.route('/tour-stats').get(tourController.getTourStarts);

route
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

route
  .route('/:id')
  .get(authController.protect, tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = route;
