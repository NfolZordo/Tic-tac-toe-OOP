'use strict';
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
    #twoPlayers;
    #usedState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    #winningStates = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    constructor(numberPlayers) {
        this.#twoPlayers = numberPlayers;
    }

    doStep(buttonValue) {
        const oldUsedState = this.#usedState;
        this.#usedState = [];
        oldUsedState.forEach(number => {
            if (number != buttonValue) {
                this.#usedState.push(number);
            }
        });
    }

    randomStep() {
        return this.#usedState[Math.floor(Math.random() * this.#usedState.length)];
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

    get gameEnd() {
        return this.#gameEnd;
    }

    get twoPlayers() {
        return this.#twoPlayers;
    }

    checkEnd() {
        if (this.#usedState.length === 0 & !this.#gameEnd) {
            this.#gameEnd = true;
            return true;
        }
        return false;
    }
}

class GameBoard {
    #disabledBloc = "disabled";
    #GameButton = "playing-field__button";
    #messageBloc = ".menu__message";
    #message = document.querySelector(this.#messageBloc);

    constructor() {
        document.querySelectorAll(`.${this.#GameButton}`).forEach(button => {
            button.className = this.#GameButton;
        })
    }

    doStep(buttonId, playerImg, nameNext) {
        const button = document.getElementById(buttonId.toString());
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

    gameEnd() {
        this.#message.textContent = "Нічія!";
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
    const twoPlayers = document.getElementById("solo-game1").checked;
    firstPlayer = new Player(firstPlayerName, whoFirst, "player-first-image");
    secondPlayer = new Player(secondPlayerName, !whoFirst, "player-second-image");
    gamePley = new GamePley(twoPlayers);
    gameBoard = new GameBoard();
    gameBoard.startGame(whoFirst ? firstPlayerName : secondPlayerName);
}

function getdetails(button) {
    if (gameBoard === undefined || button.classList.contains(gameBoard.disabledBloc)) {
        return;
    }

    const buttonId = Number(button.id);
    gamePley.doStep(buttonId);
    if (firstPlayer.turn) {
        firstPlayer.doStep(buttonId);
        secondPlayer.skipTurn();
        gameBoard.doStep(buttonId, firstPlayer.playerImg, secondPlayer.name);
        if (gamePley.checkWinner(firstPlayer.state)) {
            gameBoard.victory(firstPlayer.name);
        }
    } else if (gamePley.twoPlayers) {
        secondPlayer.doStep(buttonId);
        firstPlayer.skipTurn();
        gameBoard.doStep(buttonId, secondPlayer.playerImg, firstPlayer.name);
        if (gamePley.checkWinner(secondPlayer.state)) {
            gameBoard.victory(secondPlayer.name);
        }
    }

    if (gamePley.checkEnd()) {
        gameBoard.gameEnd();
    }

    if (!gamePley.twoPlayers & !gamePley.gameEnd) {
        const randomStep = gamePley.randomStep();
        gamePley.doStep(randomStep);
        secondPlayer.doStep(randomStep);
        firstPlayer.skipTurn();
        gameBoard.doStep(randomStep, secondPlayer.playerImg, firstPlayer.name);
        if (gamePley.checkWinner(secondPlayer.state)) {
            gameBoard.victory(secondPlayer.name);
        }
    }
}