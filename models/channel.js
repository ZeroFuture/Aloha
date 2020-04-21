const mongoose = require('mongoose');

const channel = mongoose.Schema({
    id: {type: String, default: ''},
    name: {type: String, default: ''},
    members: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    isGroupChannel: {type: Boolean, default: true},
    messages: [{
        message: {type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    }]
});

module.exports = mongoose.model('Channel', channel);