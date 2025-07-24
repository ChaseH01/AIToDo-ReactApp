const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//define the schema a user
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

//hash the password before saving the user to the database
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //only hash if password is new/changed
    this.password = await bcrypt.hash(this.password, 10);
    next(); //saves the user
});

//compare passwords during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // Compare hashed password
};

// Export the model to be used in other parts of the app
module.exports = mongoose.model('User', UserSchema);
