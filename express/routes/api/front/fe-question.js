var express = require('express'),
    router = express.Router(),
    R = require("ramda"),
    orm = require('sequelize-singleton'),
    Answer = orm.models.Answer,
    User = orm.models.User,
    Question = orm.models.Question;

router.get('/feQuestions', function (req, res) {
    var userCookie = R.propOr('', 'userid')(req.query), qna;

    if (!userCookie) {
        qna = allQuestionIds();
    } else {
        qna = User.findOne({where: {cookie: userCookie}})
            .then(function (usr) {
                if (!usr) {
                    return Promise.all([[], allQuestionIds()]);
                } else {
                    return Promise.all([findQuestionIdsAnsweredByUser(usr.id), allQuestionIds()]);
                }
            })
            .then(function (res) {
                return R.difference(res[1], res[0]);
            })
    }

    qna.then(function (pool) {
        return formattedQnA(pool[Math.floor(Math.random() * pool.length)]);
    })
        .then(function (data) {
            res.json(data);
        });

});

module.exports = router;

function formattedQnA(id) {
    var search;
    console.log(id);

    if (!id) {
        return [];
    }

    return Question.findById(id, {include: [orm.models.Answer]})
        .then(function (data) {
            var out = {
                feQuestions: [],
                feAnswers: []
            }, answerIds = [];

            data.Answers.forEach(function (ans) {
                out.feAnswers.push(ans);
                answerIds.push(ans.id);
            });

            out.feQuestions.push({
                id: data.id,
                text: data.text,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                answers: answerIds
            });

            return out;
        });
}

function findQuestionIdsAnsweredByUser(userId) {
    return User.find({
        attributes: ['id'],
        where: {
            id: userId
        },
        include: [{
            attributes: ['id'],
            model: Answer,
            include: [{
                model: Question,
                attributes: ['id']
            }]
        }]
    })
        .then(function (data) {
            var qIds = [];
            if (data) {
                data.Answers.forEach(function (q) {
                    qIds.push(q.Question.id);
                });
            }

            return qIds;
        });
}

function allQuestionIds() {

    return Question.findAll({
        attributes: ['id']
    })
        .then(function (item) {
            var qIds = [];
            if (item) {
                item.forEach(function (q) {
                    qIds.push(q.id);
                })
            }

            return qIds;
        });
}
