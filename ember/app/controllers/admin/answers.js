import Ember from 'ember';

export default Ember.Controller.extend({
    rowsPerPage: 8,
    curPage: 1,
    maxPage: function () {
        return Math.ceil(parseInt(this.get("model").get("length")) / this.get("rowsPerPage"));
    }.property('model'),
    pageItems: function() {
        let curPage = parseInt(this.get("curPage"));
        let rpp = parseInt(this.get("rowsPerPage"));
        let model = this.get("model");

        return model.slice((curPage -1)*rpp, curPage*rpp);
    }.property('model.[]', 'curPage')
});
