const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = mongoose.Schema({
    username: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    receivedRequest: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    friendList: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    channelList: [{
        channelId: {type: mongoose.Schema.Types.ObjectId, ref: 'Channel'},
        channelName: {type: String, default: ''},
        isGroupChannel: {type: Boolean, default: true},
    }],
});

user.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

user.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);