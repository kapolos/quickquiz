import DS from 'ember-data';

export default DS.Model.extend({
    text: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    answers: DS.hasMany('feAnswer', {async: true})
});
