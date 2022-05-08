const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title for the review'],
            maxlength: 100,
            trim: true,

        },
        text: {
            type: String,
            required: [false, 'Please add some comment']
        },
        rating: {
            type: Number,
            // enum: ['1', '2', '3', '4', '5'],
            min: 1,
            max: 5,
            default: 0,
            required: [false, 'Please add a review between 1 and 5']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }, 
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id;
            }
        }
    }
)

// prevent the user from submitting more than one review per post
ReviewSchema.index({ post: 1, user: 1 }, {unique: true});

// static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(postId) {
    const obj = await this.aggregate([
        {
            $match: { post: postId }
        },
        {
            $group: {
                _id: '$post',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Post').findByIdAndUpdate(postId, {
            averageRating: obj[0].averageRating
        });
    } catch (err){
        console.log(err);
    }
};

// call getAverageCost  after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.post);
});

// call getAverageCost before remove
ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.post);
});

ReviewSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model('Review', ReviewSchema);