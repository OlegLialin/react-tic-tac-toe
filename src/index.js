import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import './index.css'

const useStyles = makeStyles({
  square: {
    background: '#fff',
    border: '1px solid #999',
    borderRadius: 0,
    float: 'left',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: '34px',
    height: '60px',
    width: '60px',
    minWidth: 0,
    marginRight: -1,
    marginTop: -1,
    padding: 0,
    textAlign: 'center'
  }
});

const lightYellow = "#FFFFC9";
const lightGreen = "#C5FFEA";
const fullBlue = "#2DF8F5";
const fullPink = "#FB98FE";
const fullGreen = "#6DFECA";

function Square(props) {
  const classes = useStyles();
    return (
        <Button className={classes.square} onClick={props.onClick} style={props.style}>
            {props.value}
        </Button>
    );
}

function Header() {
    return (
        <div className="header">
            <h1>Tic Tac Toe</h1>
            <h3>You know the game. Click one of the cells to start!</h3>
        </div>
    );
}

class Board extends React.Component {
    renderSquare(i, line) {
        const wLine = this.props.winningLine != null ?
            this.props.winningLine.includes(i) ?
                {backgroundColor: lightYellow} :
                {} : {};
        const markColor = this.props.squares[i] != null ?
            this.props.squares[i] === "X" ?
                {color: fullBlue} :
                {color: fullPink} : {};
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                style={{...wLine, ...markColor}}
            />
        );
    }
    createSquares() {
        let rows = [];
        for (let r = 0; r < 3; r++) {
            let squares = [];
            for (let c = 0; c < 3; c++) {
                squares.push(this.renderSquare(3*r + c));
            }
            rows.push(<div className="board-row flex-row">{squares}</div>);
        }
        return rows;
    }
    render() {
        return (
            <div className="board-container">
                {this.createSquares()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                movesMade: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            maxSteps: 9,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = [...current.squares];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
  
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winner : null;
        const winningLine = calculateWinner(current.squares) ? calculateWinner(current.squares).winningLine : null;

        const moves = history.map( (step, move) => {
            const desc = move ?
                "Go to move #" + move :
                "Go to game start";
            const coordString = history[move].movesMade != null ?
                " - " + history[move].movesMade :
                "";
            const boldStep = move === this.state.stepNumber ?
                {border: "3px solid " + fullGreen , backgroundColor: lightGreen}:
                {};
            return (
                <li className="list-item" key={move}>
                    <Button
                        variant="contained"
                        className="list-item-btn"
                        onClick={() => this.jumpTo(move)}
                        style={boldStep}
                    >
                        {desc}{coordString}
                    </Button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else if (!winner && this.state.stepNumber < this.state.maxSteps){
            status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
        } else {
            status = "Draw!";
        }

        return (
            <div className="main">
                <div className="header-row flex-row">
                    <Header />
                </div>
                <div className="game flex-row">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            winningLine={winningLine}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div className="status">{status}</div>
                        <ol className="list">{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      let winningLine = lines[i];
      return {
          winner: squares[a],
          winningLine: winningLine,
      };
    }
  }
  return null;
}