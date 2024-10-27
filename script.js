const Gameboard = (function () {
    const board = Array(9).fill("");

    const winningMarkPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [0, 4, 8],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    const getBoard = () => board;

    const resetBoard = () => {
        board.fill("");
    }

    const placeMark = (position, mark) => {
        if (board[position] !== "") return false;

        board[position] = mark
        return true;
    }

    const printBoard = () => {
        let boardOutput = "";

        for (let i = 0; i < board.length; i++) {
            if (i % 3 === 0) {
                boardOutput += "\n"
            }
            boardOutput += `[${board[i] === "" ? " " : board[i]}]`;
        }

        console.log(boardOutput);
    }

    const getGameStatus = () => {
        for (let winningCombinationToTest of winningMarkPositions) {
            const [firstPosition, secondPosition, thirdPosition] = winningCombinationToTest;

            const boardContainsWinningCombination =
                board[firstPosition] !== "" &&
                board[firstPosition] === board[secondPosition] &&
                board[firstPosition] === board[thirdPosition];
            if (boardContainsWinningCombination) {
                return "winner";
            }
        }
        const isBoardFull = !board.includes("");
        return isBoardFull ? "draw" : "ongoing";
    }

    return {
        getBoard,
        placeMark,
        printBoard,
        getGameStatus,
        resetBoard
    }

})();

function Player(name, mark) {
    const getName = () => name;
    const getMark = () => mark;
    const setName = (newName) => {
        name = newName;
    }

    return { getName, getMark, setName };
}

const GameController = (function () {
    board = Gameboard;

    const player1 = Player("Player1", "X");
    const player2 = Player("Player2", "O");

    let activePlayer = player1;
    let gameState = "ongoing";

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const getGameState = () => {
        return gameState;
    }

    const playRound = (position) => {
        if (gameState !== "ongoing") {
            console.log("Game over - Start a new game to continue playing");
            return false;
        }

        const wasMovePerformed = board.placeMark(position, activePlayer.getMark());
        if (!wasMovePerformed) {
            console.log("Chosen field is not empty - please pick another one");
            return false;
        }

        console.log(
            `Placing ${getActivePlayer().getName()}'s mark into position ${position}...`
        );

        gameState = board.getGameStatus();
        
        if(gameState==="ongoing"){
            switchPlayerTurn();
        }
    }

    const newGame = (namePlayer1, namePlayer2) => {
        board.resetBoard();
        gameState = "ongoing";

        player1.setName(namePlayer1);
        player2.setName(namePlayer2);

        activePlayer = player1;
    }

    return {
        getActivePlayer,
        playRound,
        newGame,
        getGameState,
        getBoard: board.getBoard
    };

})();

(function ScreenController() {
    const game = GameController;

    const messageDiv = document.querySelector("#message");
    const boardDiv = document.querySelector("#board");
    const gameForm = document.querySelector("#game-form")

    const updateBoard = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const gameState = game.getGameState();

        if (gameState === "winner") {
            messageDiv.textContent = `${activePlayer.getName()} won the game`;
        } else if (gameState === "draw") {
            messageDiv.textContent = `It's a draw`;
        } else {
            messageDiv.textContent = `It's ${activePlayer.getName()}'s turn`;
        }

        board.forEach((cellValue, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.marker = cellValue;
            cellDiv.dataset.index = index;
            cellDiv.textContent = cellValue;
            boardDiv.appendChild(cellDiv);
        });
    }

    boardDiv.addEventListener("click", function (e) {
        const selectedCell = e.target.dataset.index;
        if (!selectedCell) return;

        game.playRound(selectedCell);
        updateBoard();
    });

    gameForm.addEventListener("submit", function(e){
        e.preventDefault();

        const playerNameFormData = new FormData(gameForm);

        const player1Name = playerNameFormData.get("player-one-name");
        const player2Name = playerNameFormData.get("player-two-name");

        game.newGame(player1Name, player2Name);
        updateBoard();
    });

    updateBoard();
})();
