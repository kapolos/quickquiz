import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        this.get("cookie").setCookie("adminpasswd", '');
        this.get("auth").reset();
        this.transitionTo('login');
    }
});