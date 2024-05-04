const mongoose = require('mongoose');
const Tour = require('./tourModel');
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

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5, //default
      ratingsQuantity: 0,
    });
  }
};
// khi lưu document này vào db nó sẽ gọi mthod tĩnh để xử lí các thông tin
//Sau khi tạo mới cũng gọi lại để tính toán lại rating

reviewSchema.post('save', function () {
  this.constructor.calcRatings(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete

//Dùng để lấy lại document khi chưa được update or delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  console.log(this.r);
  next();
});
//được thực hiện sau khi findOneAndUpdate or Delete
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
