"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            nickname: DataTypes.STRING,
            cookie: DataTypes.STRING
        },
        {
            classMethods: {
                associate: function (models) {
                    User.belongsToMany(models.Answer, {through: 'UserAnswers'});
                }
            }
        });

    return User;
};