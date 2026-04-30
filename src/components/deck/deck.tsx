import React from "react";
import CardBack from "../cardImages/cardBack";

interface DeckProps {
  deckNumber: number;
}

const Deck: React.FC<DeckProps> = ({ deckNumber }) => {
  const visibleStack = Math.min(Math.max(deckNumber, 0), 5);
  const empty = deckNumber === 0;

  return (
    <div style={wrapper}>
      <span className="section-label">Deck</span>
      <div style={pile}>
        {empty ? (
          <div style={emptySlot}>Empty</div>
        ) : (
          <>
            {Array.from({ length: visibleStack }).map((_, index) => (
              <CardBack
                key={index}
                style={{
                  ...cardStyle,
                  left: `${index * 2}px`,
                  top: `${-index * 2}px`,
                  zIndex: index,
                }}
              />
            ))}
            <span className="pile-badge">{deckNumber}</span>
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

export default Deck;
