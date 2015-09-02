import DS from 'ember-data';

export default DS.Model.extend({
    text: DS.attr('string'),
    position: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    QuestionId: DS.belongsTo('feQuestion'),
    chosenByUser: DS.attr('string'),
    userNickname: DS.attr('string') /* A user may decide to use multiple nicknames throughout the questions list */
});
