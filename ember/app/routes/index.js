import Ember from 'ember';

export default Ember.Route.extend({
    model () {
        var cookie = this.get('cookie');
        var userId = cookie.getCookie('userid');

        if (!userId) {
            userId = randomString(10, 'A');
            cookie.setCookie('userid', userId);

        }

        return this.store.findQuery('fe-question', {userid: userId});
    },
    setupController (controller, model) {
        this._super(controller, model);

        var cookie = this.get('cookie');
        var userId = cookie.getCookie('userid');
        var nickname = cookie.getCookie('nickname');

        controller.set('registeredUserId', userId);

        if (nickname) {
            controller.set('registeredUsername', nickname);
        }

        Ember.run.later((function () {
            controller.set("popupmsgclass", "magictime vanishIn");
            Ember.run.later((function () {
                controller.set("popupmsgclass", "magictime vanishOut");
            }), 4000);
        }), 3000);
    },

    actions: {
        handleAnswer() {
            var answerId = this.controller.get('radioSelection');

            if (!answerId) {
                this.controller.set('showErrMsg', true);
                Ember.run.later(this, function() {
                    this.controller.set('showErrMsg', false);
                }, 3000);
                return;
            }

            this.controller.set("showQ", false);

            var feAnswer = this.store.peekRecord('feAnswer', answerId);
            feAnswer.set('chosenByUser', this.controller.get("registeredUserId"));
            feAnswer.set('userNickname', this.controller.get("username"));
            feAnswer.save();
        },
        showNameDialog() {
            this.controller.set("modalIsOpen", true);
        },
        updateUsername() {
            var cookie = this.get('cookie');
            cookie.setCookie('nickname', this.controller.get("username"));
            this.controller.set("modalIsOpen", false);
        }
    }
});

function randomString(len, an) {
    an = an && an.toLowerCase();
    var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
    for (; i++ < len;) {
        var r = Math.random() * (max - min) + min << 0;
        str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
    }
    return str;
}