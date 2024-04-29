const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = router;
