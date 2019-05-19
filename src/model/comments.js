const { Schema , model} = require('mongoose');
const ObjectId = Schema.ObjectId;
const CommentSchema = new Schema(
    {
        image_id : { type : ObjectId },
        name : { type : String },
        mail : { type : String },
        gravatar : { type : String },
        comment : { type : String },
        timestamp : { type : Date, default : Date.now }
    }
);

module.exports = model('comments', CommentSchema );