/**
 * game
 * board
 * 2 players
 */

const game = (function () {
    const boardContainerId = 'board';
    const textContainerId = 'gameText';
    const emptySquare = null;
    const p1NameDefault = 'Player 1';
    const p2NameDefault = 'Player 2';

    const getRandomEmoji = (toExclude = []) => {
        const emojis = ['🔪', '🩸', '🧛', '🔥', '💀', '🦴', '👿', '🖤', '🐈‍⬛', '🦇', '🕷️', '🕸️', '🎃', '🧟']
        const allowedEmojis = emojis.filter(x => !toExclude.includes(x));

        return allowedEmojis[Math.floor(Math.random() * allowedEmojis.length)];
    }

    let pieceX = getRandomEmoji();
    let pieceO = getRandomEmoji([pieceX]);

    const board = (function () {
        const squares = new Array(9).fill(emptySquare);

        const setSquare = function (sqIndex, p) {
            squares[sqIndex] = p;
        }

        const testWinner = function (p) {
            if ((squares[0] === p && squares[1] === p && squares[2] === p)
                || (squares[3] === p && squares[4] === p && squares[5] === p)
                || (squares[6] === p && squares[7] === p && squares[8] === p)
                || (squares[0] === p && squares[3] === p && squares[6] === p)
                || (squares[1] === p && squares[4] === p && squares[7] === p)
                || (squares[2] === p && squares[5] === p && squares[8] === p)
                || (squares[0] === p && squares[4] === p && squares[8] === p)
                || (squares[2] === p && squares[4] === p && squares[6] === p)) {
                return true;
            }

            return false;
        }

        const reset = function () {
            squares.fill(emptySquare);
        }

        return { squares, setSquare, testWinner, reset };
    })();

    const createPlayer = function(name) {
        let p;
    
        return { name, p };
    };

    const p1 = createPlayer(p1NameDefault);
    const p2 = createPlayer(p2NameDefault);

    let first;
    let currPlayer;
    let isStarted = false;
    let isPlaying = false;

    const setFirst = (player) => {
        first = player;
        currPlayer = player;
        
        if (player === p1) {
            p1.p = pieceX;
            p2.p = pieceO;
        } else {
            p1.p = pieceO;
            p2.p = pieceX;
        }
    };

    const start = (p1Name, p2Name) => {
        // set player names
        p1.name = p1Name;
        p2.name = p2Name;

        // reset board
        board.reset();
        displayController.renderBoard();

        // coin flip to decide who starts
        if (Math.floor(Math.random() * 2) == 0) {
            setFirst(p1);
        } else {
            setFirst(p2);
        }

        displayController.setText(`${currPlayer.name} goes first!`);

        isStarted = true;
        isPlaying = true;
        displayController.setIsPlaying();
    };

    const reset = () => {
        // new pieces
        pieceX = getRandomEmoji();
        pieceO = getRandomEmoji([pieceX]);

        // reset board
        board.reset();
        displayController.renderBoard();

        // switch who goes first
        if (first === p1) {
            setFirst(p2);
        } else {
            setFirst(p1);
        }

        displayController.setText(`${currPlayer.name} goes first!`);

        isPlaying = true;
        displayController.setIsPlaying();
    };

    const play = (sqIndex) => {
        if (!isPlaying) {
            return;
        }

        // assign piece
        if (board.squares[sqIndex] !== emptySquare) {
            displayController.setText('Can\'t go here!');
            return;
        }

        board.setSquare(sqIndex, currPlayer.p);
        displayController.setSquare(sqIndex, currPlayer.p);

        // check for a winner
        const isWinner = board.testWinner(currPlayer.p);

        if (isWinner) {
            displayController.setText(`${currPlayer.name} wins!`);

            isPlaying = false;
            displayController.setIsPlaying();
        } else {
            // no winner, change turns
            currPlayer = (currPlayer === p1 ? p2 : p1);
            displayController.setText(`${currPlayer.name}'s turn!`);
        }
    };

    const displayController = (function () {
        const renderBoard = () => {
            const boardContainer = document.getElementById(boardContainerId);
            boardContainer.replaceChildren();

            for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
                const boardRow = document.createElement('div');
                boardRow.classList.add('flex');

                for (let sqOffset = 0; sqOffset < 3; sqOffset++) {
                    const boardSq = document.createElement('div');
                    boardSq.classList.add('square');
                    boardSq.dataset.sqIndex = (rowOffset * 3) + sqOffset;

                    // handle click event
                    boardSq.onclick = function () {
                        play(this.dataset.sqIndex);
                    };

                    boardRow.appendChild(boardSq);
                }

                boardContainer.appendChild(boardRow);
            }
        };

        const setText = (text) => {
            const textContainer = document.getElementById(textContainerId);
            textContainer.textContent = text; 
        };

        const setSquare = (sqIndex, p) => {
            const boardSq = document.querySelector(`[data-sq-index="${sqIndex}"]`);
            boardSq.textContent = p;
        }

        const setIsPlaying = () => {
            const boardContainer = document.getElementById(boardContainerId);
            if (isPlaying) {
                boardContainer.classList.add('is-playing');
            } else {
                boardContainer.classList.remove('is-playing');
            }
        };

        return { renderBoard, setText, setSquare, setIsPlaying };
    })();

    const addEventListeners = () => {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.onclick = function () {
            const p1NameInput = document.getElementById('p1Name');
            const p2NameInput = document.getElementById('p2Name');

            start(p1NameInput.value, p2NameInput.value);
        };

        resetBtn.onclick = function () {
            if (isStarted) {
                reset();
            }
        };
    };

    return { start, play, addEventListeners };
})();

window.onload = function () {
    game.addEventListeners();
}