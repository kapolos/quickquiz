import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Service.extend({
    password: '',
    isValid() {
        return ajax('/api/adminCheck', {
            headers: {
                'X-Tinyauth-Password': this.password
            }
        });
    },
    setStatus(s) {
        this.set('isLogged', s);
    },
    reset() {
        this.set('isLogged', null);
        this.set('password', '');
    },
    isLogged: null
});
