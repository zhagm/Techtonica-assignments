import React, { Component } from "react";
import "./Game.css";
import Board from "./Board.js";
import Word from "./Word.js";

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
      selectedCoords: [[0, 0]]
    };
  }
  coordsAreSame(a, b) {
    return a.toString() === b.toString();
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
          coordsAreSame={this.coordsAreSame}
        />
        <Word board={board} selectedCoords={selectedCoords} />
      </div>
    );
  }
}

export default Game;
