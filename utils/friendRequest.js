module.exports = function(async, User, Channel){
    return {
        createChannel: function(req, res) {
            const newChannel = new Channel();
            newChannel.name = req.body.senderName+ ', ' + req.user.username; //not current username
            newChannel.members.push({
                userId: req.user._id,
                username: req.user.username
            });
            newChannel.members.push({
                userId: req.body.senderId,
                username: req.body.senderName
            })
            newChannel.isGroupChannel = false;

            newChannel.save((error) => {
                if(error) {
                    console.log(error.message);
                    res.send({
                        description: "fail to create new channel ",
                        message: error.message
                    })
                    return;
                }
            })

            const createdChannel = {
                channelId: newChannel._id,
                channelName: newChannel.name,
                isGroupChannel: newChannel.isGroupChannel
            };
            User.findOneAndUpdate({username: req.user.username}, {$push: {channelList: createdChannel}}, function(error, user) {
                if (error) {
                    console.log(error);
                    res.send(`failed add channel to the user, userId=${req.user._id}`);
                    return;
                }
            });
            User.findOneAndUpdate({username: req.body.senderName}, {$push: {channelList: createdChannel}}, function(error, user) {
                if (error) {
                    console.log(error);
                    res.send(`failed add channel to the user, userId=${req.body.senderId}`);
                    return;
                }
            });
            res.json(newChannel);
            return createdChannel
        },
    }
}