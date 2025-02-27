const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '10s' }
});

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
