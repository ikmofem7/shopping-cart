import React from "react";

function NormalButton(props) {
  return (
    <button onClick={() => props.action()} className="normalButton">
      {props.title}
    </button>
  );
}

export default NormalButton;
