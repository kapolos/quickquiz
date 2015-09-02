var express = require('express'),
    router = express.Router(),
    orm = require('sequelize-singleton'),
    Answer = orm.models.Answer,
    User = orm.models.User;

router.put('/feAnswers/:id', function (req, res) {
    var out = {}, feAnswer = req.body.feAnswer;

    // Create a user in the database if not already there
    User.findOne({where: {cookie: feAnswer.chosenByUser}})
        .then(function (usr) {
            // Create one if it does not exist
            if (!usr) {
                return User.create({
                    nickname: feAnswer.userNickname,
                    cookie: feAnswer.chosenByUser
                }).then(function (usr) {
                    return usr;
                });
            }

            // If it exists, update the nickname if needed
            if (usr.nickname !== feAnswer.userNickname) {
                usr.nickname = feAnswer.userNickname;

                return usr.save()
                    .then(function () {
                        return usr;
                    });
            }

            return usr;
        })
        .then(function (usr) {
            // Associate the user with the answer
            return Answer.findById(req.params.id)
                .then(function (ans) {
                    ans.addUser(usr);
                });
        })
        .then(function () {
            res.json({});
        });
});

module.exports = router;