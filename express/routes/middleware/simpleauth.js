var express = require('express'),
    router = express.Router(),
    config = require('config'),
    adminConfig = config.get('frontend.admin');

router.use(function (req, res, next) {
    var token = req.headers['x-tinyauth-password'];

    if (token === adminConfig.password) {
        next();
    } else {
        return res.status(403).send({
            success: false,
            message: 'Authentication required.'
        });
    }

});

module.exports = router;