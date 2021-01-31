import React, { Fragment } from "react";

function Modal(props) {
  return (
    <Fragment>
      <div className="backDrop" onClick={() => props.modalClose()}></div>
      <div
        className="modal"
        style={{
          transform: props.modal ? "translateY(0)" : "translateY(-100vh)",
          opacity: props.modal ? "1" : "0",
        }}
      >
        {props.children}
      </div>
    </Fragment>
  );
}

export default Modal;
