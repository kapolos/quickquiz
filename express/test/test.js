var assert = require('assert'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should(),
    appDir = __dirname + '/..',
    config = require('config'),
    dbConfig = config.get('testing.db'),
    expressConfig = config.get('testing.express'),
    express = require('express'),
    bodyParser = require('body-parser'),
    glob = require('glob'),
    request = require('supertest'),
    orm = require('sequelize-singleton'),
    Promise = require("bluebird"),
    app;

chai.use(chaiAsPromised);

orm.logger = false;
orm.discover = [appDir + '/sequelize_models'];

orm.connect(dbConfig.dbname, dbConfig.username, dbConfig.password, {
    dialect: dbConfig.dialect,
    host: dbConfig.host,
    storage: dbConfig.file,
    logging: dbConfig.logging
});

var sequelize = orm.sequelize,
    Sequelize = orm.Sequelize,
    models = orm.models,
    Question = models.Question,
    Answer = models.Answer;


before(function () {
    app = express();

    app.use(bodyParser.json());
    app.use(express.static(__dirname + '../../ember/dist'));

    glob.sync(__dirname + "/../routes/api/**/*.js").forEach(function (filename) {
        app.use('/api', require(filename));
    });

    app.listen(expressConfig.port, function () {
        console.log('Webserver started on port ' + expressConfig.port);
    });

    console.log('Resetting DB...');
    return orm.sequelize.sync({force: true})
        .then(function () {
            return true;
        })
        .error(function (e) {
            return e;
        });
});

describe('Question/Answer', function () {

    describe('Associations', function () {
        var q1, x_ans1Id;

        before(function () {
            return Question.create({text: 'q1'})
                .then(function (q) {
                    q1 = q;
                    return Answer.createAndAssocWithQuestion('Answer 2', 5, q)
                })
                .then(function (ans) {
                    x_ans1Id = ans.id;
                    return Answer.createAndAssocWithQuestion('Answer 3', 3, q1);
                })
                .then(function () {
                    return Answer.createAndAssocWithQuestion('Answer 4', 4, q1);
                }).then(function () {
                    return true;
                });
        });

        step('should create a new answer, associate it with the question and return the instance', function () {
            return Answer.createAndAssocWithQuestion('Answer 1', 1, q1)
                .then(function (ans) {
                    return ans.text;
                }).should.eventually.equal('Answer 1');
        });

        step('should return all the answers along with the question', function () {
            return (Question.findOne({where: {id: q1.id}, include: [Answer]}))
                .then(function (q) {
                    return (q.Answers).length;
                })
                .should.eventually.equal(4);
        });

        step('should have removed the answers when removing the question', function () {
            return (q1.destroy())
                .then(function () {
                    return Answer.findOne({where: {text: 'Answer 4'}});
                })
                .should.eventually.equal(null);
        });

    });


});

describe('API', function () {
    var q1, q2;

    before(function () {
        var pq1 = Question.create({text: 'Question 1'})
            .then(function (q) {
                q1 = q;
                return Answer.createAndAssocWithQuestion('Answer 2', 5, q)
            })
            .then(function () {
                return Answer.createAndAssocWithQuestion('Answer 3', 3, q1);
            })
            .then(function () {
                return Answer.createAndAssocWithQuestion('Answer 4', 4, q1);
            });

        var pq2 = Question.create({text: 'Question 2'})
            .then(function (q) {
                q2 = q;
                return Answer.createAndAssocWithQuestion('Answer 21', 5, q)
            })
            .then(function () {
                return Answer.createAndAssocWithQuestion('Answer 31', 3, q2);
            })
            .then(function () {
                return Answer.createAndAssocWithQuestion('Answer 41', 4, q2);
            });

        return Promise.all([pq1, pq2]);
    });

    describe('Public', function () {
        var ansId1, ansId2, qId1, qId2;

        step('should return a single question for an unidentified user (in JSON)', function (done) {
            request(app)
                .get('/api/feQuestions')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    (res.body.feQuestions.length).should.equals(1);
                    if (err) return done(err);
                    done();
                });
        });

        step('should return a single question for an identified user (in JSON)', function (done) {
            request(app)
                .get('/api/feQuestions')
                .query('userId', 'aaaa')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    (res.body.feQuestions.length).should.equals(1);
                    ansId1 = res.body.feAnswers[0].id;
                    qId1 = res.body.feQuestions[0].id;
                    if (err) return done(err);
                    done();
                });
        });

        step('should store a response for the previously identified user', function (done) {
            var payload = {
                feAnswer: {
                    chosenByUser: 'aaaa',
                    userNickname: 'stranger'
                }
            };
            request(app)
                .put('/api/feAnswers/' + ansId1)
                .type('json')
                .send(payload)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    JSON.stringify(res.body).should.equals(JSON.stringify({}));
                    if (err) return done(err);
                    done();
                });
        });

    });

    describe('Admin', function () {
        var nqId, ans1Id;

        step('should return 403 if not authenticated', function (done) {
            return request(app)
                .get('/api/adminCheck')
                .expect(403)
                .end(function (err, res) {
                    should.not.exist(err);
                    if (err) return done(err);
                    done();
                });
        });

        step('auth should return true with the right credential', function (done) {
            request(app)
                .get('/api/adminCheck')
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.should.equals(true);
                    if (err) return done(err);
                    done();
                });
        });

        step('should create a new question', function (done) {
            var payload = {
                question: {
                    text: "A new Question"
                }
            };
            request(app)
                .post('/api/questions')
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .send(payload)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    (res.body.question.id).should.not.be.undefined;
                    nqId = res.body.question.id;
                    if (err) return done(err);
                    done();
                });
        });

        step('should update the previous question', function (done) {
            var payload = {
                question: {
                    text: "New text!"
                }
            };
            request(app)
                .put('/api/questions/' + nqId)
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .send(payload)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    (res.body.question.id).should.not.be.undefined;
                    nqId.should.equals(res.body.question.id);
                    if (err) return done(err);
                    done();
                });
        });

        step('should create a new answer associated with the previous question', function (done) {
            var payload = {
                answer: {
                    text: "A new Answer",
                    position: 0,
                    QuestionId: nqId
                }
            };
            request(app)
                .post('/api/answers')
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .send(payload)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    (res.body.answer.id).should.not.be.undefined;
                    ans1Id = res.body.answer.id;
                    if (err) return done(err);
                    done();
                });
        });

        step('should update the previous answer', function (done) {
            var payload = {
                answer: {
                    text: "New text!!",
                    position: 100
                }
            };
            request(app)
                .put('/api/answers/' + ans1Id)
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .send(payload)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    (res.body.answer.id).should.not.be.undefined;
                    ans1Id.should.equals(res.body.answer.id);
                    if (err) return done(err);
                    done();
                });
        });

        step('should remove the previous answer', function (done) {
            request(app)
                .del('/api/answers/' + ans1Id)
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    JSON.stringify(res.body).should.equals(JSON.stringify({}));
                    if (err) return done(err);
                    done();
                });
        });

        step('should remove the previous question', function (done) {
            request(app)
                .del('/api/questions/' + nqId)
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    JSON.stringify(res.body).should.equals(JSON.stringify({}));
                    if (err) return done(err);
                    done();
                });
        });

        step('should get the list of the results', function (done) {
            request(app)
                .get('/api/results/')
                .set('x-tinyauth-password', config.get('frontend.admin.password'))
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    (res.body.results.length).should.not.equals(0);
                    if (err) return done(err);
                    done();
                });
        });

    });
})
;