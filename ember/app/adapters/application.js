import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'api',
    shouldReloadAll () {   // Ember 2.x compatibility
        return true;
    },
    headers: function () {
        return {
            "X-Tinyauth-Password": this.get('auth.password')
        };
    }.property('auth.password')
});
