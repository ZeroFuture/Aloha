'use strict'
module.exports = function(User, async, Message, friendRequest, Group) {
    return {
        SetRouting: function(router) {
            // generate chat page
            router.get('/group/:name', this.groupPage);
            //post message
            router.post('/group/:name', this.groupPostPage);

            router.get('/logout', this.logout);
        },
        groupPage: function(req, res) {

        },
        groupPostPage: function(req, res) {

        },
        logout: function(req, res) {
            req.logout();
            req.session.destroy((err) => {
                res.redirect('/');
            });
        }
    }
}