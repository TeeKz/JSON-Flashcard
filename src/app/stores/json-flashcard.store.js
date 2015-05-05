var dispatcher = require("riotcontrol");
var riot = require("riot");
var constants = require("./../constants");
var _ = require("lodash");
var $ = require("./../common");

var defaultState = {
    hasJSON: false,
    inputValue: "",
    currentLink: "",
    activeIndex: 0,
    sets: []
};


function getInitialState () {
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function getJSONFlashcards (url) {
    var convertedURL = $.convertURL(url);

    this.state.currentLink = url;
    this.state.inputValue = "";

    $.getJSON(convertedURL.prod)
        .catch(function (err) { throw err; })
        .then(getJSONFlashcardsSuccess.bind(this));
}

function getJSONFlashcardsSuccess (response) {
    var state = this.state;
    var setIndex = _.findIndex(state.sets, { link: state.currentLink });

    if (setIndex !== -1) {
        state.sets.splice(setIndex, 1);
    }

    response.link = state.currentLink;

    state.hasJSON = true;
    state.activeIndex = 0;
    state.sets.unshift(response);

    saveLocalSets.call(this);

    _.forEach(state.sets[state.activeIndex].cards, function (card, i) {
        card.active = i === 0;
    });

    this.trigger(constants.JSON_FLASHCARD_CHANGE, state);
}

function showAnswer () {
    var state = this.state;
    var cardSet = state.sets[state.activeIndex];
    var card = _.find(cardSet.cards, 'active');
    card.showAnswer = true;
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function hideAnswer () {
    var state = this.state;
    var cardSet = state.sets[state.activeIndex];
    var card = _.find(cardSet.cards, 'active');
    card.showAnswer = false;
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function showPreviousCard () {
    var state = this.state;
    var cardSet = state.sets[state.activeIndex];
    var activeIndex = _.findIndex(cardSet.cards, 'active');
    activeIndex = --activeIndex === -1 ? cardSet.cards.length - 1 : activeIndex;

    _.forEach(cardSet.cards, function (card, index) {
        card.active = activeIndex === index;
    });

    this.trigger(constants.JSON_FLASHCARD_CHANGE, state);
}

function showNextCard () {
    var state = this.state;
    var cardSet = state.sets[state.activeIndex];
    var activeIndex = _.findIndex(cardSet.cards, 'active');
    activeIndex = ++activeIndex === cardSet.cards.length ? 0 : activeIndex;

    _.forEach(cardSet.cards, function (card, index) {
        card.active = activeIndex === index;
    });

    this.trigger(constants.JSON_FLASHCARD_CHANGE, state);
}

function changeFlashcards () {
    this.state.hasJSON = false;
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function getLocalSets () {
    if (!localStorage || !localStorage.jsonFlashcards) return [];
    return JSON.parse(localStorage.jsonFlashcards).sets;
}

function saveLocalSets () {
    var sets = this.state.sets;
    if (!localStorage) return [];
    localStorage.jsonFlashcards = JSON.stringify({ "sets": sets });
}

var JSONFlashcardStore = function () {
    this.state = _.cloneDeep(defaultState);
    this.state.sets = getLocalSets.call(this);

    dispatcher.addStore(this);
    riot.observable(this);

    this.on(constants.JSON_FLASHCARD_INIT, getInitialState.bind(this));
    this.on(constants.GET_JSON_FLASHCARDS, getJSONFlashcards.bind(this));
    this.on(constants.SHOW_CARD_ANSWER, showAnswer.bind(this));
    this.on(constants.SHOW_PREVIOUS_CARD, showPreviousCard.bind(this));
    this.on(constants.SHOW_NEXT_CARD, showNextCard.bind(this));
    this.on(constants.HIDE_CARD_ANSWER, hideAnswer.bind(this));
    this.on(constants.CHANGE_FLASHCARD_SET, changeFlashcards.bind(this));
};

var instance = new JSONFlashcardStore();
module.exports = instance;

