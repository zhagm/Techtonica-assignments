import React from "react";

function Word(props) {
  let { board, selectedCoords } = props;
  function getWord(board, coordsArr) {
    return coordsArr.reduce((str, [x, y]) => {
      return str + board[x][y];
    }, "");
  }
  return (
    <div className="container">
      <h1>{getWord(board, selectedCoords)}</h1>
    </div>
  );
}

export default Word;
