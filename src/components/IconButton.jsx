import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IconButton = (props) => {
  return (
    <button onClick={() => props.action()} className="iconBtn">
      <FontAwesomeIcon icon={props.iconName} />
    </button>
  );
};

export default React.memo(IconButton);
