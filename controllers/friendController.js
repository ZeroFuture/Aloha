'use strict';

module.exports = function(_, async, User, friendRequest) {
    return {
        route: function(router) {
            router.post('/sendRequest', this.sendRequest);
            router.post('/acceptRequest', this.acceptRequest);
        },
        sendRequest: function(req, res) {
            async.parallel([
                // add request to receiver entry in user table.
                function(callback) {
                    if(req.body.receiverName) {
                        User.updateOne({
                            'username': req.body.receiverName,
                            'receivedRequest.userId': {$ne: req.user._id}, // duplicated request
                            'friendList.userId': {$ne: req.user._id}  // duplicated friend
                        }, {
                            $push: {
                                // push to request table
                                receivedRequest: {
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            }
                        },(err, count) => {
                            callback(err, count);
                        })
                    }
                },
                // add request to sender entry in user table
                function(callback) {
                    if(req.body.receiverName) {
                        User.updateOne({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.receiverName}, // cannot send to receiver again
                            'friendList.username': {$ne: req.body.receiverName}
                        }, {
                            $push: {
                                sentRequest: {
                                    username: req.body.receiverName
                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                }
            ], (err, results) => {
                console.log(`event=receivedRequest  matched entries ${results[0].n} modified entries ${results[0].nModified} `);
                console.log(`event=sentRequest matched entries ${results[1].n} modified entries ${results[1].nModified} `);
                if(results[0].n === 1 && results[0].nModified && results[1].n === 1 && results[1].nModified === 1) {
                    res.send("success")
                    return;
                }
                res.status(400).send("bad request");
            })
        },
        acceptRequest: function(req, res) {
            async.parallel([
                // add sender to receiver's channel list
                function(callback) {
                    if(req.body.senderId) {
                        User.updateOne({
                            '_id': req.user._id, //receiver
                            'friendList.useId': {$ne: req.body.senderId}, //sender
                        }, {
                            $push: {
                                friendList: { // sender info
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                }
                            },
                            $pull: {
                                receivedRequest: { //remove sender name
                                    userId: req.body.senderId,
                                    username: req.body.senderName
                                },
                                sentRequest: { // remove sender name
                                    username: req.body.senderName
                                }
                            }
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },
                // add receiver to sender's friend list and clean up requests
                function(callback) {
                    if(req.body.senderId) {
                        User.updateOne({
                            '_id': req.body.senderId, // sender
                            'friendList.userId': {$ne: req.user._id} //receiver
                        }, {
                            $push: {
                                friendList: { //receiver
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            },
                            $pull: {
                                sentRequest: { //receiver name
                                    username: req.user.username
                                },
                                receivedRequest: { //receiver info
                                    userId: req.user._id,
                                    username: req.user.username
                                }
                            }
                        }, (err, count) => {
                            callback(err, count)
                        });
                    }
                },
            ], (err, results) => {
                console.log(`event=receivedRequest  matched entries ${results[0].n} modified entries ${results[0].nModified} `);
                console.log(`event=sentRequest matched entries ${results[1].n} modified entries ${results[1].nModified} `);
                if ( results[0].n === 0 || results[0].n)
                if (err) {
                    res.status(400).send("bad request");
                    return
                }
                // if success, call friendRequest.createChannel
                friendRequest.createChannel(req, res);
            });
        }

    }

}