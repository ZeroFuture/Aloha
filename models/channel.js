const mongoose = require('mongoose');

const channel = mongoose.Schema({
    name: {type: String, default: ''},
    members: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    isGroupChannel: {type: Boolean, default: true},
    messages: [{
        content: {type: String},
        senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        senderName: {type: String},
        timestamp: {type: Date, default: Date.now},
    }]
});

module.exports = mongoose.model('Channel', channel);