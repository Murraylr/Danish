import {
  Ace,
  Card,
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
import {
  getTopDiscard,
  IsFourSameCards,
  IsNominationCard,
} from "./gameFunctions";

describe("Game Functions", () => {
  describe("IsFourSameCards", () => {
    let discardPile: Card[] = [];

    beforeEach(() => {
      discardPile = [
        new Nine(Suit.Clubs),
        new Nine(Suit.Diamonds),
        new Three(Suit.Hearts),
      ];
    });

    it("should return true if 4 of the same cards are played", () => {
      let cardsToPlay = [
        new Four(Suit.Clubs),
        new Four(Suit.Diamonds),
        new Four(Suit.Hearts),
        new Four(Suit.Spades),
      ];

      expect(IsFourSameCards(cardsToPlay, discardPile)).toBe(true);
    });

    it("should return true if 2 cards are played on top of 2 of the same cards", () => {
      let cardsToPlay = [new Four(Suit.Hearts), new Four(Suit.Spades)];

      discardPile = [
        ...discardPile,
        new Four(Suit.Clubs),
        new Four(Suit.Diamonds),
      ];

      expect(IsFourSameCards(cardsToPlay, discardPile)).toBe(true);
    });

    it("should return false if there is a card in between the 4", () => {
      let cardsToPlay = [new Four(Suit.Hearts), new Four(Suit.Spades)];

      discardPile = [
        ...discardPile,
        new Four(Suit.Clubs),
        new Four(Suit.Diamonds),
        new Eight(Suit.Clubs),
      ];

      expect(IsFourSameCards(cardsToPlay, discardPile)).toBe(false);
    });
  });

  describe("IsNominationCard", () => {
    describe("Ace", () => {
      it("should be a nomination card when played on anything except a 7 or a 9", () => {
        expect(IsNominationCard(new Ace(Suit.Clubs), [])).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Ace(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Two(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Three(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Four(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Five(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Six(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Seven(Suit.Diamonds)])
        ).toBe(false);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Eight(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Nine(Suit.Diamonds)])
        ).toBe(false);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Ten(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Jack(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new Queen(Suit.Diamonds)])
        ).toBe(true);
        expect(
          IsNominationCard(new Ace(Suit.Clubs), [new King(Suit.Diamonds)])
        ).toBe(true);
      });

      it("should not be a nomination card when played on an 8 on top of a 9", () => {
        let discardPile = [new Nine(Suit.Clubs), new Eight(Suit.Clubs)];

        expect(IsNominationCard(new Ace(Suit.Clubs), discardPile)).toBe(false);
      });

      it("should be a nomination card when played on top of a 1", () => {
        let discardPile = [new Nine(Suit.Clubs), new Ace(Suit.Clubs, true)];

        expect(IsNominationCard(new Ace(Suit.Clubs), discardPile)).toBe(true);
      });
    });

    describe("Eight", () => {
      it("should only be a nomination card when played on an ace", () => {
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Ace(Suit.Clubs)])
        ).toBe(true);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Two(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Three(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Four(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Five(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Six(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Seven(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Eight(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Nine(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Ten(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Jack(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new Queen(Suit.Clubs)])
        ).toBe(false);
        expect(
          IsNominationCard(new Eight(Suit.Clubs), [new King(Suit.Clubs)])
        ).toBe(false);
      });

      it("should not be a nomination card when played on a 1", () => {
        let discardPile = [new Nine(Suit.Clubs), new Ace(Suit.Clubs, true)];
        expect(IsNominationCard(new Eight(Suit.Clubs), discardPile)).toBe(
          false
        );
      });

      it("should be a nomination card when played on an 8 on an ace", () => {
        let discardPile = [new Ace(Suit.Clubs), new Eight(Suit.Clubs)];
        expect(IsNominationCard(new Eight(Suit.Clubs), discardPile)).toBe(true);
      });

      it("should be a 1 when played on an 8 on a 1", () => {
        let discardPile = [
          new Nine(Suit.Clubs),
          new Ace(Suit.Clubs, true),
          new Eight(Suit.Clubs),
        ];
        expect(IsNominationCard(new Eight(Suit.Clubs), discardPile)).toBe(
          false
        );
      });
    });
  });

  describe("getTopDiscard", () => {
    it("should return null if the discard pile is empty", () => {
      expect(getTopDiscard([])).toBe(null);
    });

    it("should return top card for all cards except 8s", () => {
      expect(getTopDiscard([new Ace(Suit.Clubs)])).toBeInstanceOf(Ace);
      expect(getTopDiscard([new Two(Suit.Clubs)])).toBeInstanceOf(Two);
      expect(getTopDiscard([new Three(Suit.Clubs)])).toBeInstanceOf(Three);
      expect(getTopDiscard([new Four(Suit.Clubs)])).toBeInstanceOf(Four);
      expect(getTopDiscard([new Five(Suit.Clubs)])).toBeInstanceOf(Five);
      expect(getTopDiscard([new Six(Suit.Clubs)])).toBeInstanceOf(Six);
      expect(getTopDiscard([new Seven(Suit.Clubs)])).toBeInstanceOf(Seven);
      expect(getTopDiscard([new Nine(Suit.Clubs)])).toBeInstanceOf(Nine);
      expect(getTopDiscard([new Ten(Suit.Clubs)])).toBeInstanceOf(Ten);
      expect(getTopDiscard([new Jack(Suit.Clubs)])).toBeInstanceOf(Jack);
      expect(getTopDiscard([new Queen(Suit.Clubs)])).toBeInstanceOf(Queen);
      expect(getTopDiscard([new King(Suit.Clubs)])).toBeInstanceOf(King);
    });

    it("should return 8 if 8 is the only card", () => {
      expect(getTopDiscard([new Eight(Suit.Clubs)])).toBeInstanceOf(Eight);
    });

    it("should return last non-8 card if 8 is at the top", () => {
      expect(
        getTopDiscard([new Ace(Suit.Clubs), new Eight(Suit.Clubs)])
      ).toBeInstanceOf(Ace);
      expect(
        getTopDiscard([
          new Three(Suit.Clubs),
          new Eight(Suit.Clubs),
          new Eight(Suit.Clubs),
        ])
      ).toBeInstanceOf(Three);
      expect(
        getTopDiscard([
          new Nine(Suit.Clubs),
          new Eight(Suit.Clubs),
          new Eight(Suit.Clubs),
          new Eight(Suit.Clubs),
        ])
      ).toBeInstanceOf(Nine);
    });
  });
});
