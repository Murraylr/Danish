import React from "react";
import { HistoryEntry } from "../../services/gameManager/gameManager";
import { Flex } from "antd";

interface HistoryTabProps {
  history: HistoryEntry[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ history }) => {
  return (
    <div style={container}>
      <Flex vertical>
        <h2>Game History</h2>
        {history.map((history, index) => (
          <div key={index}>
            {history?.player?.name} {history.message}
          </div>
        ))}
      </Flex>
    </div>
  );
};

const container: React.CSSProperties = {
  maxHeight: "200px",
  overflow: "auto",
};

export default HistoryTab;
