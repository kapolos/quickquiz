import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        handleAnswer () {
            this.sendAction('handleAnswer', 'alpha');
        },
        showNameDialog () {
            this.sendAction('showNameDialog', 'alpha');
        }
    }
});
