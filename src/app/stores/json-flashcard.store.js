var dispatcher = require("riotcontrol");
var riot = require("riot");
var constants = require("./../constants");
var _ = require("lodash");
var $ = require("./../common");

var defaultState = {
    hasJSON: false,
    activeLink: "",
    cards: [],
    sets: []
};


function getInitialState () {
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function getJSONFlashcards (url) {
    this.state.activeLink = url;

    $.getJSON(url)
        .catch(function (err) { throw err; })
        .then(getJSONFlashcardsSuccess.bind(this));
}

function getJSONFlashcardsSuccess (response) {
    var state = this.state;

    state.cards = response.cards;
    state.hasJSON = true;

    if (_.contains(state.sets, state.activeLink)) {
        _.pull(state.sets, state.activeLink)
    }

    state.sets.unshift(state.activeLink);

    saveLocalSets.call(this);

    var isActiveCard = _.findIndex(state.cards, 'active');

    if (isActiveCard === -1 && state.cards.length > 0) {
        state.cards[0].active = true;
    }

    this.trigger(constants.JSON_FLASHCARD_CHANGE, state);
}

function showAnswer () {
    var card = _.find(this.state.cards, 'active');
    card.showAnswer = true;
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function hideAnswer () {
    var card = _.find(this.state.cards, 'active');
    card.showAnswer = false;
    this.trigger(constants.JSON_FLASHCARD_CHANGE, this.state);
}

function showPreviousCard () {
    var state = this.state;
    var activeIndex = _.findIndex(state.cards, 'active');
    activeIndex = --activeIndex === -1 ? state.cards.length - 1 : activeIndex;

    _.forEach(state.cards, function (card, index) {
        card.active = activeIndex === index;
    });

    this.trigger(constants.JSON_FLASHCARD_CHANGE, state);
}

function showNextCard () {
    var state = this.state;
    var activeIndex = _.findIndex(state.cards, 'active');
    activeIndex = ++activeIndex === state.cards.length ? 0 : activeIndex;

    _.forEach(state.cards, function (card, index) {
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

