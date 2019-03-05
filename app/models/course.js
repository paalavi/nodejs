const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const CourseSchema = Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, required: true},
  slug: {type: String, required: true},
  type: {type: String, required: true},
  body: {type: String, required: true},
  price: {type: String, required: true},
  images: {type: Object, required: true},
  thumb: {type: String, required: true},
  tags: {type: String, required: true},
  time: {type: String, default: '00:00:00'},
  viewCount: {type: Number, default: 0},
  commentCount: {type: String, default: 0},
}, {timestamps: true});

CourseSchema.methods.typeToPersian = function() {
  switch (this.type) {
    case 'cash':
      return 'نقدی'
      break;
    case 'vip':
      return 'اعضای ویژه'
      break;
    default:
      return 'رایگان'
      break;
  }
};
CourseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Course', CourseSchema);