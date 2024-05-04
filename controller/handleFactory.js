const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/APIFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('The document not found with that ID', 404));
    }
    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('The document not found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        newDoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id); //5c88fa8cf4afda39709c2955
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('The document not found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET Reviews on tour (hack)
    let filter;
    if (req.params.id) filter = { tour: req.params.id };
    let features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFiedls()
      .paginate();

    const docs = await features.query; //Lấy ra chuỗi truy vấn

    //SEND RESPOND
    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: {
        data: docs,
      },
    });
  });
