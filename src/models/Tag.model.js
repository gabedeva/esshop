const mongoose = require('mongoose');
const slugify = require('slugify');

const TagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [false, 'Please add a tag name']
        },
        description: {
            type: String,
            required: [false, 'Please add a description for the tag name']
        },
        slug: String,

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
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

TagSchema.set('toJSON', { getters: true, virtuals: true });

TagSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
});

TagSchema.findByPost = function(post){
    return this.findOne({ post: post });
}

module.exports = mongoose.model('Tag', TagSchema);