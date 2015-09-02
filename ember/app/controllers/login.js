import Ember from 'ember';

export default Ember.Controller.extend({
    loginFailed: null,
    adminpasswd: '',
    checking: false,
    failedMsg: function () {
        if (this.get("loginFailed")) {
            Ember.run.next(this, function(){
                this.set('adminpasswd', '');
            });
            return "We are the knights who say NI. Try again...";
        }
        return '';
    }.property('loginFailed')
});
