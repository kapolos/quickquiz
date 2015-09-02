import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function () {
        if (this.get('auth').isLogged !== true) {
            var cookiePass = this.get('cookie').getCookie('adminpasswd');

            if (cookiePass) {
                this.set('auth.password', cookiePass);
                this.get('auth').isValid()
                    .then((data) => {
                        if (data !== true) {
                            this.transitionTo('login');
                        } else {
                            this.get('auth').set('isLogged', true);
                        }
                    });
            } else {
                this.transitionTo('login');
            }
        }
    },
    model () {
        this.store.unloadAll('result');

        return this.store.findAll('result');
    }
});
