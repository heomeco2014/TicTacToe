import {useState} from 'react';

function Square({value, onSquareClick, highlighted}) {
	return (
		<button
			className='square'
			onClick={onSquareClick}
			style={{
				color: highlighted ? 'red' : '',
			}}>
			{value}
		</button>
	);
}

function Board({xIsNext, squares, onPlay}) {
	function handleClick(i) {
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = 'X';
		} else {
			nextSquares[i] = 'O';
		}
		onPlay(nextSquares);
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = 'Winner: ' + squares[winner[0]];
	} else if (squares.every(square => square !== null)) {
		status = 'Draw';
	} else {
		status = 'Next player: ' + (xIsNext ? 'X' : 'O');
	}

	function renderSquare(i) {
		const winningLine = calculateWinner(squares);
		const highlighted = winningLine && winningLine.includes(i);

		return <Square value={squares[i]} onSquareClick={() => handleClick(i)} highlighted={highlighted} />;
	}

	const boardRows = [];
	for (let row = 0; row < 3; row++) {
		const boardRow = [];
		for (let col = 0; col < 3; col++) {
			const squareIndex = row * 3 + col;
			boardRow.push(renderSquare(squareIndex));
		}
		boardRows.push(
			<div key={row} className='board-row'>
				{boardRow}
			</div>
		);
	}

	return (
		<div>
			<div className='status'>{status}</div>
			{boardRows}
		</div>
	);
}

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [isAscending, setIsAscending] = useState(true);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function toggleSortOrder() {
		setIsAscending(!isAscending);
	}

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}
	const sortedHistory = isAscending ? history : history.slice().reverse();

	const moves = sortedHistory.map((squares, move) => {
		let description;
		if (move > 0) {
			description = 'Go to move #' + move + ' at row ' + Math.floor((move - 1) / 3) + ' col  ' + ((move - 1) % 3) + "| Player's move: " + (move % 2 === 0 ? 'O' : 'X');
		} else {
			description = 'Go to game start';
		}
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	return (
		<div className='game'>
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className='game-info'>
				<div>
					<button onClick={toggleSortOrder}>Toggle Sort Order: {isAscending ? 'Ascending' : 'Descending'}</button>
				</div>
				<ol>
					{moves.sort(m => {
						if (!isAscending) {
							return -1;
						}
					})}
				</ol>
			</div>
		</div>
	);
}

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
			return lines[i];
		}
	}
	return null;
}
