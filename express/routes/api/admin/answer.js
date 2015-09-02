var express = require('express'),
    router = express.Router(),
    simpleauth = require('../../middleware/simpleauth'),
    orm = require('sequelize-singleton'),
    Answer = orm.models.Answer;

router.get('/adminCheck', simpleauth, function (req, res) {
    res.json(true);
});

router.post('/answers', simpleauth, function (req, res) {
    var out = {};

    Answer.createAndAssocWithQuestion(req.body.answer.text, parseInt(req.body.answer.position), parseInt(req.body.answer.QuestionId))
        .then(function (ans) {
            out.answer = ans;
            res.json(out);
        });

});

router.put('/answers/:id', simpleauth, function (req, res) {
    var out = {};

    Answer.findById(req.params.id)
        .then(function (ans) {
            return ans.updateAttributes({text: req.body.answer.text, position: req.body.answer.position});
        }).then(function (ans) {
            out.answer = ans;
            res.json(out);
        })

});

router.delete('/answers/:id', simpleauth, function (req, res) {

    Answer.findById(req.params.id)
        .then(function (ans) {
            return ans.destroy();
        })
        .then(function () {
            res.json({});
        });

});

module.exports = router;