import React from "react";
import { Card } from "../../models/card";
import FaceUpCard from "../card/card";

interface DiscardPileProps {
  cards: Card[]; // Array of card image URLs
}

const DiscardPile: React.FC<DiscardPileProps> = ({ cards }) => {
  return (
    <div className="discard-pile" style={discardPileStyle}>
      <div style={pileContainer}>
        {cards.map((card, index) => {
          let style: React.CSSProperties = {
            ...cardStyle,
            left: index * 1,
            zIndex: index,
          };
          return (
            <div style={style} key={index}>
              <FaceUpCard card={card}></FaceUpCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const pileContainer: React.CSSProperties = {
  minHeight: "15em",
};

const discardPileStyle: React.CSSProperties = {
  padding: "10px",
  marginBottom: "20px",
  height: "30vh",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const cardContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const cardStyle: React.CSSProperties = {
  position: "absolute",
};

export default DiscardPile;
