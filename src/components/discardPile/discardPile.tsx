import React from "react";
import { CardType } from "../../models/card";
import FaceUpCard from "../card/card";

interface DiscardPileProps {
  cards: CardType[];
  lastCardsPlayed: CardType[];
}

const DiscardPile: React.FC<DiscardPileProps> = ({
  cards,
  lastCardsPlayed,
}) => {
  const baseStackTop = cards.slice(-3);
  const total = cards.length + lastCardsPlayed.length;

  return (
    <div style={wrapper}>
      <span className="section-label">Discard</span>
      <div style={pile}>
        {total === 0 ? (
          <div style={emptySlot}>Empty</div>
        ) : (
          <>
            {baseStackTop.map((card, index) => {
              const style: React.CSSProperties = {
                ...cardStyle,
                left: `${index * 2}px`,
                top: `${-index * 2}px`,
                zIndex: index,
              };
              return (
                <FaceUpCard
                  key={`base-${index}`}
                  style={style}
                  card={card}
                />
              );
            })}

            {lastCardsPlayed.map((card, index) => {
              const offset = baseStackTop.length * 2;
              const style: React.CSSProperties = {
                ...cardStyle,
                left: `calc(${offset}px + ${index * 1.4}em)`,
                top: `${-offset - index * 4}px`,
                zIndex: 100 + index,
                boxShadow:
                  "0 0 0 2px rgba(245, 210, 122, 0.7), 0 10px 22px rgba(0,0,0,0.55)",
              };
              return (
                <FaceUpCard
                  key={`last-${index}`}
                  style={style}
                  card={card}
                />
              );
            })}
            <span className="pile-badge">{cards.length}</span>
          </>
        )}
      </div>
    </div>
  );
};

const wrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.4em",
};

const pile: React.CSSProperties = {
  position: "relative",
  width: "6em",
  aspectRatio: "233 / 333",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

const emptySlot: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
  border: "2px dashed rgba(245, 233, 200, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(245, 233, 200, 0.6)",
  fontSize: "0.85em",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export default DiscardPile;
