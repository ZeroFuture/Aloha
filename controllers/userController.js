'use strict';

module.exports = function(_, passport, validator) {
    return {
        route: function(router) {
            router.post('/user/login', 
                [
                    validator.check('email').isEmail().withMessage('Email is invalid'),
                    validator.check('password').notEmpty().withMessage('Password must be at least 5 characters.'),
                ], 
                this.postValidation, 
                this.postLogin,
                function(req, res) {
                    res.json(req.user);
                }
            );
            router.post('/user/signup',
                [
                    validator.check('username').notEmpty().isLength({min: 5}).withMessage('Username must be at least 5 characters.'),
                    validator.check('email').isEmail().withMessage('Email is invalid'),
                    validator.check('password').notEmpty().isLength({min: 5}).withMessage('Password must be at least 5 characters.'),
                ], 
                this.postValidation, 
                this.postSignUp,
                function(req, res) {
                    res.json(req.user);
                }
            );
        },

        postValidation: function(req, res, next) {
            const err = validator.validationResult(req);
            const reqErrors = err.array();
            const errors = reqErrors.filter(e => e.msg !== 'Invalid value');
            let messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            if (messages.length > 0) {
                res.json(messages);
            } else {
                return next();
            }
        },

        postLogin: passport.authenticate('local.login'),
        postSignUp: passport.authenticate('local.signup'),
    }
}