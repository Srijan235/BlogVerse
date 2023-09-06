const mongoose = require ('mongoose');
 const User = require('./User')

const PostSchema = new mongoose.Schema({
    title : String,
    summary : String,
    content : String,
    cover : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,ref: 'User'
    },
},{
    timestamps : true,
});

const Post = mongoose.model('Post',PostSchema);

module.exports = Post;