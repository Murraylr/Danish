import React from "react";
import CardBack from "../cardImages/cardBack";

interface Props {
    blindCards: number;
    bestCards: number;
}

const DownFacingCardDeck: React.FC<Props> = ({ bestCards, blindCards }) => {
  // Implement your component logic here

  return (
    <div style={tableCardsContainer}>
      <div style={blindCardsStyle}>
        {Array.from({ length: blindCards }).map((_, index) => {
          return (
            <div key={index} style={blindCard}>
              <CardBack />
            </div>
          );
        })}
      </div>
      <div style={bestCardsStyle}>
        {Array.from({ length: bestCards }).map((_, index) => {
          return (
            <div key={index} style={bestCard}>
              <CardBack />
            </div>
          );
        })}
      </div>
    </div>
  );
};


const tableCardsContainer: React.CSSProperties = {
    position: "relative",
    minHeight: "5em",
    minWidth: "10em",
  };
  
  const blindCardsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
  };
  
  const blindCard: React.CSSProperties = {};
  
  const bestCardsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    zIndex: 1,
  };
  
  const bestCard: React.CSSProperties = {
    marginLeft: "10px",
  };
  

export default DownFacingCardDeck;
