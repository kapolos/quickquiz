import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function () {
  this.route("login");

  this.route('admin', function() {
    this.route('dashboard');
    this.route('questions');
    this.route('answers');
    this.route('updating');
    this.route('logout');
  });
});

export default Router;
