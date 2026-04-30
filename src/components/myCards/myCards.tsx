import React, { useCallback, useMemo, useState } from "react";
import { Card, CardType, newCard } from "../../models/card";
import FaceUpCard from "../card/card";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
import DownFacingCardDeck from "../downFacingCardDeck/downFacingCardDeck";
import { uniqBy } from "lodash";
import { Flex } from "antd";
import Controls from "../controls/controls";
import useGameStateService from "../../hooks/useGameStateService/useGameStateService";
import useWindowDimensions from "../../hooks/useWindowDimensions/useWindowDimensions";

interface MyCardsProps {
  cards: readonly CardType[];
}

const CARD_HEIGHT_EM = 9.5;
const CARD_ASPECT = 233 / 333;
const SIDE_RESERVED_PX = 120;

const MyCards: React.FC<MyCardsProps> = ({ cards }: MyCardsProps) => {
  let sortedCards = useMemo(
    () =>
      cards
        .map((c) => newCard(c))
        .sort((a: Card, b: Card) => a.getNumber() - b.getNumber()),
    [cards]
  );

  const gameState = selectGameState();
  const gameFunctions = useGameStateService();
  const playerState = selectPlayerState();
  const { width } = useWindowDimensions();

  const [selectedCardIndexes, setSelectedCardIndexes] = useState<number[]>([]);

  const selectCard = useCallback(
    (index: number) => {
      if (selectedCardIndexes.includes(index)) {
        setSelectedCardIndexes((indexes) => indexes.filter((i) => i !== index));
        return;
      }

      if (gameState.cardSelectingState && selectedCardIndexes.length >= 3) {
        return;
      }

      if (
        !gameState.cardSelectingState &&
        uniqBy([...selectedCardIndexes, index], (i) =>
          sortedCards[i].getNumber()
        ).length > 1
      ) {
        return;
      }

      setSelectedCardIndexes((indexes) => [...indexes, index]);
    },
    [gameState?.cardSelectingState, sortedCards]
  );

  const fanLayout = useMemo(() => {
    const remPx = 16;
    const cardWidthPx = CARD_HEIGHT_EM * CARD_ASPECT * remPx;
    const available = Math.max(width - SIDE_RESERVED_PX, 260);
    const n = sortedCards.length;
    const fitStep = n > 1 ? (available - cardWidthPx) / (n - 1) : 0;
    const maxStep = cardWidthPx * 0.55;
    const minStep = 14;
    const step = Math.max(minStep, Math.min(maxStep, fitStep));
    const totalWidth = cardWidthPx + step * Math.max(n - 1, 0);
    return { cardWidthPx, step, totalWidth };
  }, [width, sortedCards.length]);

  if (!playerState || !playerState.me) {
    return null;
  }

  const statusMessage = gameFunctions.getStatusMessage(playerState.me);

  return (
    <Flex vertical align="center" style={{ height: "100%", width: "100%" }}>
      {statusMessage && <div className="hand-status">{statusMessage}</div>}

      <Flex
        vertical
        align="center"
        justify="flex-end"
        style={{ width: "100%", flex: 1 }}
      >
        <Controls
          bestCards={playerState.me.bestCards}
          selectedCards={selectedCardIndexes.map((index) => sortedCards[index])}
          onConfirm={() => setSelectedCardIndexes([])}
        />

        <Flex justify="center" style={blindCardsContainer}>
          <DownFacingCardDeck
            bestCards={playerState?.me?.bestCards?.length || 0}
            blindCards={playerState?.me?.blindCards || 0}
          />
        </Flex>

        <div
          style={{
            ...handContainer,
            height: `${CARD_HEIGHT_EM + 1.5}em`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: `${fanLayout.totalWidth}px`,
              maxWidth: "100%",
              height: "100%",
              margin: "0 auto",
            }}
          >
            {sortedCards.map((card, index) => {
              const isSelected = selectedCardIndexes.includes(index);
              const cardStyle: React.CSSProperties = {
                position: "absolute",
                width: `${fanLayout.cardWidthPx}px`,
                aspectRatio: `${CARD_ASPECT}`,
                left: `${index * fanLayout.step}px`,
                bottom: isSelected ? "1.2em" : "0",
                zIndex: index + 1,
              };

              return (
                <div
                  key={index}
                  style={cardStyle}
                  onClick={() => selectCard(index)}
                  className={`game-card-slot${isSelected ? " selected" : ""}`}
                >
                  <FaceUpCard
                    card={card}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      cursor: "pointer",
                      boxShadow: isSelected
                        ? "0 0 0 2px #f5d27a, 0 12px 24px rgba(0,0,0,0.55)"
                        : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Flex>
    </Flex>
  );
};

const blindCardsContainer: React.CSSProperties = {
  width: "100%",
  marginBottom: "0.6em",
};

const handContainer: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  padding: "0 1em",
};

export default MyCards;
