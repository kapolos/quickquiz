import Ember from 'ember';

export default Ember.Controller.extend({
    bgclass: 'bg' + (Math.floor(Math.random() * 8) + 1) + ' flex-item',
    popupmsgclass: 'displaynone',
    showQ: true,
    modalIsOpen: false,
    registeredUsername: '',
    registeredUserId: '',
    modalUsername: '',
    radioSelection: null,
    showErrMsg: false,

    popupmsgtext: function () {

        return 'Welcome, ' + this.get('username') + '!';
    }.property('username'),

    username: function () {
        let modalUsername = this.get('modalUsername');
        let registeredUsername = this.get('registeredUsername');

        return registeredUsername ? registeredUsername : modalUsername ? modalUsername : 'stranger';
    }.property('modalUsername', 'registeredUsername'),

    showNameLink: function () {
        let username = this.get('username');

        return username === 'stranger' ? true : false;
    }.property('username')
});
