"use strict";

module.exports = function (sequelize, DataTypes) {
    var UserAnswer = sequelize.define('Answer', {
            UserId: {
                type: DataTypes.INTEGER
            },
            AnswerId: {
                type: DataTypes.INTEGER
            }
        });

    return UserAnswer;
};