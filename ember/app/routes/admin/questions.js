import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        if (this.get('auth').isLogged !== true) {
            var cookiePass = this.get('cookie').getCookie('adminpasswd');

            if (cookiePass) {
                this.set('auth.password', cookiePass);
                this.get('auth').isValid()
                    .then((data) => {
                        if (data !== true) {
                            this.transitionTo('login');
                        } else {
                            this.get('auth').setStatus(true);
                        }
                    });
            } else {
                this.transitionTo('login');
            }
        }
    },
    model () {
        return this.store.findAll('question');
    },
    actions: {
        updateAnswer (contentEditable, event) {
            event.preventDefault();
            contentEditable.element.blur();
            window.getSelection().removeAllRanges();

            this.store.peekAll('answer').forEach(function (record) {
                if (record.get('hasDirtyAttributes') === true) {
                    record.save();
                }
            });

        },
        updateQuestion (contentEditable, event) {
            event.preventDefault();
            contentEditable.element.blur();
            window.getSelection().removeAllRanges();

            this.store.peekAll('question').forEach(function (record) {
                if (record.get('hasDirtyAttributes') === true) {
                    record.save();
                }
            });
        },
        reorderItems(groupModel, itemModels, draggedModel) {
            this.set('currentModel.items', itemModels);
            this.set('currentModel.justDragged', draggedModel);
            groupModel.set('items', itemModels);
        },
        addAnswer() {
            var that = this;

            if (this.controller.get('newAnswerText').length === 0) {
                return;
            }

            var ans = this.store.createRecord('answer', {
                text: this.controller.get('newAnswerText'),
                position: 0
            });

            this.send('closeAddAnswerPopup');

            this.store.find('question', this.controller.get('qIdOfNewAnswer'))
                .then(function (o) {
                    return o.get("answers").pushObject(ans);
                })
                .then(function () {
                    return ans.save();
                })
                .then(function () {
                    that.controller.set('newAnswerText', '');
                    that.controller.set('qIdOfNewAnswer', null);
                });

        },
        openAddAnswerPopup(qId) {
            this.controller.set('qIdOfNewAnswer', qId);
            this.controller.set('newAnswerModalIsOpen', true);
        },
        closeAddAnswerPopup() {
            this.controller.set('newAnswerModalIsOpen', false);
        },
        addQuestion() {
            // The various transitions here are as a
            // fix to an ember-materialize-collapsible bug
            // that doesn't bind the click event properly to new items

            var that = this;
            this.send('closeAddQuestionPopup');

            if (this.controller.get('newQuestionText').length === 0) {
                return;
            }

            that.transitionTo('admin.updating');


            var q = this.store.createRecord('question', {
                text: this.controller.get('newQuestionText')
            });

            q.save()
                .then(function () {
                    that.transitionTo('admin.questions');
                });

            that.controller.set('newQuestionText', '');

        },
        openAddQuestionPopup() {
            this.controller.set('newQuestionModalIsOpen', true);
        },
        closeAddQuestionPopup() {
            this.controller.set('newQuestionModalIsOpen', false);
        },
        deleteAnswer() {
            if (!this.controller.get('deleteAnswerCandidateId')) {
                return;
            }

            this.send('closeDeleteAnswerPopup');

            this.store.find('answer', this.controller.get('deleteAnswerCandidateId'))
                .then(function (record) {
                    record.destroyRecord();
                });

        },
        openDeleteAnswerPopup(aId) {
            this.controller.set('deleteAnswerCandidateId', aId);
            this.controller.set('deleteAnswerModalIsOpen', true);
        },
        closeDeleteAnswerPopup() {
            this.controller.set('deleteAnswerModalIsOpen', false);
        },
        deleteQuestion() {
            if (!this.controller.get('deleteQuestionCandidateId')) {
                return;
            }

            this.send('closeDeleteQuestionPopup');

            this.store.find('question', this.controller.get('deleteQuestionCandidateId'))
                .then(function (record) {
                    record.destroyRecord();
                });

        },
        openDeleteQuestionPopup(qId) {
            console.log(qId);
            this.controller.set('deleteQuestionCandidateId', qId);
            this.controller.set('deleteQuestionModalIsOpen', true);
        },
        closeDeleteQuestionPopup() {
            this.controller.set('deleteQuestionModalIsOpen', false);
        }
    }
});
