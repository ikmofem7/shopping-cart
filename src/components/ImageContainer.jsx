import React from "react";

const ImageContainer = (props) => {
  return (
    <div className="imgContainer">
      <img src={props.imgUrl} width="100" height="100" alt={props.name} />
      <p>{`${props.offer}% OFF`}</p>
    </div>
  );
};

export default ImageContainer;
