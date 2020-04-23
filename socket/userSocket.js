'use strict';

module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('joinUser', (user, callback) => {
            socket.join(user.username);
            callback();
        })

        socket.on('friendRequest', (request, callback) => {
            const friend = request.friendUsername;
            const user = request.username;
            io.to(friend).emit('newRequest', user);
            callback();
        });
    });
}