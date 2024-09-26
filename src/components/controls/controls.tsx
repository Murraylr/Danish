import React, { useCallback } from "react";
import { selectGameState } from "../../redux/gameState/gameStateSlice";
import { selectPlayerState } from "../../redux/playerState/playerStateSlice";
import { Button, Flex } from "antd";
import { PickUpModel } from "../../models/pickUpModel";
import { selectRoom } from "../../redux/roomState/roomStateSlice";
import socket from "../../services/socket.io/socket.io";
import { SocketEvents } from "../../models/socketEvents";
import { Card } from "../../models/card";
import { Turn } from "../../models/turn";
import { BestCardSelection } from "../../models/bestCardSelection";
import { Nomination } from "../../models/nomination";

interface ControlProps {
  selectedCards: Card[];
  bestCards: Card[];
  onConfirm: () => void;
}

const Controls: React.FC<ControlProps> = ({
  selectedCards,
  bestCards,
  onConfirm,
}) => {
  const gameState = selectGameState();
  const playerState = selectPlayerState();
  const room = selectRoom();

  const playTurn = useCallback(() => {
    let turn: Turn = {
      cards: selectedCards,
      playerId: playerState.me.playerId,
      room: room,
    };
    socket.emit(SocketEvents.PlayCard, turn);
    onConfirm();
  }, [playerState?.me?.playerId, room, selectedCards]);

  const selectBestCards = useCallback(() => {
    if (selectedCards.length !== 3) {
      return;
    }

    let cardSelect: BestCardSelection = {
      cards: selectedCards,
      playerId: playerState.me.playerId,
      roomName: room.roomName,
    };

    socket.emit(SocketEvents.SelectBestCard, cardSelect);

    onConfirm();
  }, [playerState?.me?.playerId, room?.roomName, selectedCards]);

  const pickUp = useCallback(() => {
    let pickupModel: PickUpModel = {
      playerId: playerState.me.playerId,
      roomName: room.roomName,
    };
    socket.emit(SocketEvents.PickUp, pickupModel);
    onConfirm();
  }, [playerState?.me?.playerId, room?.roomName]);

  return (
    <Flex vertical justify="space-between">
      <Flex justify="space-between">
        {gameState.cardSelectingState && (
          <Button type="primary" onClick={selectBestCards} disabled={selectedCards.length + bestCards.length !== 3}>
            Select Cards
          </Button>
        )}

        {gameState.isMyTurn(playerState.me) && (
          <>
            {!playerState.isNominating && (
              <Button type="primary" onClick={playTurn}>
                Play cards
              </Button>
            )}
            {gameState.discardPile.length > 0 && (
              <Button style={buttonStyle} onClick={pickUp} danger>
                Pickup
              </Button>
            )}
          </>
        )}
      </Flex>
      <Flex>
        {playerState.isNominating && (
          <div>
            {gameState.players.map((p) => {
              let nomination: Nomination = {
                nominatedPlayerId: p?.playerId,
                playerId: playerState?.me?.playerId,
                roomName: room?.roomName,
              };
              return (
                <Button
                  onClick={() =>
                    socket.emit(SocketEvents.SelectNomination, nomination)
                  }
                >
                  {p.name}
                </Button>
              );
            })}
          </div>
        )}
      </Flex>
    </Flex>
  );
};

const buttonStyle: React.CSSProperties = {
  flex: 1,
};

export default Controls;
