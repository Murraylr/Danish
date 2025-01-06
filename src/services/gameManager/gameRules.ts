import { every } from "lodash";
import { Card, newCard } from "../../models/card";
import { GameState } from "../../models/gameState";
import { GameManager, Move, PlayAction } from "./gameManager";
import { FullGameState } from "./gameManager.spec";
import { GameHistory, HistoryEntry } from "../gameHistory/gameHistory";

const magicCards = [1, 2, 8, 10];
const powerCards = [7, 9];

class RuleSet {
  rules: Rule[] = [];

  addRule(
    name: string,
    rule: (
      gameState: FullGameState,
      move: Move,
      moveHistory?: HistoryEntry[],
      nextMove?: Move
    ) => boolean
  ) {
    this.rules.push(new Rule(name, rule));
  }

  private testRules(gameHistories: GameHistory[]) {
    return new Promise<void>(async (resolve, reject) => {
      for (let r of this.rules) {
        try {
          await this.testRule(gameHistories, r);
        } catch (e) {
          reject(e);
        }
      }
      resolve();
    });
  }

  private async testRule(gameHistories: GameHistory[], rule: Rule) {
    return new Promise<void>((resolve, reject) => {
      process.stdout.write(rule.name + ": ", () => {
        for (let i = 0; i < gameHistories.length; i++) {
          for (let j = 0; j < gameHistories[i].history.length; j++) {
            let entry = gameHistories[i].history[j];
            let history = gameHistories[i].history.slice(0, j);
            let nextMove = gameHistories[i].history[j + 1]?.move;
            if (!rule.test(entry.gameState, entry.move, history, nextMove)) {
              process.stdout.write("\x1b[1m\x1b[31mFailed!\x1b[89m\x1b[22m\n");
              process.stdout.write("\x1b[0m\n");
              reject({
                name: rule.name,
                history,
                move: entry.move,
                moveIndex: j,
                iteration: i,
                nextMove,
                fullGameHistory: gameHistories[i],
              });
              return;
            }
          }
        }
        process.stdout.write("\x1b[1m\x1b[32mPassed!\x1b[89m\x1b[22m\n", () => {
          process.stdout.write("\x1b[0m");
          resolve();
        });
      });
    });
  }

  testGame(simulateGameFunction: () => GameHistory, iterations: number) {
    let gameHistories: GameHistory[] = [];
    for (let i = 0; i < iterations; i++) {
      gameHistories.push(simulateGameFunction());
    }

    return this.testRules(gameHistories);
  }
}

class Rule {
  name: string;
  test: (
    gameState: FullGameState,
    Move: Move,
    moveHistory: HistoryEntry[],
    nextMove?: Move
  ) => boolean;
  /**
   *
   */
  constructor(
    name: string,
    test: (
      gameState: FullGameState,
      move: Move,
      moveHistory?: HistoryEntry[],
      nextMove?: Move
    ) => boolean
  ) {
    this.name = name;
    this.test = test;
  }
}

var ruleSet = new RuleSet();

ruleSet.addRule(
  "Must be higher or equal to the last card played",
  (game, move) => {
    if (move.action !== PlayAction.Play) {
      return true;
    }

    if (game.discardPile.length === 0) {
      return true;
    }

    let lastCardPlayed = game.discardPile[game.discardPile.length - 1];
    if (
      magicCards.includes(lastCardPlayed) ||
      powerCards.includes(lastCardPlayed)
    ) {
      return true;
    }

    if (magicCards.includes(move.cardNumber)) {
      return true;
    }

    return move.cardNumber >= lastCardPlayed;
  }
);

ruleSet.addRule("Must be lower or equal to a power card", (game, move) => {
  if (move.action !== PlayAction.Play) {
    return true;
  }

  if (game.discardPile.length === 0) {
    return true;
  }

  let lastCardPlayed = game.discardPile[game.discardPile.length - 1];
  if (!powerCards.includes(lastCardPlayed)) {
    return true;
  }

  return move.cardNumber <= lastCardPlayed;
});

ruleSet.addRule("Must go to previous player after a 7", (game, move) => {
  if (move.cardNumber !== 7 || move.clearedPack) {
    return true;
  }
  if (move.playerIndex === 0) {
    return game.currentPlayerIndex === game.players.length - 1;
  }

  return game.currentPlayerIndex === move.playerIndex - 1;
});

ruleSet.addRule(
  "Player should never have less than three cards",
  (game, move) => {
    if (move.action !== PlayAction.Nominate) {
      return true;
    }

    return every(game.players, (p) => {
      return (p) => {
        if (p.hand.length >= 3 || game.deck.length === 0) {
          throw new Error(
            "Hand length: " +
              p.hand.length +
              " Deck length: " +
              game.deck.length
          );
        }
      };
    });
  }
);

ruleSet.addRule("When picking up, then next person plays", (game, move) => {
  if (move.action !== PlayAction.PickUp) {
    return true;
  }

  return (
    game.currentPlayerIndex === (move.playerIndex + 1) % game.players.length
  );
});

ruleSet.addRule(
  "It should never pickup blind or top cards when you still have cards in your hand",
  (game, move) => {
    if (
      move.action !== PlayAction.PickupBlindCards &&
      move.action !== PlayAction.PickUpBestCards
    ) {
      return true;
    }
    return game.players[move.playerIndex].hand.length === 0;
  }
);

ruleSet.addRule(
  "An eight played on an ace should be followed by a nomination",
  (game, move, history, nextMove) => {
    if (move.cardNumber !== 8) {
      return true;
    }

    if (
      history.length === 0 ||
      history[history.length - 1].move.action !== PlayAction.Nominate
    ) {
      return true;
    }

    // TODO: This is a temporary fix before the actual rule is implemented!
    if (!nextMove) {
      return true;
    }

    return move.clearedPack || nextMove?.action === PlayAction.Nominate;
  }
);

ruleSet.addRule(
  "An eight can be played on anything except a 7",
  (game, move) => {
    if (move.action !== PlayAction.Play) {
      return true;
    }
    return (
      move.cardNumber !== 8 ||
      game.discardPile[game.discardPile.length - 1] !== 7
    );
  }
);

export default ruleSet;
