import React from "react";
// import "./Game.css";

function Board(props) {
  function getBoard(board, coords) {
    return (
      <div className="board">
        {board.map((row, x) => (
          <div key={`row${x}`} className="board-row">
            {row.map((tile, y) => (
              <span
                key={`col${y}`}
                className={`flex-item board-tile ${
                  coords.includes(`${x}${y}`) ? "selected" : ""
                }`}
                onClick={() => selectTile(x, y, coords)}
              >
                {tile}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  function selectTile(row, col, coords) {
    console.log("TILE SELECTED ", row, col, "coords: ", coords);
    // if coords doesn't include selected tile and selected tile is a neighbor to last selected tile or is the first tile being selected
    if (
      !coords.includes(`${row}${col}`) &&
      (!coords.length ||
        isNeighborTile(`${row}${col}`, coords[coords.length - 1]))
    ) {
      props.modifySelectedCoords([...coords, `${row}${col}`]);
    }
  }

  function isNeighborTile(t1, t2) {
    return Math.abs(+t1[0] - +t2[0]) <= 1 && Math.abs(+t1[1] - +t2[1]) <= 1;
  }

  return (
    <div className="container">
      {getBoard(props.board, props.selectedCoords)}
    </div>
  );
}

export default Board;
