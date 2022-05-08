const mongoose = require('mongoose');
const slugify = require('slugify');

const CommentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Please add a comment'],
            maxlength: [250, 'Comment must be between 2 and 250 characters long']
        },
        emoji: {
            type: String,
            required: false
        },
        sticker: {
            type: String,
            required: false
        },
        likes: {
            type: Array,
            default: []
        },
        reply: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['approved', 'pending'],
            default: 'pending'
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        slug: String,
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id
            }
        }
    }
)

CommentSchema.set('toJSON', {getters: true, virtuals: true});

CommentSchema.pre('save', function(next) {
    this.slug = slugify(this.comment, {lower: true})
    next();
});

module.exports = mongoose.model('Comment', CommentSchema);