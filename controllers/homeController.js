'use strict';

module.exports = function(_, User, async, friendRequest) {
    return {
        route: function(router) {
            router.get('/home', this.homePage);
            // add friend
            router.post('/home/:user', this.postHomePage);
            router.get('/logout', this.logout);
        },
        homePage: function(req, res) {
            console.log(req.query);
            async.parallel([
                function(callback) {
                    User.findOne({'username': req.query.username}, 'friendsList groupsList -_id')
                        .populate('request.userId')
                        .exec((err, result) => {
                            callback(err, result);
                        })
                }
            ], (err, results) => {
                // request, friend and group list
                const res1 = results[0];
                console.log(res1);
                res.send(res1);
            })
        },
        postHomePage: function(req, res) {
            // friendRequest.PostRequest(req, res, '/home')
        },
        logout: function(req, res){
            req.logout();
            req.session.destroy((err) => {
                res.redirect('/');
            });
        }

    }
}