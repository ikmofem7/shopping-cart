import React from "react";
import NormalButton from "./NormalButton";

const FloatingBottom = (props) => {
  return (
    <div className="floatingBottomContainer customWidth">
      <div className="floatingBottom">
        <div className="bottomTextContainer">
          <p>{`Qty ${props.quantity}`}</p>
          <p>{`Total ${props.total}`}</p>
        </div>
        <div className="checkOutContainer">
          <NormalButton title="checkout" action={props.action} />
        </div>
      </div>
    </div>
  );
};

export default FloatingBottom;
