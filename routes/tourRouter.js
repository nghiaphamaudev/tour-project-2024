const express = require('express');
const tourController = require('./../controller/tourController');
const route = express.Router();
//Khi có một yêu cầu HTTP tới /tour/123, Express sẽ tự động trích xuất giá trị 123 và gán cho tham số id. Middleware tourController.checkId sẽ được gọi trong quá trình này.

route
  .route('/top-5-cheap')
  .get(tourController.aliasTours, tourController.getAllTours);

route.route('/tour-stats').get(tourController.getTourStarts);

route
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

route
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = route;
