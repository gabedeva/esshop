const mongoose = require('mongoose');
const slugify = require('slugify');

const UserActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'category name is required'],
            ref: 'User'
        },
        ipAddress: {
            type: String,
        },
        visitedRoutes: [
            {type: String,}
        ],
        timeSpent: {
            type: Number,
            default: 0
        },
        visitCount: {
            type: Number,
            default: 0
        },
        likedArticle: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Article'
            }
        ],
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

UserActivitySchema.set('toJSON', {getters: true, virtuals: true});

UserActivitySchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next();
});

UserActivitySchema.statics.findByName = function(name){
    return this.findOne({name: name});
}

module.exports = mongoose.model('UserActivity', UserActivitySchema);