'use strict';

module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('friendRequest', (request) => {
            const friend = request.friendUsername;
            const username = request.username;
            const userId = request.userId;
            console.log("sending request to " + friend);
            io.emit('newRequest' + friend, {senderName: username, senderId: userId});
        });

        socket.on('acceptRequest', (request) => {
            const friend = request.friendUsername;
            const channel = request.channel;
            console.log("accepted request from " + friend);
            console.log("channel created");
            console.log(channel);
            io.emit('confirmedRequest' + friend, {channel: channel});
        });

        socket.on('createMessage', (json) => {
            const message = json.message;
            const channelId = json.channelId;

            const senderId = message.senderId;
            const senderName = message.senderName;
            const content = message.content;
            const newMessage = {content: content, senderId: senderId, senderName: senderName, timestamp: Date.now()};
            console.log("sending message");
            io.emit('newMessage' + channelId, {message: newMessage, channel: channelId});
        });
    });
}