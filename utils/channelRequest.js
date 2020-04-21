'use strict';

module.exports = function(User, Channel) {
    return {
        createChannel: function(req, res) {
            const newChannel = new Channel();
            newChannel.name = req.body.name;
            const creator = {userId: req.user._id, username: req.user.username};
            newChannel.members.push(creator);

            newChannel.save((error) => {
                if (error) {
                    console.log(error);
                    res.send("error creating new channel");
                    return;
                }
            });

            const createdChannel = {channelId: newChannel._id, channelName: newChannel.name};
            User.findOneAndUpdate({username: req.user.username}, {$push: {channelList: createdChannel}}, function(error, user) {
                if (error) {
                    console.log(error);
                    res.send('failed add channel to the user');
                    return;
                }
            });

            res.json(newChannel);
        },

        joinChannel: function(req, res) {
            const id = req.params.id;
            Channel.findOne({'_id': id}, (err, channel) => {
                if (err) {
                    res.send("error get channel");
                } else if (channel) {
                    const exisitngMember = channel.members.map(member => member.userId).filter(id => id === req.user._id);

                    if (exisitngMember) {
                        res.send("user is already in the channel");
                    } else {
                        const createdChannel = {channelId: channel._id, channelName: channel.name};
                        User.findOneAndUpdate({username: req.user.username}, {$push: {channelList: createdChannel}}, function(error, user) {
                            if (error) {
                                res.send('failed add channel to the user');
                                return;
                            }
                        });

                        const newMember = {userId: req.user._id, username: req.user.username};
                        Channel.findOneAndUpdate({'_id': id}, {$push: {members: newMember}}, function(error, updatedChannel) {
                            if (error) {
                                res.send("failed update channel members");
                            } else {
                                updatedChannel.members.push(newMember);
                                res.json(updatedChannel);
                            }
                        });
                    }
                } else {
                    res.send("channel not found");
                }
            });
        },

        publishMessage: function(req, res) {
            const id = req.params.id;
            const newMessage = {content: req.body.message, sender: req.user._id};
            Channel.findOneAndUpdate({'_id': id}, {$push: {messages: newMessage}}, function(err, channel) {
                if (err) {
                    res.send("failed update channel messages");
                } else if (channel) {
                    channel.messages.push(newMessage);
                    res.json(channel);
                } else {
                    res.send("channel not found");
                }
            });
        }
    }
};