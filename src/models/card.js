"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCard = exports.King = exports.Queen = exports.Jack = exports.Ten = exports.Nine = exports.Eight = exports.Seven = exports.Six = exports.Five = exports.Four = exports.Three = exports.Two = exports.Ace = exports.Card = exports.CardEvent = exports.Suit = exports.CardNumber = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var spades_ace_1 = __importDefault(require("../components/cardImages/spades_ace"));
var spades_2_1 = __importDefault(require("../components/cardImages/spades_2"));
var spades_3_1 = __importDefault(require("../components/cardImages/spades_3"));
var spades_4_1 = __importDefault(require("../components/cardImages/spades_4"));
var spades_5_1 = __importDefault(require("../components/cardImages/spades_5"));
var spades_6_1 = __importDefault(require("../components/cardImages/spades_6"));
var spades_7_1 = __importDefault(require("../components/cardImages/spades_7"));
var spades_8_1 = __importDefault(require("../components/cardImages/spades_8"));
var spades_9_1 = __importDefault(require("../components/cardImages/spades_9"));
var spades_10_1 = __importDefault(require("../components/cardImages/spades_10"));
var spades_jack_1 = __importDefault(require("../components/cardImages/spades_jack"));
var spades_queen_1 = __importDefault(require("../components/cardImages/spades_queen"));
var spades_king_1 = __importDefault(require("../components/cardImages/spades_king"));
var hearts_ace_1 = __importDefault(require("../components/cardImages/hearts_ace"));
var hearts_2_1 = __importDefault(require("../components/cardImages/hearts_2"));
var hearts_3_1 = __importDefault(require("../components/cardImages/hearts_3"));
var hearts_4_1 = __importDefault(require("../components/cardImages/hearts_4"));
var hearts_5_1 = __importDefault(require("../components/cardImages/hearts_5"));
var hearts_6_1 = __importDefault(require("../components/cardImages/hearts_6"));
var hearts_7_1 = __importDefault(require("../components/cardImages/hearts_7"));
var hearts_8_1 = __importDefault(require("../components/cardImages/hearts_8"));
var hearts_9_1 = __importDefault(require("../components/cardImages/hearts_9"));
var hearts_10_1 = __importDefault(require("../components/cardImages/hearts_10"));
var hearts_jack_1 = __importDefault(require("../components/cardImages/hearts_jack"));
var hearts_queen_1 = __importDefault(require("../components/cardImages/hearts_queen"));
var hearts_king_1 = __importDefault(require("../components/cardImages/hearts_king"));
var clubs_ace_1 = __importDefault(require("../components/cardImages/clubs_ace"));
var clubs_2_1 = __importDefault(require("../components/cardImages/clubs_2"));
var clubs_3_1 = __importDefault(require("../components/cardImages/clubs_3"));
var clubs_4_1 = __importDefault(require("../components/cardImages/clubs_4"));
var clubs_5_1 = __importDefault(require("../components/cardImages/clubs_5"));
var clubs_6_1 = __importDefault(require("../components/cardImages/clubs_6"));
var clubs_7_1 = __importDefault(require("../components/cardImages/clubs_7"));
var clubs_8_1 = __importDefault(require("../components/cardImages/clubs_8"));
var clubs_9_1 = __importDefault(require("../components/cardImages/clubs_9"));
var clubs_10_1 = __importDefault(require("../components/cardImages/clubs_10"));
var clubs_jack_1 = __importDefault(require("../components/cardImages/clubs_jack"));
var clubs_queen_1 = __importDefault(require("../components/cardImages/clubs_queen"));
var clubs_king_1 = __importDefault(require("../components/cardImages/clubs_king"));
var diamonds_ace_1 = __importDefault(require("../components/cardImages/diamonds_ace"));
var diamonds_2_1 = __importDefault(require("../components/cardImages/diamonds_2"));
var diamonds_3_1 = __importDefault(require("../components/cardImages/diamonds_3"));
var diamonds_4_1 = __importDefault(require("../components/cardImages/diamonds_4"));
var diamonds_5_1 = __importDefault(require("../components/cardImages/diamonds_5"));
var diamonds_6_1 = __importDefault(require("../components/cardImages/diamonds_6"));
var diamonds_7_1 = __importDefault(require("../components/cardImages/diamonds_7"));
var diamonds_8_1 = __importDefault(require("../components/cardImages/diamonds_8"));
var diamonds_9_1 = __importDefault(require("../components/cardImages/diamonds_9"));
var diamonds_10_1 = __importDefault(require("../components/cardImages/diamonds_10"));
var diamonds_jack_1 = __importDefault(require("../components/cardImages/diamonds_jack"));
var diamonds_queen_1 = __importDefault(require("../components/cardImages/diamonds_queen"));
var diamonds_king_1 = __importDefault(require("../components/cardImages/diamonds_king"));
var CardNumber;
(function (CardNumber) {
    CardNumber["Ace"] = "Ace";
    CardNumber[CardNumber["Two"] = 2] = "Two";
    CardNumber[CardNumber["Three"] = 3] = "Three";
    CardNumber[CardNumber["Four"] = 4] = "Four";
    CardNumber[CardNumber["Five"] = 5] = "Five";
    CardNumber[CardNumber["Six"] = 6] = "Six";
    CardNumber[CardNumber["Seven"] = 7] = "Seven";
    CardNumber[CardNumber["Eight"] = 8] = "Eight";
    CardNumber[CardNumber["Nine"] = 9] = "Nine";
    CardNumber[CardNumber["Ten"] = 10] = "Ten";
    CardNumber["Jack"] = "Jack";
    CardNumber["Queen"] = "Queen";
    CardNumber["King"] = "King";
})(CardNumber = exports.CardNumber || (exports.CardNumber = {}));
var Suit;
(function (Suit) {
    Suit["Clubs"] = "Clubs";
    Suit["Diamonds"] = "Diamonds";
    Suit["Hearts"] = "Hearts";
    Suit["Spades"] = "Spades";
})(Suit = exports.Suit || (exports.Suit = {}));
var CardEvent;
(function (CardEvent) {
    CardEvent[CardEvent["Next"] = 0] = "Next";
    CardEvent[CardEvent["Nominate"] = 1] = "Nominate";
    CardEvent[CardEvent["Ten"] = 2] = "Ten";
    CardEvent[CardEvent["Back"] = 3] = "Back";
})(CardEvent = exports.CardEvent || (exports.CardEvent = {}));
var Card = /** @class */ (function () {
    /**
     *
     */
    function Card(suit) {
        this.isSelected = false;
        this.isMagicCard = false;
        this.isPowerCard = false;
        this.suit = suit;
    }
    Card.prototype.getNumber = function () {
        if (typeof this.card === "number" && !!this.card) {
            return this.card;
        }
        return 0;
    };
    Card.prototype.canPlay = function (onCards) {
        var topCard = this.getTopCard(onCards);
        if (topCard === null) {
            return true;
        }
        if (this.isNominating(onCards)) {
            return this.isMagicCard;
        }
        if (topCard.card === CardNumber.Seven || topCard.card === CardNumber.Nine) {
            return this.getNumber() <= topCard.getNumber();
        }
        return this.getNumber() >= topCard.getNumber();
    };
    Card.prototype.getTopCard = function (onCards) {
        if (!onCards.length) {
            return null;
        }
        var cardIndex = onCards.length - 1;
        var card = onCards[cardIndex];
        while (cardIndex >= 0 && card.card === CardNumber.Eight) {
            cardIndex--;
            card = onCards[cardIndex];
        }
        return card !== null && card !== void 0 ? card : onCards[onCards.length - 1];
    };
    Card.prototype.isNominating = function (onCards) {
        if (onCards.length === 0) {
            return true;
        }
        var topCard = onCards[onCards.length - 1];
        if (topCard.card !== CardNumber.Ace) {
            return false;
        }
        return !topCard.isOne;
    };
    Card.prototype.render = function () {
        return (0, jsx_runtime_1.jsx)("div", {});
    };
    Card.prototype.getCardEvent = function (onCard) {
        return CardEvent.Next;
    };
    return Card;
}());
exports.Card = Card;
var Ace = /** @class */ (function (_super) {
    __extends(Ace, _super);
    function Ace(suit, isOne) {
        if (isOne === void 0) { isOne = false; }
        var _this = _super.call(this, suit) || this;
        _this.isMagicCard = true;
        _this.isPowerCard = false;
        _this.isOne = false;
        _this.card = CardNumber.Ace;
        _this.isMagicCard = true;
        _this.isOne = isOne;
        return _this;
    }
    Ace.prototype.canPlay = function () {
        return true;
    };
    Ace.prototype.getNumber = function () {
        return 1;
    };
    Ace.prototype.nextPlayer = function () {
        return CardEvent.Nominate;
    };
    Ace.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_ace_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_ace_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_ace_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_ace_1.default, {});
        }
    };
    Ace.prototype.getCardEvent = function (onCard) {
        if (onCard.length < 1) {
            return CardEvent.Nominate;
        }
        return this.isOne ? CardEvent.Next : CardEvent.Nominate;
    };
    return Ace;
}(Card));
exports.Ace = Ace;
var Two = /** @class */ (function (_super) {
    __extends(Two, _super);
    function Two(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Two;
        _this.isMagicCard = true;
        return _this;
    }
    Two.prototype.canPlay = function () {
        return true;
    };
    Two.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_2_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_2_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_2_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_2_1.default, {});
        }
    };
    return Two;
}(Card));
exports.Two = Two;
var Three = /** @class */ (function (_super) {
    __extends(Three, _super);
    function Three(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Three;
        return _this;
    }
    Three.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_3_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_3_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_3_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_3_1.default, {});
        }
    };
    return Three;
}(Card));
exports.Three = Three;
var Four = /** @class */ (function (_super) {
    __extends(Four, _super);
    function Four(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Four;
        return _this;
    }
    Four.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_4_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_4_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_4_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_4_1.default, {});
        }
    };
    return Four;
}(Card));
exports.Four = Four;
var Five = /** @class */ (function (_super) {
    __extends(Five, _super);
    function Five(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Five;
        return _this;
    }
    Five.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_5_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_5_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_5_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_5_1.default, {});
        }
    };
    return Five;
}(Card));
exports.Five = Five;
var Six = /** @class */ (function (_super) {
    __extends(Six, _super);
    function Six(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Six;
        return _this;
    }
    Six.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_6_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_6_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_6_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_6_1.default, {});
        }
    };
    return Six;
}(Card));
exports.Six = Six;
var Seven = /** @class */ (function (_super) {
    __extends(Seven, _super);
    function Seven(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Seven;
        _this.isPowerCard = true;
        return _this;
    }
    Seven.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_7_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_7_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_7_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_7_1.default, {});
        }
    };
    Seven.prototype.getCardEvent = function (onCard) {
        return CardEvent.Back;
    };
    return Seven;
}(Card));
exports.Seven = Seven;
var Eight = /** @class */ (function (_super) {
    __extends(Eight, _super);
    function Eight(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Eight;
        _this.isMagicCard = true;
        return _this;
    }
    Eight.prototype.canPlay = function (onCards) {
        var topCard = this.getTopCard(onCards);
        if (topCard === null) {
            return true;
        }
        return (topCard === null || topCard === void 0 ? void 0 : topCard.card) !== CardNumber.Seven;
    };
    Eight.prototype.getCardEvent = function (onCards) {
        var topCard = this.getTopCard(onCards);
        if (topCard === null) {
            return CardEvent.Next;
        }
        if (topCard.card === CardNumber.Ace && !(topCard === null || topCard === void 0 ? void 0 : topCard.isOne)) {
            return CardEvent.Nominate;
        }
        return CardEvent.Next;
    };
    Eight.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_8_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_8_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_8_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_8_1.default, {});
        }
    };
    return Eight;
}(Card));
exports.Eight = Eight;
var Nine = /** @class */ (function (_super) {
    __extends(Nine, _super);
    function Nine(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Nine;
        _this.isPowerCard = true;
        return _this;
    }
    Nine.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_9_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_9_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_9_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_9_1.default, {});
        }
    };
    return Nine;
}(Card));
exports.Nine = Nine;
var Ten = /** @class */ (function (_super) {
    __extends(Ten, _super);
    function Ten(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Ten;
        _this.isMagicCard = true;
        return _this;
    }
    Ten.prototype.canPlay = function (onCards) {
        var topCard = this.getTopCard(onCards);
        if (topCard === null) {
            return true;
        }
        return ((topCard === null || topCard === void 0 ? void 0 : topCard.card) !== CardNumber.Seven && (topCard === null || topCard === void 0 ? void 0 : topCard.card) !== CardNumber.Nine);
    };
    Ten.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_10_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_10_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_10_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_10_1.default, {});
        }
    };
    Ten.prototype.getCardEvent = function (onCard) {
        return CardEvent.Ten;
    };
    return Ten;
}(Card));
exports.Ten = Ten;
var Jack = /** @class */ (function (_super) {
    __extends(Jack, _super);
    function Jack(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Jack;
        return _this;
    }
    Jack.prototype.getNumber = function () {
        return 11;
    };
    Jack.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_jack_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_jack_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_jack_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_jack_1.default, {});
        }
    };
    return Jack;
}(Card));
exports.Jack = Jack;
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.Queen;
        return _this;
    }
    Queen.prototype.getNumber = function () {
        return 12;
    };
    Queen.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_queen_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_queen_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_queen_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_queen_1.default, {});
        }
    };
    return Queen;
}(Card));
exports.Queen = Queen;
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(suit) {
        var _this = _super.call(this, suit) || this;
        _this.card = CardNumber.King;
        return _this;
    }
    King.prototype.getNumber = function () {
        return 13;
    };
    King.prototype.render = function () {
        switch (this.suit) {
            case Suit.Clubs:
                return (0, jsx_runtime_1.jsx)(clubs_king_1.default, {});
            case Suit.Diamonds:
                return (0, jsx_runtime_1.jsx)(diamonds_king_1.default, {});
            case Suit.Hearts:
                return (0, jsx_runtime_1.jsx)(hearts_king_1.default, {});
            case Suit.Spades:
                return (0, jsx_runtime_1.jsx)(spades_king_1.default, {});
        }
    };
    return King;
}(Card));
exports.King = King;
function newCard(card) {
    switch (card.card) {
        case CardNumber.Ace:
            var ace = card;
            return new Ace(ace.suit, ace.isOne);
        case CardNumber.Two:
            return new Two(card.suit);
        case CardNumber.Three:
            return new Three(card.suit);
        case CardNumber.Four:
            return new Four(card.suit);
        case CardNumber.Five:
            return new Five(card.suit);
        case CardNumber.Six:
            return new Six(card.suit);
        case CardNumber.Seven:
            return new Seven(card.suit);
        case CardNumber.Eight:
            return new Eight(card.suit);
        case CardNumber.Nine:
            return new Nine(card.suit);
        case CardNumber.Ten:
            return new Ten(card.suit);
        case CardNumber.Jack:
            return new Jack(card.suit);
        case CardNumber.Queen:
            return new Queen(card.suit);
        case CardNumber.King:
            return new King(card.suit);
        default:
            return new Ace(card.suit);
    }
}
exports.newCard = newCard;
