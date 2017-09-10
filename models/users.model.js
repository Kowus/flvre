var mongoose = require('mongoose');
var securepassword = require('secure-password');
pwd = securepassword();
var userSchema = new mongoose.Schema({
    auth: {
        local: {
            email: String,
            password: String,
            firstname: String,
            lastname: String,
            profile_photo:String
        },
        facebook: {
            id: String,
            token: String,
            email: String,
            name: String,
            profile_photo: String
        },
        twitter: {
            id: String,
            token: String,
            displayName: String,
            username: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String,
            profile_photo: String
        }
    },
    role:{type:String, default:'user'},
    reviews:[{review_id:mongoose.Schema.Types.ObjectId}],
    cart:[{
        item_id:mongoose.Schema.Types.ObjectId,
        quantity: Number
    }],
    coupons:[{coupon_id:mongoose.Schema.Types.ObjectId}]
});








module.exports = mongoose.model('User', userSchema);