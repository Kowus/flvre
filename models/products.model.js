var mongoose = require('mongoose');
var productShema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    }, images: [
        {
            thumb: String,
            full:[{
                src:String,
                rel:String
            }]
        }
    ],
    qty: Number,
    tags: Array,
    description: String,
    specifications: {
        sizes: [{
            class: Array,
            qty: Number
        }]
    },
    featured: {type: Boolean, default: false},
    reviews: [
        {
            user: mongoose.Schema.Types.ObjectId,
            stars: Number,
            message: String,
            date: String
        }
    ], dateAdded: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Product', productShema);