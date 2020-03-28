//Game State and Game Board
let gameState = [];
let gameBoard = document.getElementById('game-board');
//User and Alien Coordinates
let userPositionRow = 0;
let userPositionColumn = 0;
let alienPositionRow = 8;
let alienPositionColumn = 8;
//Getting DOM elements - attack button, play again button, message display, heads up display
let attackButton = document.getElementById('attack-button');
let playAgainButton = document.getElementById('play-again-button')
let message = document.getElementById('message')
let headsUpDisplay = document.getElementById('heads-up-display')
//DOM element to display attack probability
let attackProbability = "50%"
let attackDisplay = document.createElement('h2')
attackDisplay.id = "attack-display"
attackDisplay.innerText = `Attack Probability: ${attackProbability}`

//Generating initial game board and game state. Setting user's initial position in game state. Setting alien initial position
let gameStart = () => {
    for (let i = 0; i < 10; i++){
        let gameStateRow = [];
        gameState.push(gameStateRow);
        for (let k = 0; k < 10; k++){
            let gridItem = document.createElement('div');
            gridItem.className = "grid-item";
            gridItem.id = i + "," + k;
            gameBoard.appendChild(gridItem);
            gameStateRow.push(null);
        }
    }
    gameState[0][0] = "user";
    gameState[8][8] = "alien"
}

//Display User
let displayUser = () => {
    let gameBoardPosition = document.getElementById(`${userPositionRow},${userPositionColumn}`)
    gameBoardPosition.style.backgroundImage = "url('img/soldier_face_right.png')"
}

//Remove User's current position
let removeCurrentDisplay = () => document.getElementById(`${userPositionRow},${userPositionColumn}`).style.backgroundImage = "";

//Display Alien
let displayAlien = () => {
    let gameBoardPosition = document.getElementById(`${alienPositionRow},${alienPositionColumn}`)
    gameBoardPosition.style.backgroundImage = "url('img/alien_idle_face_right.png')"
}

//Function to handle collisions
let collision = (row, col) =>{
    if (row === alienPositionRow && col === alienPositionColumn) {
        return true
    } else {
        return false
    }
}

//Function to check if next to alien
let nextToAlien = () => {
    for (let i = -1; i <= 1; i++){
        for (let j = -1; j<= 1; j++){
            if(collision(userPositionRow + i, userPositionColumn + j)){
                return true
            }
        }
    }
    return false
}

//Function to check if alien is within line of sight
//Implementation of Bresenham's line algo to check
let lineOfSight = (x0, y0, x1, y1) => {
    let squareArray = [];
    //Getting deltas
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    //Setting which direction the line shall traverse
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    //Don't fully understand the math below. Based of Bresenham's algorithm for drawing lines between two points
    let err = (dx > dy ? dx : -dy) / 2; //Decision variable to adjust coordinates
    while (true) {
        squareArray.push(gameState[x0][y0]);
        if (x0 === x1 && y0 === y1) {
            break;
        }
        if (err > -dx) {
            err -= dy;
            x0 += sx;
        }
        if (x0 === x1 && y0 === y1) {
            break;
        }
        if (err < dy) {
            err += dx;
            y0 += sy;
        }
        if (x0 === x1 && y0 === y1) {
            break;
        }
    }
    console.log(squareArray)
    //if any of the squares are opaque, return false
    //return true
}

//Function to move user around DOM, update game state
let moveUser = direction => {
    switch(direction){
        case "left":
            if (userPositionColumn === 0 || collision(userPositionRow, userPositionColumn - 1)) {
                break
            }
            removeCurrentDisplay();
            gameState[userPositionRow][userPositionColumn - 1] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionColumn--
            displayUser()
            break;
        case "up":
            if (userPositionRow === 0  || collision(userPositionRow - 1, userPositionColumn)) {
                break
            }
            removeCurrentDisplay();
            gameState[userPositionRow - 1][userPositionColumn ] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionRow--
            displayUser()
            break;
        case "down":
            if (userPositionRow === 9  || collision(userPositionRow + 1, userPositionColumn)) {
                break
            }
            removeCurrentDisplay();
            gameState[userPositionRow + 1][userPositionColumn ] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionRow++
            displayUser()
            break;
        case "right":
            if (userPositionColumn === 9  || collision(userPositionRow, userPositionColumn + 1)) {
                break
            }
            removeCurrentDisplay();
            gameState[userPositionRow][userPositionColumn + 1] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionColumn++
            displayUser()
            break;
        default:
            console.log("something went wrong in moving")
    }
    console.log('column: ' + userPositionColumn)
    console.log('row: ' + userPositionRow)
    if (nextToAlien() || lineOfSight(userPositionColumn, userPositionRow, alienPositionColumn, alienPositionRow)){
        //Making Heads Up Display and attack button appear
        headsUpDisplay.classList.remove('hidden')
        attackButton.classList.remove('hidden')
        headsUpDisplay.appendChild(attackDisplay)
    } else {
        attackButton.classList.add('hidden')
        headsUpDisplay.classList.add('hidden')
    }
}

//Event listener to listen capture current move, arrow keys
let currentMove;
let keyPress = event => {
    switch(event.which){
        case 37:
            currentMove = "left";
            break;
        case 38:
            currentMove = "up";
            break;
        case 39:
            currentMove = "right";
            break;
        case 40:
            currentMove = "down";
            break;
        default:
            currentMove = "input wrong"
    }
    moveUser(currentMove);
}
document.addEventListener("keydown", keyPress)

//Attack Button Functionality
let attemptHit = () => {
    let chance = Math.random()
    message.classList.remove('hidden')
    if (chance < 0.5){
        message.innerText = "Congratulations! Your hit was successful! Play again?"
        attackButton.classList.add('hidden')
        playAgainButton.classList.remove('hidden')
    } else {
        message.innerText = "You missed :/ Try hitting again!"
    }
}
attackButton.addEventListener("click", attemptHit)


//Reset Game Functionality - Both game board and game state
let resetGame = () => {
    removeCurrentDisplay();
    message.classList.add('hidden')
    playAgainButton.classList.add('hidden')
    headsUpDisplay.classList.add('hidden')
    gameState = [];
    for (let i = 0; i < 10; i++){
        let gameStateRow = [];
        gameState.push(gameStateRow);
        for (let k = 0; k < 10; k++){
            gameStateRow.push(null);
        }
    }
    gameState[0][0] = "user";
    gameState[8][8] = "alien"
    userPositionRow = 0;
    userPositionColumn = 0;
    alienPositionRow = 8;
    alienPositionColumn = 8;

    displayUser();
    displayAlien();
}
playAgainButton.addEventListener("click", resetGame)

//Start the Game, Display Initial User and Initial Alien
gameStart();
displayUser();
displayAlien();