import React from "react";
import CardBack from "../cardImages/cardBack";
import { Flex } from "antd";

interface Props {
  blindCards: number;
  bestCards: number;
}

const DownFacingCardDeck: React.FC<Props> = ({ bestCards, blindCards }) => {
  const slots = Math.max(blindCards, bestCards, 3);

  return (
    <Flex justify="center" align="flex-end" gap="0.5em" style={container}>
      {Array.from({ length: slots }).map((_, index) => {
        const hasBlind = index < blindCards;
        const hasBest = index < bestCards;

        return (
          <div key={index} style={slot}>
            {hasBlind && <CardBack style={blindStyle} />}
            {hasBest && <CardBack style={bestStyle} />}
          </div>
        );
      })}
    </Flex>
  );
};

const container: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const slot: React.CSSProperties = {
  position: "relative",
  width: "3em",
  aspectRatio: "233 / 333",
};

const blindStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 1,
};

const bestStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: "-0.6em",
  left: "0.6em",
  zIndex: 2,
};

export default DownFacingCardDeck;
