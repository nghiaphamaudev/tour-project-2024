const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get data from the tour (include tour and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  //2) Build Temaplate
  //3) Render template using
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login into your account',
  });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
    user: res.locals.user,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //Tìm tất cả các booking có liên quan đến id user
  //Lấy ra tát cả các id lưu vào tourIds
  //Lấy ra tất cả các tour mà có id bằng với tourIds
  //2) Find tours with the returned Ids
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'My account',
    user: updatUser,
  });
});
