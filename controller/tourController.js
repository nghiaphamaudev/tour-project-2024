const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
exports.aliasTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price,-ratingsAverage';
  req.query.fields = 'name,duration,price,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query) //Truyền tất cả bản ghi nhưng chưa truy vấn
    .filter()
    .sort()
    .limitFiedls()
    .paginate();

  const tours = await features.query; //Lấy ra chuỗi truy vấn

  //SEND RESPOND
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('The tour not found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('The tour not found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('The tour not found with that ID', 404));
  }
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
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
