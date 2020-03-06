import React from "react";

function CharacterCounter({ chars = 0, max = 0 }) {
  let style = { color: chars <= max ? "black" : "red" };
  return <p style={style}>{max - chars} characters remaining</p>;
}

export default CharacterCounter;
