# Danish — Game Rules

This document describes the rules of *Danish* as currently implemented in this
codebase. It is derived directly from the game logic in
`src/services/gameManager/` and `src/models/card.tsx`, plus the behavior verified
in the spec files. If a rule and the code disagree, the code is the source of
truth.

---

## 1. Overview

Danish is a multiplayer shedding-style card game played in real-time over a
WebSocket connection. Players race to get rid of all of their cards across
three different "zones" (hand, best cards, blind cards). The last player still
holding cards loses ("the Danish").

- **Players:** 2–6
- **Deck:** A single standard 52-card deck (Ace, 2–10, Jack, Queen, King in 4
  suits), shuffled 10 times before dealing.

---

## 2. Setup

### 2.1 Joining a room

- Players join a named room and mark themselves "ready".
- The host can start the game once at least 2 players are present.
  (`GameManager.startGame` does nothing if `players.size < 2`.)
- A room is capped at 6 players (`addPlayer` returns silently when
  `players.size >= 6`).

### 2.2 Dealing

When the game starts, each player receives:

1. **6 cards** dealt to their **hand** (private, only that player sees them).
2. **3 cards** dealt face-down as **blind cards** (no one sees them, not even
   the owner).

The remaining cards form the **draw deck** (face-down pile in the middle).

### 2.3 Choosing "best cards"

Before normal play begins, the game enters a *choosing best cards* phase
(`choosingBestCards = true`):

- Each player selects **3 cards from their hand** to set aside as their
  **best cards** (face-up, visible to everyone).
- After picking 3, those cards leave the hand (the hand drops to 3 cards).
- Best cards cannot be re-chosen once selected
  (`selectBestCards` returns early if `bestCards.length > 0`).
- Play does not start until **every** player has chosen 3 best cards.

### 2.4 Determining the starting player

Once everyone has chosen their best cards, `setStartingPlayers` runs:

- It looks at every player's remaining hand.
- It ignores **Aces** (number 1) and **2s** entirely.
- The player(s) holding the **lowest-numbered** non-Ace, non-2 card start.
- If multiple players are tied for the lowest card, **all of them** are
  considered "starting players" and any of them may play first. Whoever plays
  first becomes the active player and play proceeds from them.

---

## 3. Card Zones (per player)

Each player has cards in three distinct zones, played in this strict order:

1. **Hand** — private cards. You play from here as long as you have any.
2. **Best cards** — face-up cards visible to everyone. You only play from these
   *after* both your hand and the draw deck are empty.
3. **Blind cards** — face-down cards. You only play from these once your hand,
   your best cards, and the deck are all gone. You play them one at a time,
   without seeing the card before you play it.

A player wins (finishes) when **all three zones** are empty.

---

## 4. Card Values and Categories

### 4.1 Numeric values

| Card  | Number |
|-------|--------|
| Ace (as One, see §5.1) | 1 |
| 2     | 2  |
| 3     | 3  |
| 4     | 4  |
| 5     | 5  |
| 6     | 6  |
| 7     | 7  |
| 8     | 8  |
| 9     | 9  |
| 10    | 10 |
| Jack  | 11 |
| Queen | 12 |
| King  | 13 |
| Ace (as Ace) | (special — see §5.1) |

### 4.2 Magic cards

Magic cards bypass the normal "play higher or equal" rule. They are:

- **Ace** (`isMagicCard = true`)
- **2** (`isMagicCard = true`)
- **8** (`isMagicCard = true`)
- **10** (`isMagicCard = true`)

A magic card can always be played on top of anything (subject to a few
exceptions documented per-card below). When a player has been **nominated**
(see §5.1), they may *only* play a magic card.

### 4.3 Power cards

Power cards invert the normal rule — instead of "play higher or equal", the
next play must be **lower or equal**. They are:

- **7** (`isPowerCard = true`)
- **9** (`isPowerCard = true`)

---

## 5. Per-Card Rules

The "top card" of the discard pile is the most recent non-8 card (8s are
"transparent" — see §5.7). All play legality is determined against the top
card.

### 5.1 Ace

- **Magic.** Can be played on anything.
- When played on top of anything **except a 7 or a 9**, it is a **nomination
  card**: the player who played it must choose any other player to play next,
  and that nominated player must play a magic card.
- When played on top of a **7 or 9**, the Ace is automatically converted into
  a **One** (`SetAceOneStatuses`). A One has number **1**, is no longer a
  magic card, and is not a nomination card. This is what lets a player escape
  a 7/9 with an Ace by "playing low".
- When picked up from the discard pile (see §7), any Ones in the pile revert
  back to Aces in the picker's hand.

### 5.2 Two

- **Magic.** Can be played on anything.
- Has number 2. Has no special effect beyond being magic — play continues to
  the next player normally.

### 5.3 Three, Four, Five, Six

- Plain numeric cards.
- Can be played if their number is **>=** the top card's number.
- An exception: they can also be played on **power cards** (7 or 9) provided
  their number is **<=** the power card's number (e.g. a 3 can go on a 7 or a
  9; a 6 can go on a 7 or a 9; but a 5 cannot go on a 4).

### 5.4 Seven

- **Power card.**
- Plays normally (≥ the top card) when placed.
- **After** a 7 is on top, the **next player must play a card with number
  ≤ 7**, and the next player is the **previous player** (turn order reverses
  for one move). See §6.2.
- An 8 cannot be played on a 7 (`Eight.canPlay` rejects this explicitly).

### 5.5 Eight

- **Magic.** Can be played on **any card except a 7**.
- 8s are **transparent**: when determining the top card, all consecutive 8s
  on top of the discard pile are skipped. The "top card" is the most recent
  non-8 card. (If the *only* card in the pile is an 8, then 8 is the top card.)
- Special interactions:
  - **8 on Ace** is treated as a nomination card itself
    (`IsNominationCard` returns true). After playing, the player nominates the
    next player to play a magic card.
  - **8 on a One** (Ace-as-One on a 7/9) is **not** a nomination card.
  - Playing an 8 on top of a stack like `[Ace, 8]` (8 on 8 on Ace) **is**
    still a nomination card — the original Ace shows through.

### 5.6 Nine

- **Power card.**
- Plays normally (≥ the top card) when placed.
- **After** a 9 is on top, the **next player must play a card with number ≤ 9**.
  Turn order does **not** reverse (only 7 reverses).

### 5.7 Ten

- **Magic.** Can be played on any card **except a 7 or 9** (power cards).
- **Burns the pile.** Playing a 10 clears the entire discard pile. The same
  player then plays again (their turn does not pass). They draw back up to 3
  cards as usual.

### 5.8 Jack, Queen, King

- Plain numeric cards (11, 12, 13 respectively).
- Standard rule: must be **>=** the top card.
- They can also go on power cards (7 or 9) if their number is ≤ the power card
  — which for J/Q/K means **never** on a 7 or 9 by that rule (since 11/12/13 >
  9). Tests confirm J/Q/K cannot be played on a 7 or 9.

---

## 6. Turn Flow

### 6.1 A normal turn

On your turn you must do exactly one of:

1. **Play one or more cards of the same number** from your hand (all selected
   cards must share a number — `canPlayCard` rejects mixed numbers).
2. **Pick up the entire discard pile** (see §7) if you can't or don't want to
   play.

After you successfully play:

1. Cards are moved from your hand to the top of the discard pile.
2. If the deck still has cards and your hand has fewer than 3, you draw up to 3.
3. Any card-event effect (clearing the pile, nominating, reversing direction)
   resolves.
4. Turn passes to the next player according to §6.2.

### 6.2 Turn order after a play

The next player is determined by the card just played:

| Play type                                      | Next to play |
|------------------------------------------------|--------------|
| Normal card                                    | Next player (clockwise) |
| **7** (power card)                             | **Previous player** (turn reverses one step) |
| **10** or **four-of-a-kind** (pile burned)     | **Same player** (current player plays again) |
| **Ace** (nomination) / **8 on Ace**            | **Same player** must nominate; the **nominated player** plays next |
| Any card while you are the most recent player  | You may add more of the same number — see §6.4 |

### 6.3 Four-of-a-kind clears the pile

If the **last 4 cards** on the discard pile (after your play) are the same
number, the pile is burned (cleared) — the same as playing a 10. The same
player then plays again.

This can happen across plays: e.g. if two 4s are already on top and you add
two more 4s, the pile burns.

### 6.4 Adding to your own previous play

If you were the **last player to play**, you may add more cards of the
**same number** as the top card on your next opportunity, even if it isn't
strictly your turn (`IsSameCardAddedToPreviousPlay`). This is how you can
chain into a four-of-a-kind across two plays, for example.

### 6.5 Nomination

When a nomination card is played (Ace not on 7/9, or 8 on Ace):

1. The playing player enters the **nominating** state.
2. They cannot play another card until they choose a target — `canPlay`
   rejects further plays with: *"You need to nominate a player to play a magic
   card."*
3. They select any other player; that player becomes **nominated**.
4. The nominated player can **only play a magic card** on their next turn. If
   they have no magic card, they must pick up the pile (§7).
5. The nominator draws back up to 3 cards.
6. Tested behaviour: if a nominated player plays an 8 on the Ace, the 8 is
   itself a nomination card — they nominate again, and the chain continues.

### 6.6 Drawing

Whenever you play (and you are not nominating), you draw from the deck until
your hand has 3 cards. If the deck is empty, you don't draw — you simply
continue with what you have until your hand is gone.

### 6.7 Transitioning between zones

When you finish a play and your hand is now empty:

- If the **deck is empty** and you have **best cards** → your hand is
  immediately replaced with your best cards (your best cards become your new
  hand, and `bestCards` becomes empty). History logs *"has picked up their
  best cards."*
- If the **deck is empty**, your **best cards are gone**, and you have
  **blind cards** → you take the **top blind card** (popped from the stack)
  into your hand, sight unseen. History logs *"has picked up a blind card."*
- If everything is empty (deck, hand, best, blind) → you have won (see §8).

---

## 7. Picking up the pile

A player whose turn it is may, instead of playing, pick up the entire discard
pile:

- All cards in the discard pile move into the player's hand.
- Any **Ones** in the pile (Aces previously converted to Ones, see §5.1) are
  converted **back to Aces** as they enter the hand.
- The discard pile is cleared.
- The player's `nominated` flag is cleared (so they are no longer obligated to
  play a magic card).
- Turn passes to the **next** player.

This is also the de-facto fallback when a nominated player has no magic card
to play.

---

## 8. Winning and Losing

A player **finishes** (wins their position) when all three of the following
are true:

- Hand is empty
- Best cards are empty
- Blind cards are empty

When this occurs, they are recorded in the `winners` list (in the order they
finished — first to finish is 1st place, second is 2nd place, etc.) and removed
from active play (`inGame = false`).

The game continues until **only one player remains** in play. That player is
**the Danish** — i.e. the loser. History logs *"\<name\> has lost!"*.

There is no scoring beyond finishing position; the goal is simply to not be
last.

---

## 9. Multi-card plays

You may play multiple cards in one move provided:

- They all share the **same number** (`canPlayCard` rejects mixed numbers).
- The number satisfies the normal play rule against the current top card.

Examples:

- Three 5s on a 4 → legal (≥ rule satisfied).
- Two 4s on a 7 → legal (4 ≤ 7 on a power card).
- One 5 and one 4 → never legal (different numbers).
- Two Aces on a 7 → legal: both are converted to Ones, neither is a
  nomination card, and any card can subsequently be played on top.

---

## 10. Summary tables

### 10.1 What can be played on each top card

| Top card | Legal next plays                                         |
|----------|----------------------------------------------------------|
| (empty)  | Anything                                                 |
| Ace (high) | Any **magic** card only — you are nominated. (Other cards are illegal until you play a magic card.) |
| One (Ace as One) | Anything                                          |
| 2        | Anything (≥ 2)                                           |
| 3        | 3+, plus magics (A, 2, 8, 10)                            |
| 4        | 4+, plus magics                                          |
| 5        | 5+, plus magics                                          |
| 6        | 6+, plus magics                                          |
| 7 (power)| Card with number ≤ 7 only; **8 cannot be played on 7**; **10 cannot be played on 7** |
| 8        | Look through to the card below (8s are transparent)      |
| 9 (power)| Card with number ≤ 9 only; **10 cannot be played on 9**  |
| 10       | (Pile is burned — there is no "10 on top" state)         |
| Jack     | J+, plus magics                                          |
| Queen    | Q, K, plus magics                                        |
| King     | K, plus magics                                           |

### 10.2 Card effects at a glance

| Card   | Effect on play                                                  |
|--------|-----------------------------------------------------------------|
| Ace    | Magic; nominate next player (unless on 7/9, then it's a "One")  |
| 2      | Magic; no special effect                                        |
| 7      | Power; next must play ≤ 7; turn order reverses one step         |
| 8      | Magic; transparent (top card is the card below); 8-on-Ace nominates |
| 9      | Power; next must play ≤ 9                                       |
| 10     | Magic; burns the pile; same player plays again                  |
| 4-of-a-kind | Burns the pile; same player plays again                    |
| Other  | Standard "play higher or equal" rule                            |

---

## 11. Notes on edge cases (from the implementation)

- **Empty pile**: any card can be played on an empty discard pile.
- **8 stack handling**: stacking 8s does not change which card is "showing".
  An 8 on a 7 is illegal; an 8 on an 8 on a 7 is therefore also illegal
  (because the underlying top is still the 7).
- **Ace conversion is permanent within the pile**: once an Ace becomes a One,
  it stays a One on the pile. Only when picked up does it revert to an Ace.
- **Reversal only lasts one move**: the 7 reverses direction for the *next*
  play only; play resumes its normal order from whoever played after the 7.
- **Nominating yourself**: nomination targets *any other player* (the
  nominator is excluded by virtue of becoming the new "current player" through
  a different code path; nominating one's self is not a normal flow).
- **Disconnects**: a player who disconnects during a game is marked
  disconnected in the room but is not removed from the game, and the game
  state is preserved. Reconnect by re-joining the same room.
