const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        shippingAdddress1: {
            type: String,
            required: [true, 'shippingAdddress1 is required']
        },
        
        shippingAdddress2: {
            type: String,
            required: [true, 'shippingAdddress2 is required']
        },
        
        city: {
            type: String,
            default: ''
        },

        zip: {
            type: String,
            default: ''
        },

        country: {
            type: String,
            default: ''
        },

        phone: {
            type: String,
            required: [true, 'phone is required']
        },

        status: {
            type: String,
            required: true,
            default: 'Pending'
        },

        totalPrice: {
            type: Number,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        dateOrdered: {
            type: Date,
            default: Date.now,
        },

        orderItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'OrderItem',
                required: true
            }
        ]

    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
            }
        }
    }
);

OrderSchema.set('toJSON', { getters: true, virtuals: true });

module.exports = mongoose.model("Order", OrderSchema);

/*
    "orderItems": [
        {
            "quantity": 3,
            "product": "5fcfc486ae6a2585hfbv8d8"
        },
            {
            "quantity": 2,
            "product": "5fa2c486ae6a2585h4028d8"
        }
    ],

    "shippingAddress1": "Flower Street, 45",
    "shippingAddress2": "1-B",
    "city": "Prque",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+191485757392",
    "user": "5fd51bcfe39e85624a3b45"

*/