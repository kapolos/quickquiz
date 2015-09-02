var express = require('express'),
    router = express.Router(),
    simpleauth = require('../../middleware/simpleauth'),
    orm = require('sequelize-singleton'),
    Question = orm.models.Question;

router.get('/questions', simpleauth, function (req, res) {
    orm.models.Question.findAll({include: [orm.models.Answer]})
        .then(function (data) {
            var out = {
                questions: [],
                answers: []
            };
            data.forEach(function (item) {
                var q, answerIds = [];

                item.Answers.forEach(function (ans) {
                    out.answers.push(ans);
                    answerIds.push(ans.id);
                });

                out.questions.push({
                    id: item.id,
                    text: item.text,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    answers: answerIds
                });
            });
            res.json(out);
        });
});

router.post('/questions', simpleauth, function (req, res) {
    var out = {};

    Question.create({text: req.body.question.text})
        .then(function (q) {
            out.question = q;
            res.json(out);
        });
});

router.put('/questions/:id', simpleauth, function (req, res) {
    var out = {};

    Question.findById(req.params.id).then(function (q) {
        return q.updateAttributes({text: req.body.question.text});
    }).then(function (q) {
        out.question = q;
        res.json(out);
    });

});

router.delete('/questions/:id', simpleauth, function (req, res) {
    Question.findById(req.params.id)
        .then(function (ans) {
            return ans.destroy();
        })
        .then(function () {
            res.json({});
        });
});

module.exports = router;