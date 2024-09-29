import {
  Ace,
  Card,
  CardEvent,
  CardNumber,
  Eight,
  Five,
  Four,
  Jack,
  King,
  Nine,
  Queen,
  Seven,
  Six,
  Suit,
  Ten,
  Three,
  Two,
} from "../../models/card";
import { Player } from "../../models/player";
import { GameManager } from "./gameManager";

describe.skip("GameManager", () => {
  let gameManager: GameManager;

  beforeEach(() => {
    gameManager = new GameManager();

    gameManager.players = new Map();
    gameManager.players.set("1", new Player("1", "Player 1"));
    gameManager.players.set("2", new Player("2", "Player 2"));
    gameManager.players.set("3", new Player("3", "Player 3"));
    gameManager.currentPlayerIndex = 1;
  });

  describe("startGame", () => {
    it("should do nothing if players < 2", () => {
      gameManager.players = new Map();
      gameManager.startGame();
      expect(gameManager.gameStarted).toBe(false);

      gameManager.players.set("1", new Player("1", "Player 1"));
      gameManager.startGame();
      expect(gameManager.gameStarted).toBe(false);
    });

    it("should start a game and deal the cards", () => {
      gameManager.players = new Map();
      gameManager.players.set("1", new Player("1", "Player 1"));
      gameManager.players.set("2", new Player("2", "Player 2"));
      gameManager.startGame();
      expect(gameManager.gameStarted).toBe(true);
      expect(gameManager.choosingBestCards).toBe(true);
      expect(gameManager.deck.length).toBe(34);
      expect(gameManager.players.get("1")?.hand.length).toBe(6);
      expect(gameManager.players.get("2")?.hand.length).toBe(6);
      expect(gameManager.players.get("1")?.blindCards).toBe(3);
      expect(gameManager.players.get("2")?.blindCards).toBe(3);
    });

    it("should start a game with two decks if more than 3 players", () => {
      gameManager.players = new Map();
      gameManager.players.set("1", new Player("1", "Player 1"));
      gameManager.players.set("2", new Player("2", "Player 2"));
      gameManager.players.set("3", new Player("3", "Player 3"));
      gameManager.players.set("4", new Player("4", "Player 4"));
      gameManager.startGame();
      expect(gameManager.gameStarted).toBe(true);
      expect(gameManager.choosingBestCards).toBe(true);
      expect(gameManager.deck.length).toBe(68);
      expect(gameManager.players.get("1")?.hand.length).toBe(6);
      expect(gameManager.players.get("2")?.hand.length).toBe(6);
      expect(gameManager.players.get("3")?.hand.length).toBe(6);
      expect(gameManager.players.get("4")?.hand.length).toBe(6);
      expect(gameManager.players.get("1")?.blindCards).toBe(3);
      expect(gameManager.players.get("2")?.blindCards).toBe(3);
      expect(gameManager.players.get("3")?.blindCards).toBe(3);
      expect(gameManager.players.get("4")?.blindCards).toBe(3);
    });
  });

  describe("setStartingPlayers", () => {
    it("should set player with lowest non-magic card as starting player", () => {
      gameManager.players.get("1")!._hand = [
        new Two(Suit.Clubs),
        new Five(Suit.Clubs),
        new Jack(Suit.Clubs),
      ];

      gameManager.players.get("2")!._hand = [
        new Three(Suit.Clubs),
        new King(Suit.Clubs),
        new Queen(Suit.Clubs),
      ];

      gameManager.players.get("3")!._hand = [
        new Ace(Suit.Clubs),
        new Nine(Suit.Clubs),
        new Ten(Suit.Clubs),
      ];

      gameManager.setStartingPlayers();

      expect(gameManager.startingPlayers).toEqual(["2"]);
    });

    it("should set multiple players with lowest non-magic card when lowest card equal", () => {
      gameManager.players.get("1")!._hand = [
        new Four(Suit.Clubs),
        new Five(Suit.Clubs),
        new Jack(Suit.Clubs),
      ];

      gameManager.players.get("2")!._hand = [
        new Two(Suit.Clubs),
        new King(Suit.Clubs),
        new Queen(Suit.Clubs),
      ];

      gameManager.players.get("3")!._hand = [
        new Four(Suit.Clubs),
        new Nine(Suit.Clubs),
        new Ten(Suit.Clubs),
      ];

      gameManager.setStartingPlayers();

      expect(gameManager.startingPlayers).toEqual(["1", "3"]);
    });
  });

  describe("canPlay", () => {
    it("Should allow multiple of the same cards to be played", () => {
      expect(
        gameManager.canPlay(gameManager.players.get("2")!, [
          new Five(Suit.Clubs),
          new Five(Suit.Clubs),
          new Five(Suit.Clubs),
        ])
      ).toBe(true);
    });

    it("Should not allow multiple of different cards to be played", () => {
      expect(
        gameManager.canPlay(gameManager.players.get("2")!, [
          new Five(Suit.Clubs),
          new Five(Suit.Clubs),
          new Four(Suit.Clubs),
        ])
      ).toBe(false);
    });

    describe("Ace", () => {
      it("should return true if player has an Ace", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Ace(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      });

      it("should allow any card to be played on an Ace as a one", () => {
        let canPlay = (card: Card) => {
          gameManager.bottomDiscardPile =
            Math.random() > 0.5
              ? [new Seven(Suit.Clubs), new Ace(Suit.Clubs, true)]
              : [new Nine(Suit.Clubs), new Ace(Suit.Clubs, true)];
          return gameManager.canPlay(gameManager.players.get("2")!, [card]);
        };

        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      });

      it('should allow any card to be played on multiple aces as ones', () => {
        let canPlay = (card: Card) => {
          return gameManager.canPlay(gameManager.players.get("3")!, [card]);
        };

        gameManager.players.get("2")!._hand = [new Ace(Suit.Diamonds), new Ace(Suit.Clubs)];
        gameManager.bottomDiscardPile = [new Seven(Suit.Clubs)];
        gameManager.playCards(gameManager.players.get("2")!, [new Ace(Suit.Diamonds), new Ace(Suit.Clubs)]);

        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      })

      it('should only allow magic cards when nominated', () => {
        let canPlay = (card: Card) => {
          return gameManager.canPlay(gameManager.players.get("2")!, [card]);
        };
        gameManager.bottomDiscardPile = [new Ace(Suit.Clubs)];
        gameManager.players.get("2")!.nominated = true;

        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      })
    });

    describe("Two", () => {
      it("should return true", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Two(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      });
    });

    describe("Three", () => {
      it("should only be playable on cards 2-3, and power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Three(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Four", () => {
      it("should only be playable on cards 2-4 and power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Four(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Five", () => {
      it("should only be playable on cards 2-5 and power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Five(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Six", () => {
      it("should only be playable on cards 2-6 and power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Six(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Seven", () => {
      it("should only be playable on cards 2-7 and power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Seven(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Eight", () => {
      it("should only be playable on any card except 7", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Eight(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      });
    });

    describe("Nine", () => {
      it("should only be playable on cards 2-9", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Nine(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Ten", () => {
      it("should only be playable on any cards except power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Ten(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      });
    });

    describe("Jack", () => {
      it("should only be playable on cards 2-Jack except power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Jack(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(false);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("Queen", () => {
      it("should only be playable on cards 2-Queen except power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new Queen(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(false);
      });
    });

    describe("King", () => {
      it("should only be playable on cards 2-King except power cards", () => {
        let canPlay = (onCard?: Card) => {
          gameManager.bottomDiscardPile = onCard ? [onCard] : [];
          return gameManager.canPlay(gameManager.players.get("2")!, [
            new King(Suit.Clubs),
          ]);
        };

        expect(canPlay()).toBe(true);
        expect(canPlay(new Ace(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Two(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Three(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Four(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Five(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Six(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Seven(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Eight(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Nine(Suit.Diamonds))).toBe(false);
        expect(canPlay(new Ten(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Jack(Suit.Diamonds))).toBe(true);
        expect(canPlay(new Queen(Suit.Diamonds))).toBe(true);
        expect(canPlay(new King(Suit.Diamonds))).toBe(true);
      });
    });
  });

  describe('playTurn', () => {
    it('should not allow cards to be played if they are not owned', () => {
        gameManager.players.get("2")!._hand = [new Two(Suit.Clubs)];

        gameManager.playCards(gameManager.players.get("2")!, [new Ace(Suit.Clubs)]);

        expect(gameManager.players.get("2")!.hand.length).toBe(1);
        expect(gameManager.discardPile.length).toBe(0);
        expect(gameManager.currentPlayerIndex).toBe(1);
    });

    it('should add cards to the discard pile and remove them from the player', () => {
        gameManager.deck = [new King(Suit.Hearts), new Ace(Suit.Clubs), new Three(Suit.Clubs), new Four(Suit.Clubs)];
        gameManager.players.get("2")!._hand = [new Two(Suit.Clubs)];

        gameManager.playCards(gameManager.players.get("2")!, [new Two(Suit.Clubs)]);

        expect(gameManager.players.get("2")!.hand.filter(c => c.card === CardNumber.Two).length).toEqual(0);
        expect(gameManager.discardPile.length).toBe(1);
        expect(gameManager.currentPlayerIndex).toBe(2);
    });

    it('should pickup cards from deck until 3', () => {
        gameManager.players.get("2")!._hand = [new Two(Suit.Clubs)];
        gameManager.deck = [new King(Suit.Hearts), new Ace(Suit.Clubs), new Three(Suit.Clubs), new Four(Suit.Clubs)];

        gameManager.playCards(gameManager.players.get("2")!, [new Two(Suit.Clubs)]);

        expect(gameManager.players.get("2")!.hand.length).toBe(3);
        expect(gameManager.discardPile.length).toBe(1);
        expect(gameManager.currentPlayerIndex).toBe(2);
        expect(gameManager.deck.length).toBe(1);
    });

    it('should not pickup cards from deck if player has 3 cards', () => {
        gameManager.players.get("2")!._hand = [new Two(Suit.Clubs), new Three(Suit.Clubs), new Four(Suit.Clubs), new Five(Suit.Clubs)];
        gameManager.deck = [new King(Suit.Hearts), new Ace(Suit.Clubs), new Three(Suit.Clubs), new Four(Suit.Clubs)];

        gameManager.playCards(gameManager.players.get("2")!, [new Two(Suit.Clubs)]);

        expect(gameManager.players.get("2")!.hand.length).toBe(3);
        expect(gameManager.discardPile.length).toBe(1);
        expect(gameManager.currentPlayerIndex).toBe(2);
        expect(gameManager.deck.length).toBe(4);
    });

    it('Ace on two fives on a nine', () => {
        gameManager.players.get("2")!._hand = [new Ace(Suit.Clubs)];
        gameManager.bottomDiscardPile = [new Nine(Suit.Hearts), new Five(Suit.Clubs), new Five(Suit.Diamonds)];

        gameManager.playCards(gameManager.players.get("2")!, [new Ace(Suit.Clubs)]);

        let ace = gameManager.discardPile[gameManager.discardPile.length - 1] as Ace;

        expect(ace).toBeInstanceOf(Ace);
    });

    it('Ace then 8 should not allow seven', () => {
      gameManager.players.get("2")!._hand = [new Ace(Suit.Clubs), new Seven(Suit.Clubs), new Two(Suit.Clubs)];
        gameManager.players.get("1")!._hand = [new Ace(Suit.Clubs), new Eight(Suit.Clubs)];
        gameManager.players.get("3")!._hand = [new Ace(Suit.Clubs), new Eight(Suit.Clubs)];

        gameManager.playCards(gameManager.players.get("2")!, [new Ace(Suit.Clubs)]);
        expect(gameManager.players.get("2")!.nominating).toBe(true);
        expect(gameManager.canPlay(gameManager.players.get("3")!, [new Eight(Suit.Clubs)])).toBe(false);

        gameManager.handleNomination(gameManager.players.get("2")!, "1");
        expect(gameManager.players.get("2")!.nominating).toBe(false);
        expect(gameManager.players.get("1")!.nominated).toBe(true);
        
        expect(gameManager.canPlay(gameManager.players.get("3")!, [new Eight(Suit.Clubs)])).toBe(false);
        expect(gameManager.canPlay(gameManager.players.get("1")!, [new Eight(Suit.Clubs)])).toBe(true);

        gameManager.playCards(gameManager.players.get("1")!, [new Eight(Suit.Clubs)]);

        expect(gameManager.players.get("1")!.nominated).toBe(false);
        expect(gameManager.players.get("1")!.nominating).toBe(true);

        gameManager.handleNomination(gameManager.players.get("1")!, "2");

        expect(gameManager.players.get("1")!.nominating).toBe(false);
        expect(gameManager.players.get("2")!.nominated).toBe(true);
        expect(gameManager.canPlay(gameManager.players.get("2")!, [new Seven(Suit.Clubs)])).toBe(false);
        expect(gameManager.canPlay(gameManager.players.get("2")!, [new Ace(Suit.Clubs)])).toBe(true);
    })
  });

  describe('getTopDiscard', () => {
    it('should return the top card of the discard pile', () => {
        gameManager.bottomDiscardPile = [new Jack(Suit.Hearts), new Ace(Suit.Clubs)];

        expect(gameManager.getTopDiscard()).toEqual(new Ace(Suit.Clubs));
    });

    it('should return last non-8 card if top is eight', () => {
        gameManager.bottomDiscardPile = [new Ace(Suit.Clubs), new Two(Suit.Clubs), new Eight(Suit.Hearts)];

        expect(gameManager.getTopDiscard()).toEqual(new Two(Suit.Clubs));
    });

    it('should return eight if only card in discard pile', () => {
        gameManager.bottomDiscardPile = [new Eight(Suit.Hearts)];

        expect(gameManager.getTopDiscard()).toEqual(new Eight(Suit.Hearts));
    });

    it('should return null if discard pile is empty', () => {
        gameManager.bottomDiscardPile = [];

        expect(gameManager.getTopDiscard()).toBeNull();
    });
  });

  describe('getPlayerIndexToPlay', () => {
    it('should return next index on a next event', () => {
        gameManager.bottomDiscardPile = [new Three(Suit.Clubs)];

        expect(gameManager.getPlayerIndexToPlay(CardEvent.Next)).toBe(2);
    });

    it('should return next index on a 9', () => {
        gameManager.bottomDiscardPile = [new Three(Suit.Clubs)];

        expect(gameManager.getPlayerIndexToPlay(CardEvent.Next)).toBe(2);
    });

    it('should return previous index on a seven', () => {
        gameManager.currentPlayerIndex = 1;
        expect(gameManager.getPlayerIndexToPlay(CardEvent.Back)).toBe(0);

        gameManager.currentPlayerIndex = 2;
        expect(gameManager.getPlayerIndexToPlay(CardEvent.Back)).toBe(1);

        gameManager.currentPlayerIndex = 0;
        expect(gameManager.getPlayerIndexToPlay(CardEvent.Back)).toBe(2);
    });

    it('should return same index on Nominate', () => {
        gameManager.bottomDiscardPile = [new Ace(Suit.Clubs), new Eight(Suit.Clubs), new Ace(Suit.Diamonds), new Eight(Suit.Diamonds)];

        expect(gameManager.getPlayerIndexToPlay(CardEvent.Nominate)).toBe(1);
    });

    it('should return same index when discarding pile', () => {
        gameManager.bottomDiscardPile = [new Three(Suit.Clubs)];

        expect(gameManager.getPlayerIndexToPlay(CardEvent.DiscardPile)).toBe(1);
    });

    it('should start from beginning player when round finished', () => {
        gameManager.bottomDiscardPile = [new Three(Suit.Clubs)];
        gameManager.currentPlayerIndex = 2;

        expect(gameManager.getPlayerIndexToPlay(CardEvent.Next)).toBe(0);
    })
  })
});
