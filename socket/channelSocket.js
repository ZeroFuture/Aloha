'use strict';

module.exports = function(io, Channel) {
    io.on('connection', (socket) => {
        socket.on('joinChannel', (channelId, callback) => {
            socket.join(channelId);
            callback;
        });

        socket.on('createMessage', (message, callback) => {
            const userId = message.userId;
            const content = message.content;
            const channelId = message.channelId;
            const newMessage = {content: content, sender: userId, timestamp: Date.now()};
            Channel.findOneAndUpdate({'_id': channelId}, {$push: {messages: newMessage}});
            io.to(channelId).emit('newMessage', newMessage);
            callback;
        });
    });
}