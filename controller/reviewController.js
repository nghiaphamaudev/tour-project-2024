const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().select('-id');
  res.status(200).json({
    status: 'success',
    data: {
      quantity: reviews.length,
      reviews: reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //them vao body cac truong chua co
  // console.log(req.user);
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user._id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      reviews: newReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return next(new AppError('The ID not existed', 400));
  }
  res.status(200).json({
    status: 'success',
  });
});
