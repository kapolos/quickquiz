import Auth from '../services/tinyauth';

export function initialize(container, application) {
    container.register('tinyauth:service', Auth);
    application.inject('controller', 'auth', 'tinyauth:service');
    application.inject('route', 'auth', 'tinyauth:service');
    application.inject('adapter', 'auth', 'tinyauth:service');
}

export default {
    name: 'tinyauth',
    initialize: initialize
};
