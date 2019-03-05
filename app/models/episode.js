const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const episodeSchema = Schema({
    course : { type : Schema.Types.ObjectId , ref : 'Course'},
    title : { type : String , required : true },
    type : { type : String , required : true },
    body : { type : String , required : true },
    time : { type : String , default : '00:00:00' },
    number : { type : Number , required : true },
    videoUrl : { type : String , required : true },
    downloadCount : { type : Number , default : 0 },
    viewCount : { type : Number , default : 0 },
    commentCount : { type : String , default : 0 },
} , { timestamps : true });

episodeSchema.plugin(mongoosePaginate);

episodeSchema.methods.typeToPersian = function() {
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

module.exports = mongoose.model('Episode' , episodeSchema);