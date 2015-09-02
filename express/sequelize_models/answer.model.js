"use strict";

module.exports = function (sequelize, DataTypes) {
    var Answer = sequelize.define('Answer', {
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true
                }
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    Answer.belongsTo(models.Question, {
                        onDelete: "CASCADE",
                        constraints: false
                    });
                    Answer.belongsToMany(models.User, {through: 'UserAnswers'});
                },
                createAndAssocWithQuestion: function (text, position, questionInstance) {
                    return Answer.create({
                        text: text,
                        position: position
                    })
                        .then(function (ans) {
                            return ans.setQuestion(questionInstance);
                        })
                        .then(function (ans) {
                            return ans;
                        })
                        .error(function (e) {
                            return false;
                        });
                }
            }
        });

    return Answer;
};