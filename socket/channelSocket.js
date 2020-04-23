'use strict';

module.exports = function(io, Channel) {
    io.on('connection', (socket) => {
        socket.on('joinRoom', (room) => {
            console.log(`joining room ${room}`);
            socket.join(room);
        });

        socket.on('leaveRoom', (room) => {
            console.log(`leaving room ${room}`);
            socket.leave(room);
        });

        socket.on('createMessage', (json) => {
            const message = json.message;
            const channelId = json.channelId;

            const senderId = message.senderId;
            const senderName = message.senderName;
            const content = message.content;
            const newMessage = {content: content, senderId: senderId, senderName: senderName, timestamp: Date.now()};
            Channel.findOneAndUpdate({'_id': channelId}, {$push: {messages: newMessage}});
            console.log(`sending to room ${channelId}`);
            io.emit('newMessage' + channelId, {message: newMessage, channel: channelId});
        });
    });
}