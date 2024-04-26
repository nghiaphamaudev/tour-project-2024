const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRouter = require('./reviewRouter');
const router = express.Router();

router.use('/:id/reviews', reviewRouter);
// Trong khi get 1 id Tour mà 1 đờng dẫn khớp với bên trên thì sẽ sử dụng reviewRouter

router
  .route('/top-5-cheap')
  .get(tourController.aliasTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStarts);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    // authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
