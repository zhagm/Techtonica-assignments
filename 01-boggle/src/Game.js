import React, { Component } from "react";
import "./Game.css";
import Board from "./Board.js";
import { getWordScore, getNewBoard } from "./Utils.js";

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
      selectedCoords: [],
      points: 0
    };
  }
  coordsAreSame(a, b) {
    return a.toString() === b.toString();
  }
  modifySelectedCoords = arr => {
    this.setState({ selectedCoords: arr || [] });
  };
  getWordFromCoords(board, coordsArr) {
    return coordsArr.reduce((str, [x, y]) => {
      return str + board[x][y];
    }, "");
  }
  startNewGame = () => {
    let board = getNewBoard();
    this.setState({ board, selectedCoords: [], points: 0 });
  };
  resetSelection = () => {
    this.setState({ selectedCoords: [] });
  };
  submitWord(word) {
    this.resetSelection();
    console.log(`Word: ${word} is being submitted!`);
    let score = getWordScore(word);
    console.log("score: ", score);
    this.setState({ points: this.state.points + score });
  }
  render() {
    let { board, selectedCoords, points } = this.state;
    let word = this.getWordFromCoords(board, selectedCoords);
    return (
      <div className="container">
        <Board
          board={board}
          selectedCoords={selectedCoords}
          modifySelectedCoords={this.modifySelectedCoords}
          coordsAreSame={this.coordsAreSame}
        />
        <div className="container">
          <h1>{word}</h1>
        </div>
        <button onClick={() => this.submitWord(word)}>SUMBIT WORD</button>
        <div className="container">
          <h1>Points: {points}</h1>
        </div>
        <button onClick={() => this.startNewGame()}>START A NEW GAME</button>
      </div>
    );
  }
}

export default Game;
