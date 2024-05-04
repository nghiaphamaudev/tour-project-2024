const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema } = mongoose;

//mô tả cấu trúc dữ liệu của 1 tour trong monggodb
const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have less or equal then 40 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    price: {
      type: Number,
      require: [true, 'A tour must have a price'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a diffyculity '],
      enum: {
        values: ['medium', 'easy', 'difficult'],
        message: 'Difficulty is either : easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (priceDiscount) {
          return this.price > priceDiscount;
        },
        message: 'Discount price ({VALUE}) should be regular price',
      },
    },
    summary: {
      type: String,
      trim: true, //Laoji bỏ khoảng trống ở đầu và cuối
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour have must a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.pre(/^find/, function (next) {
  //this trỏ đến đổi tượng truy vấn hiện tại
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
//Virtual populate

tourSchema.virtual('reviews', {
  //Tạo ra 1 trường mới là reviews
  // tham chiếu đến doc review
  ref: 'Review',
  //tham chiếu cột tour trong doc review
  foreignField: 'tour',
  //tham chiếu đến id tour hiện tại
  localField: '_id',
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
