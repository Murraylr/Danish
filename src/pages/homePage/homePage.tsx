import React from "react";
import RoomCreator from "../../components/roomCreator/roomCreator";

interface Props {
  // Define your component props here
  navigator?: any;
}

export const HomePage: React.FC<Props> = ({ navigator }) => {
  return (
    <div>
      <RoomCreator navigator={navigator} />
    </div>
  );
};
