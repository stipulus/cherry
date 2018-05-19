var jwt = require('jsonwebtoken');
var config = require('../config');

/**
 * Middleware to verify token sent with requests
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req,res,next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['x-access-token'];

    if(token) {
        jwt.verify(token,config.secretKey,function(err,decodedToken) {
            if(err) {
                var message = '';
                if(err.name == 'TokenExpiredError' || token.ip !== req.connection.remoteAddress) {
                    message = 'Failed to authenticate: Token is expired';
                } else {
                    message = "Failed to authenticate.";
                }
                res.status(401).send(message);
            } else {
                req.user = decodedToken;
                req.user.townAdmin = (req.town && req.town.admin == req.user.id);
                if(req.user.admin) {
                    jwt.verify(req.user.admin,config.secretAdminKey, function(err,decodedAdminToken) {
                        if(err || decodedAdminToken.id != req.user.id) {
                            req.user.admin = false;
                        } else {
                            req.user.admin = true;
                        }
                        next();
                    });
                } else {
                    next();
                }
            }
        });
    }
    else {
        res.status(401).send('You must be logged in to do that.');
    }
};