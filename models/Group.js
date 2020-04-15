const mongoose = require('mongoose');

const group = mongoose.Schema({
    id: {type: String, default: ''},
    name: {type: String, default: ''},
    members: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }]
});

module.exports = mongoose.model('Group', group);