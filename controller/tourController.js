const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');
exports.aliasTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price,-ratingsAverage';
  req.query.fields = 'name,duration,price,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
//populate({path: "reviews"})

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.createTour = factory.createOne(Tour);

exports.getTourStarts = catchAsync(async (req, res, next) => {
  const tours = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});
