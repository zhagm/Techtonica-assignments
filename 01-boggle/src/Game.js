import React, { Component } from "react";
import "./Game.css";
import Board from "./Board.js";

class Game extends Component {
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
            {row.map((tile, y) => (
              <span
                key={`col${y}`}
                className={`flex-item board-tile ${
                  coords.includes(`${x}${y}`) ? "selected" : ""
                }`}
                onClick={this.tileSelected}
              >
                {tile}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }
  modifySelectedCoords = arr => {
    this.setState({ selectedCoords: arr || [] });
  };
  render() {
    let { board, selectedCoords } = this.state;
    return (
      <div className="container">
        <Board
          board={board}
          selectedCoords={selectedCoords}
          modifySelectedCoords={this.modifySelectedCoords}
        />
      </div>
    );
  }
}

export default Game;
