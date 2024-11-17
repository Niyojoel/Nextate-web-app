const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a Name'],
      unique: true, //gives a field an index in the db
      maxlength: [30, 'A tour name must have no more than 40 characters'],
      minlength: [5, 'A tour name must have no less than 40 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain alphabets']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult can either be : easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Ratings must not be above 5.0'],
      min: [1, 'Ratings must not be below 1.0'],
      set: (val) => Math.round(val * 10) / 10, //val.toFixed(2)
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a quoted Price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //only points to current doc on new doc creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // to hide the field
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON - geo-spatial data
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
      //use array to embed a doc in the tour doc
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
        ref: 'User' //specifies tours relations to users
      },
    ],
  },
  {
    timestamps: true, //shows createdAt & modifiedAt timeStamps on a doc
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } //to show virtual properties in the db
);

// a single field index
// tourSchema.index({price: 1}) //makes finding fast and exact.

// a compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); //for real location on the earth

//virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populating a reference
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // tour field on reviews
  localField: '_id', // tour field on tour itself
});

//---------------DOCUMENT MIDDLEWARES

// runs before only save() and create();
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

{
  // embedding tour guides (not suitable for tour users relations)

  /*tourSchema.pre('save', async function (next) {
    const tourGuides = this.guides.map(async (id) => await User.findById(id));
    this.guides = await Promise.all(tourGuides); // try await only 
    next();
});*/


  //runs after only save() and create() / gets access to the doc saved;
  {
    /*tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});*/
  }
}

//---------------QUERY MIDDLEWARE
//  /^find/ - all methods or hook (string here) that starts with 'find'
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  const queryReturnTime = Date.now() - this.start;
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: '-__v -passwordChangeAt' }); //populate uses the ids to embeds tour guides info ;
  next();
});

//---------------AGGREGATION MIDDLEWARE
{/*tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});*/}

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
