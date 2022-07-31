'use strict';
// const game = {
//     xTurn: true,
//     playerFirstState: [],
//     playerSecondState: [],
//     playerFirstImg: "player-first-image",
//     playerSecondImg: "player-second-image",
//     disabledBloc: "disabled",
//     restartGameBloc: ".restart-game",
//     restartGameButton: ".restart-btn",
//     message: ".restart-game__text",
//     visibleBloc: "visible",
//     gameEnd: false,
//     winningStates: [
//         ['0', '1', '2'],
//         ['3', '4', '5'],
//         ['6', '7', '8'],
//         ['0', '3', '6'],
//         ['1', '4', '7'],
//         ['2', '5', '8'],
//         ['0', '4', '8'],
//         ['2', '4', '6']
//     ]
// }
class Player {
    #name;
    #turn;
    #playerImg;

    #state = [];
    constructor(name, turn, playerImg) {
        this.#name = name;
        this.#turn = turn;
        this.#playerImg = playerImg;
    }

    doStep(value) {
        this.#state.push(value);
        this.#turn = false;
    }

    skipTurn() {
        this.#turn = true;
    }

    get turn() {
        return this.#turn;
    }

    get state() {
        return this.#state;
    }

    get playerImg() {
        return this.#playerImg
    }

    get name() {
        return this.#name;
    }
}
class GamePley {
    #gameEnd = false;
    #madeSteps = 0;
    #winningStates = [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],
        ['0', '4', '8'],
        ['2', '4', '6']
    ];

    doStep() {
        this.#madeSteps++;
    }

    checkWinner(playerState) {
        let win = false;
        this.#winningStates.forEach(winningState => {
            const playerWins = winningState.every(state => playerState.includes(state));
            if (playerWins & !this.#gameEnd) {
                win = true;
            }
        });
        if (win) {
            this.#gameEnd = true;
            return true;
        }
        return false;
    }

    checkEnd() {
        if (this.#madeSteps === 9 & !this.#gameEnd) {
            return true;
        }
        return false;
    }
}

class GameBoard {
    #disabledBloc = "disabled";
    #restartGameBloc = ".restart-game";
    #GameButton = "playing-field__button";
    #messageBloc = ".menu__message";
    #visibleBloc = "visible";
    #message = document.querySelector(this.#messageBloc);

    constructor() {
        document.querySelectorAll(`.${this.#GameButton}`).forEach(button => {
            button.className = this.#GameButton;
        })
    }

    doStep(button, playerImg, nameNext) {
        button.classList.add(this.#disabledBloc);
        button.classList.add(playerImg);
        this.#message.textContent = `Хід ${nameNext}`;

    }

    victory(name) {
        this.#message.textContent = `${name} - Переміг`;
        document.querySelectorAll(`.${this.#GameButton}`).forEach(cell => cell.classList.add(this.#disabledBloc));
    }
    startGame(name) {
        this.#message.textContent = `Хід ${name}`;
    }

    get disabledBloc() {
        return this.#disabledBloc;
    }
}

let firstPlayer;
let secondPlayer;
let gamePley;
let gameBoard;

function startGame() {
    const firstPlayerName = document.getElementById("first-player-name").value;
    const secondPlayerName = document.getElementById("second-player-name").value;
    const whoFirst = document.getElementById("who-first1").checked;
    firstPlayer = new Player(firstPlayerName, whoFirst ? true : false, "player-first-image");
    secondPlayer = new Player(secondPlayerName, whoFirst ? false : true, "player-second-image");
    gamePley = new GamePley();
    gameBoard = new GameBoard();
    gameBoard.startGame(whoFirst ? firstPlayerName : secondPlayerName);
}

function getdetails(button) {
    if (button.classList.contains(gameBoard.disabledBloc)) {
        return;
    }

    const buttonValue = button.dataset.value
    gamePley.doStep();
    if (firstPlayer.turn) {
        firstPlayer.doStep(buttonValue);
        secondPlayer.skipTurn();
        gameBoard.doStep(button, firstPlayer.playerImg, secondPlayer.name);
        if (gamePley.checkWinner(firstPlayer.state)) {
            gameBoard.victory(firstPlayer.name);
        }
    } else {
        secondPlayer.doStep(buttonValue);
        firstPlayer.skipTurn();
        gameBoard.doStep(button, secondPlayer.playerImg, firstPlayer.name);
        if (gamePley.checkWinner(secondPlayer.state)) {
            gameBoard.victory(secondPlayer.name);
        }
    }
    gamePley.checkEnd();
}

//-------------------------------------------------------------------------------------------------------------------

function doStep(button) {
    const cellValue = button.dataset.value;
    if (!button.classList.contains(game.disabledBloc)) {
        button.classList.add(game.disabledBloc);
        if (game.xTurn) {
            button.classList.add(game.playerFirstImg);
            game.playerFirstState.push(cellValue);
            game.xTurn = false;
        } else {
            button.classList.add(game.playerSecondImg);
            game.playerSecondState.push(cellValue);
            game.xTurn = true;
        }
    }
}

function auditWins() {
    game.winningStates.forEach(winningState => {
        const playerFirstWins = winningState.every(state => game.playerFirstState.includes(state));
        const playerSecondWins = winningState.every(state => game.playerSecondState.includes(state));

        if (!playerFirstWins & !playerSecondWins) {
            return;
        }
        document.querySelector(game.restartGameBloc).classList.add(game.visibleBloc);
        document.querySelector(game.restartGameButton).classList.add(game.visibleBloc);
        game.gameEnd = true;
        document.querySelectorAll('.button').forEach(cell => cell.classList.add(game.disabledBloc));
        const restartGameText = document.querySelector(game.message);
        restartGameText.textContent = `${playerFirstWins ? game.playerFirstSymbol : game.playerSecondSymbol} - Переміг`;

    })
}

function auditEnd() {
    if (game.gameEnd) {
        return;
    }
    if (!document.querySelectorAll('.button:not(.disabled)').length) {
        const selectorRestartGame = document.querySelector(game.restartGameBloc);
        selectorRestartGame.classList.add(game.visibleBloc);
        selectorRestartGame.textContent = 'Нічія!';
    }
}

function resetGame() {
    document.querySelector(game.restartGameBloc).classList.remove(game.visibleBloc)
    document.querySelectorAll('.button').forEach(cell => {
        cell.classList.remove(game.disabledBloc, game.playerFirstImg, game.playerSecondImg)
    })
    game.xTurn = true
    game.gameEnd = false;
    game.playerFirstState = []
    game.playerSecondState = []
}
