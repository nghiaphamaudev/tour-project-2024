const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not empty'] },
    rating: { type: Number, min: 1, max: 5 },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must  belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: [true, 'Review must  belong to a user'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  //để tạo ra các trường ảo dựa trên document đươc truy vấn
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  //nếu mở rộng ở đây thì đường router {{URL}}api/v1/tours/662f60b8db7f42a08353b0d6/reviews
  //sẽ bị lặp dữ liệu
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
