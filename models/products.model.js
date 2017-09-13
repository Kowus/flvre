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
    }, images: {
        thumb: String,
        full: [{
            src: String,
            rel: String
        }]
    },
    qty: Number,
    tags: Array,
    description: String,
    shortdes:String,
    specifications: {
        materials:Array,
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


productShema.pre('save', function (next) {
    var product = this;
    var tot = 0;
    if (this.isModified('specifications') || this.isNew) {
        product.specifications.sizes.forEach(function (item, index, array) {
            tot += Number(item.qty);
        });
        product.qty = tot;
        next();
    } else {
        return next();
    }
});

module.exports = mongoose.model('Product', productShema);