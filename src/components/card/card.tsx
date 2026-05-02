import React from "react";
import { CardNumber, CardType, newCard, Suit } from "../../models/card";

interface CardComponentProps {
  card: CardType;
  style?: React.CSSProperties;
}

const innerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "block",
};

const VALID_SUITS = new Set<string>(Object.values(Suit));
const VALID_NUMBERS = new Set<string | number>(
  Object.values(CardNumber) as Array<string | number>
);

const isValidCard = (card: CardType): boolean => {
  if (!card) {
    return false;
  }
  return VALID_SUITS.has(card.suit) && VALID_NUMBERS.has(card.card);
};

const UnknownCard: React.FC<{ card: CardType; style?: React.CSSProperties }> = ({
  card,
  style,
}) => {
  return (
    <div className="game-card unknown-card" style={style} title="Invalid card">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "repeating-linear-gradient(45deg, #ffe4e4 0 8px, #ffd0d0 8px 16px)",
          color: "#a8071a",
          fontWeight: 700,
          fontSize: "1.2em",
          textAlign: "center",
          padding: "0.5em",
          boxSizing: "border-box",
        }}
      >
        <div>
          <div style={{ fontSize: "1.6em", lineHeight: 1 }}>?</div>
          <div style={{ fontSize: "0.55em", marginTop: "0.4em" }}>
            {String(card?.card ?? "?")}/{String(card?.suit ?? "?")}
          </div>
        </div>
      </div>
    </div>
  );
};

const CardComponent: React.FC<CardComponentProps> = ({
  style,
  card,
}: CardComponentProps) => {
  if (!isValidCard(card)) {
    console.error("CardComponent received invalid card", card);
    return <UnknownCard card={card} style={style} />;
  }

  const c = newCard(card);
  const rendered = c.render(innerStyle);

  if (!rendered) {
    console.error("CardComponent render returned empty for card", card);
    return <UnknownCard card={card} style={style} />;
  }

  return (
    <div className="game-card" style={style}>
      {rendered}
    </div>
  );
};

export default CardComponent;
