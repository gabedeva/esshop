const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            unique: true,
            // maxlength: [100, 'product name cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Description is required for the post']
        },
        richDescription: {
            type: String,
            required: false,
            default: ''
        },
        image: {
            type: String,
            required: false,
            default: ''
        },
        images: [
            {
                type: String,
                required: false
            }
        ],
        brand: {
            type: String,
            required: false,
            default: ''
        },
        price: {
            type: Number,
            default: 0,
            required: [true, 'Product price is reqquired']
        },
        countInStock: {
            type: Number,
            min: 0,
            max: 255,
            required: [true, 'number of product in stock is required']
        },
        rating: {
            type: Number,
            required: false,
            default: ''
        },
        numReviews: {
            type: Number,
            required: false,
            default: 0
        },
        isFeatured: {
            type: Boolean,
            required: false
        },
        date: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ['approved', 'pending', 'published'],
            default: 'pending'
        },

        slug: String,

        viewsCount: {
            type: Number,
            default: 0,
        },

        comments: [
            
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            }
        ],
        
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        
        category:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                required: [true, 'product category is required']
            }
        
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

ProductSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

ProductSchema.set('toJSON', { getters: true, virtuals: true });

ProductSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next();
});

ProductSchema.findByTitle = function(title){
    return this.findOne({title: title})
}

ProductSchema.statics.findByCategory = function(categories){
    return this.findOne({categories: categories})
}

module.exports = mongoose.model('Product', ProductSchema);