import React from "react";

function Board(props) {
  function selectTile(row, col, coords) {
    // if coords doesn't include selected tile and selected tile is a neighbor to last selected tile or is the first tile being selected
    if (
      !coords.some(c => coordsAreSame(c, [row, col])) &&
      (!coords.length ||
        isNeighborTile(`${row}${col}`, coords[coords.length - 1]))
    ) {
      props.modifySelectedCoords([...coords, [row, col]]);
    } else if (coordsAreSame(coords[coords.length - 1], [row, col])) {
      props.modifySelectedCoords(coords.slice(0, -1));
    }
  }

  function isNeighborTile(t1, t2) {
    return Math.abs(t1[0] - t2[0]) <= 1 && Math.abs(t1[1] - t2[1]) <= 1;
  }

  let { board, selectedCoords: coords, coordsAreSame } = props;
  return (
    <div className="board">
      {board.map((row, x) => (
        <div key={`row${x}`} className="board-row">
          {row.map((tile, y) => (
            <span
              key={`col${y}`}
              className={`flex-item board-tile ${
                coords.some(c => coordsAreSame(c, [x, y])) ? "selected" : ""
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

export default Board;
