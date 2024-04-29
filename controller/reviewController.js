const Review = require('./../models/reviewModel');
const factory = require('./handleFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review, { path: 'tour' });

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
