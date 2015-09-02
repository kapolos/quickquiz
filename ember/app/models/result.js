import DS from 'ember-data';

export default DS.Model.extend({
    question: DS.attr('string'),
    answer: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    userId: DS.attr('string'),
    userNickname: DS.attr('string')
});
