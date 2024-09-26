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
  onConfirm: () => void;
}

const Controls: React.FC<ControlProps> = ({ selectedCards, onConfirm }) => {
  const gameState = selectGameState();
  const playerState = selectPlayerState();
  const room = selectRoom();

  const playTurn = useCallback(
    (cards: Card[]) => {
      let turn: Turn = {
        cards,
        playerId: playerState.me.playerId,
        room: room,
      };
      socket.emit(SocketEvents.PlayCard, turn);
    },
    [playerState?.me?.playerId, room]
  );

  const selectBestCards = useCallback(
    (cards: Card[]) => {
      let cardSelect: BestCardSelection = {
        cards,
        playerId: playerState.me.playerId,
        roomName: room.roomName,
      };
      socket.emit(SocketEvents.SelectBestCard, cardSelect);
    },
    [playerState?.me?.playerId, room?.roomName]
  );

  const confirmSelection = useCallback(() => {
    if (gameState.cardSelectingState) {
      selectBestCards(selectedCards);
    } else {
      playTurn(selectedCards);
    }
  }, [gameState?.cardSelectingState, playTurn, selectBestCards, selectedCards]);

  const pickUp = useCallback(() => {
    let pickupModel: PickUpModel = {
      playerId: playerState.me.playerId,
      roomName: room.roomName,
    };
    socket.emit(SocketEvents.PickUp, pickupModel);
  }, [playerState?.me?.playerId, room?.roomName]);

  return (
    <Flex vertical justify="space-between">
      <Flex justify="space-between">
        {!playerState.isNominating && (
          <Button type="primary" onClick={confirmSelection}>
            Confirm Selection
          </Button>
        )}
        {gameState.discardPile.length > 0 &&
          gameState.isMyTurn(playerState.me) && (
            <Button style={buttonStyle} onClick={pickUp} danger>
              Pickup
            </Button>
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
