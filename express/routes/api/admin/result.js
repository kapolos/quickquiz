var express = require('express'),
    router = express.Router(),
    simpleauth = require('../../middleware/simpleauth'),
    R = require("ramda"),
    orm = require('sequelize-singleton'),
    Answer = orm.models.Answer,
    User = orm.models.User,
    Question = orm.models.Question;

router.get('/results', simpleauth, function (req, res) {
    return User.findAll({
        include: [{
            model: Answer,
            include: [{model: Question}],
            sort: 'desc'
        }]
    })
        .then(function (rows) {
            var i = 1;
            var data = rows.map(function (row) {
                return row.Answers.map(function (ans) {
                    return {
                        id: i++,
                        userId: row.cookie,
                        userNickname: row.nickname,
                        question: ans.Question.text,
                        answer: ans.text,
                        createdAt: ans.UserAnswers.createdAt,
                        updatedAt: ans.UserAnswers.updatedAt
                    };
                });
            });


            res.json({results: R.flatten(data)});
        })
});

module.exports = router;