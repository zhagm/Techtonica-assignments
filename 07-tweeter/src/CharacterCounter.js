import React from "react";

function CharacterCounter({ chars, max }) {
  let style = { color: chars <= max ? "black" : "red" };
  return <p style={style}>{max - chars} characters remaining</p>;
}

export default CharacterCounter;
