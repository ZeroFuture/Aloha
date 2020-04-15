const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = mongoose.Schema({
    username: {type: String, unique: true, default: ''},
    email: {type: String, unique: true},
    gender: {type: String, default: ''},
    password: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''}
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: {type: String, default: ''}
    }],
    groupsList: [{
        groupId: {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
        groupName: {type: String, default: ''}
    }],
    totalRequest: {type: Number, default: 0},
});

user.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

user.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', user);