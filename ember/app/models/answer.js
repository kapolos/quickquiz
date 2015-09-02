import DS from 'ember-data';

export default DS.Model.extend({
    text: DS.attr('string'),
    position: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    QuestionId: DS.belongsTo('question')
});
