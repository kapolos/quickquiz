import Ember from 'ember';

export default Ember.Controller.extend({
    qIdOfNewAnswer: null,
    newAnswerModalIsOpen: false,
    newAnswerText: '',
    newQuestionModalIsOpen: false,
    newQuestionText: '',
    deleteAnswerModalIsOpen: false,
    deleteAnswerCandidateId: null,
    deleteQuestionModalIsOpen: false,
    deleteQuestionCandidateId: null
});

