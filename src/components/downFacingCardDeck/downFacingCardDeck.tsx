import React from "react";
import CardBack from "../cardImages/cardBack";
import { Flex } from "antd";

interface Props {
  blindCards: number;
  bestCards: number;
}

const DownFacingCardDeck: React.FC<Props> = ({ bestCards, blindCards }) => {
  // Implement your component logic here

  return (
    <Flex justify="space-around" gap={5}>
      {Array.from({ length: blindCards }).map((_, index) => {
        var bestCard = bestCards >= index + 1;

        return (
          <div key={index} style={blindCardPile}>
            <CardBack
              style={{
                gridArea: `1/1/2/2`,
              }}
            />
            {bestCard && (
              <CardBack
                style={{
                  gridArea: `1/1/2/2`,
                  marginLeft: "0.6em",
                }}
              />
            )}
          </div>
        );
      })}
    </Flex>
  );
};

const blindCardPile: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "3em 3fr",
  gridTemplateRows: "5em 1fr",
};

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
