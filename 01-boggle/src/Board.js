import React, { Component } from "react";
import "./Board.css";

class Board extends Component {
  constructor(props) {
    super();
    this.state = {
      board: [
        ["a", "b", "c", "d"],
        ["e", "f", "g", "h"],
        ["i", "j", "k", "l"],
        ["m", "n", "o", "p"]
      ],
      selectedCoords: ["00"]
    };
  }
  getBoard() {
    let { board, selectedCoords: coords } = this.state;
    return (
      <div className="board">
        {board.map((row, x) => (
          <div key={`row${x}`} className="board-row">
            {row.map((square, y) => (
              <span
                key={`col${y}`}
                className={`flex-item board-square ${
                  coords.includes(`${x}${y}`) ? "selected" : ""
                }`}
              >
                {square}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }
  render() {
    return <div className="container">{this.getBoard()}</div>;
  }
}

export default Board;
