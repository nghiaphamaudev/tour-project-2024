const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
exports.getOverview = catchAsync(async (req, res) => {
  //1) Get tour data from collection
  const tours = await Tour.find();
  //2) Build template

  //3) Render that template using tour data from 1
  res.status(200).render('overview', {
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1) Get data from the tour (include tour and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
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
