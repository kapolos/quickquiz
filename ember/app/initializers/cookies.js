export function initialize(container, application) {
    application.inject('route', 'cookie', 'cookie:main');
}

export default {
    name: 'cookies',
    after: ['cookie'],
    initialize: initialize
};
