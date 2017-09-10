var mongoose = require('mongoose');
var securePassword = require('secure-password');
pwd = securePassword();
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


userSchema.methods.generateHash = function (password) {
    const userPassword = Buffer.from(password);
    pwd.hash(userPassword, function (err, hash) {
        if (err) throw err;

        // Save hash somewhere
        pwd.verify(userPassword, hash, function (err, result) {
            if (err) throw err;

            if (result === securePassword.INVALID_UNRECOGNIZED_HASH) return console.error('This hash was not made with secure-password. Attempt legacy algorithm');
            if (result === securePassword.INVALID) return console.log('Imma call the cops');
            if (result === securePassword.VALID) {
                return hash;
            }
            if (result === securePassword.VALID_NEEDS_REHASH) {
                console.log('Yay you made it, wait for us to improve your safety');

                pwd.hash(userPassword, function (err, improvedHash) {
                    if (err) console.error('You are authenticated, but we could not improve your safety this time around');
                    return improvedHash;
                    // Save improvedHash somewhere
                })
            }
        })
    });
};

userSchema.methods.validPassword = function (password) {
  pwd.verify(Buffer.from(password), this.auth.local.password, function (err, result) {
      return result === securePassword.VALID;
  });
};





module.exports = mongoose.model('User', userSchema);