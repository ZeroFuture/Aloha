const mongoose = require('mongoose');

var message = mongoose.Schema({
    content: {type: String},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', message);