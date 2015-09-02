import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        if (this.get('auth').isLogged === true) {
            this.transitionTo('admin.questions');
        }
    },
    actions: {
        checkCred () {
            this.controller.set('loginFailed', null);
            this.get('auth').setStatus(null);
            this.set('auth.password', this.controller.get('adminpasswd'));
            this.controller.set('checking', true);
            this.get('auth').isValid()
                .then((data) => {
                    console.log(data);
                    this.controller.set('checking', false);
                    if (data !== true) {
                        this.set('loginFailed', true);
                    } else {
                        this.get("cookie").setCookie("adminpasswd", this.controller.get('adminpasswd'));
                        this.get('auth').setStatus(true);
                        this.transitionTo('admin.questions');
                    }
                })
                .catch(() => {
                    this.controller.set('checking', false);
                    this.controller.set('loginFailed', true);
                });
        }
    }
});
