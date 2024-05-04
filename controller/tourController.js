const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handleFactory');
const AppError = require('./../utils/appError');
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

//'/tours-within/:distance/center/:latlng/unit/:unit',
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return new AppError(
      'Please provide latitu and longtitude in the format lat,lng!',
      401,
    );
  }
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371192 : 0.001;

  if (!lat || !lng) {
    return new AppError(
      'Please provide latitu and longtitude in the format lat,lng!',
      400,
    );
  }
  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: distance,
  });
});

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
