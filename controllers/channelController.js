'use strict';

module.exports = function(_, Channel, channelRequest) {
    return {
        route: function(router) {
            router.post('/channel/create', function(req, res) {
                channelRequest.createChannel(req, res);
            });
            router.get('/channel/:id', this.getChannel);
            router.post('/channel/join/:id', function(req, res){
                channelRequest.joinChannel(req, res);
            }); 
            router.post('/channel/publish/:id', function(req, res) {
                channelRequest.publishMessage(req, res);
            });
        },
        getChannel: function(req, res) {
            const id = req.params.id;
            Channel.findOne({'_id': id}, (err, channel) => {
                if (err) {
                    res.send("error get channel");
                } else if (channel) {
                    res.json(channel);
                } else {
                    res.send("channel not found");
                }
            });
        }
    }
}