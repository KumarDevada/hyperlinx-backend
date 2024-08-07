const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    websiteName: { type: String, required: true },
    link: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uniqueKey: { type: String, required: true, unique: true },
    links: [linkSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
