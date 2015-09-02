"use strict";

module.exports = function (sequelize, DataTypes) {
    var Question = sequelize.define('Question', {
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            }
        },
        {
            classMethods: {
                associate: function (models) {
                    Question.hasMany(models.Answer, {constraints: false})
                },
                add: function (text) {
                    return Question.create({text: text})
                        .then(function (record) {
                            return record;
                        })
                        .error(function (e) {
                            return false;
                        });
                }
            }
        });

    return Question;
};