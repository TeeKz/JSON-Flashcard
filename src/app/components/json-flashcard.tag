<json-flashcard>

    <div if="{ !state.hasJSON }" class="container">
        <h1>Welcome to JSON Flashcards</h1>
        <p>JSON Flashcards allows you to review a series of flashcards created with JSON. To get started, paste the directory of your JSON file in the input below.</p>
        <form onsubmit="{ getJSON }">
            <input class="u-full-width" name="jsonURLInput" type="text" placeholder="http://github.com/<username>/<project>/<file>" value="/JSON-Flashcard/src/assets/demo/cards.json">
            <button class="button-primary" type="submit">Get JSON</button>
        </form>

        <div if="{state.sets.length}" class="previously-added">
            <h4>Recently Used</h4>
            <div class="list">
                <div each="{ link, i in state.sets }" class="list-item">
                    <a href="javascript:void(0)" onclick="{ parent.selectPreviousSet }">{ link }</a>
                </div>
            </div>
        </div>
    </div>

    <div if="{ state.hasJSON }" class="container card-container">
        <div class="flashcard-toolbar">
            <div class="row">
                <div class="four columns ">
                    <button type="button" onclick="{ previousCard }"><i class="fa fa-chevron-left"></i>Previous Card</button>
                </div>
                <div class="four columns align-center card-summary">
                    Card { getCardIndex() } of { state.cards.length }
                </div>
                <div class="four columns align-right">
                    <button type="button" onclick="{ nextCard }">Next Card<i class="fa fa-chevron-right"></i> </button>
                </div>
            </div>
            <hr>
        </div>

        <card each="{ state.cards }" if="{ active }">
            <div class="question-container">
                <h3>{ question }</h3>
                <p>{ description }</p>
                <button if="{ !showAnswer }" class="button-primary" onclick="{ parent.showAnswer }">Show Answer</button>
                <button if="{ showAnswer }" class="button-primary" onclick="{ parent.hideAnswer }">Hide Answer</button>
            </div>
            <div if="{ showAnswer }" class="answer-container">
                <h5 class="grey">Answer</h5>
                <p>{ answer }</p>
            </div>
        </card>
    </div>

    <div if="{ state.hasJSON }" class="row align-center toolbar-wrapper">
        <a href="javascript:void(0)" onclick="{ changeSet }">Change Flashcard Set</a>
    </div>




    <script>
        var self = this;
        var dispatcher = require('riotcontrol');
        var constants = require('./../constants');
        var store = require('./../stores/json-flashcard.store.js');
        var _ = require("lodash");

        self.updateState = function (state) {
            self.state = state;
            self.update();
        };

        self.getJSON = function () {
            dispatcher.trigger(constants.GET_JSON_FLASHCARDS, self.jsonURLInput.value);
        };

        self.showAnswer = function () {
            dispatcher.trigger(constants.SHOW_CARD_ANSWER);
        };

        self.hideAnswer = function () {
            dispatcher.trigger(constants.HIDE_CARD_ANSWER)
        };

        self.getCardIndex = function () {
            return _.findIndex(self.state.cards, 'active') + 1;
        };

        self.nextCard = function () {
            self.hideAnswer();
            dispatcher.trigger(constants.SHOW_NEXT_CARD);
        };

        self.previousCard = function () {
            dispatcher.trigger(constants.SHOW_PREVIOUS_CARD);
        };

        self.changeSet = function () {
            dispatcher.trigger(constants.CHANGE_FLASHCARD_SET);
        };

        self.selectPreviousSet = function (e) {
            console.log(e.item);
        };

        self.on('mount', function () {
            store.on(constants.JSON_FLASHCARD_CHANGE, self.updateState);
            dispatcher.trigger(constants.JSON_FLASHCARD_INIT);
        });

        self.on('unmount', function () {
            store.off(constants.JSON_FLASHCARD_CHANGE);
        })

    </script>

</json-flashcard>