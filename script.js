//Game State and Game Board. Turn variable
let gameState = [];
let gameBoard = document.getElementById('game-board');
let currentTurn = "user";
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
let attackProbability;
let attackDisplay = document.createElement('h2')
attackDisplay.id = "attack-display"
//Array for line of sight, and to help probability
let lineOfSightArray = []

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
    for (let a = 2; a < 7; a++){
        gameState[a][4] = "wall";
        document.getElementById(`${a},${4}`).style.backgroundImage = "url('img/brick_wall.png')";
    }
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

//Function to handle collisions for user
let collision = (row, col) =>{
    if (gameState[row][col] === "alien") {
        return true
    } else if (gameState[row][col] === "wall") {
        return true
    } else {
        return false
    }
}

//Function to check if next to alien
// let nextToAlien = () => {
//     for (let i = -1; i <= 1; i++){
//         for (let j = -1; j<= 1; j++){
//             if(collision(userPositionRow + i, userPositionColumn + j)){
//                 return true
//             }
//         }
//     }
//     return false
// }

//Function to check if alien is within line of sight
//Implementation of Bresenham's line algo to check
let lineOfSight = (x0, y0, x1, y1) => {
    lineOfSightArray = [];
    //Getting deltas
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    //Setting which direction the line shall traverse
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    //Don't fully understand the math below. Based of Bresenham's algorithm for drawing lines between two points
    let err = (dx > dy ? dx : -dy) / 2; //Decision variable to adjust coordinates
    while (true) {
        lineOfSightArray.push(gameState[y0][x0]);
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
    console.log(lineOfSightArray)
    if (lineOfSightArray.includes("wall")){
        return false;
    }
    return true;
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
    currentTurn = "alien";
    alienAction()
}

//Function to move alien around
let moveAlien = () => {
    //Remove current alien display
    document.getElementById(`${alienPositionRow},${alienPositionColumn}`).style.backgroundImage = "";
    //While true loop, randomized direction
    while (true){
        let randomDirectionNumber = Math.floor((Math.random() * 4) + 1)
        //Direction Up
        if (randomDirectionNumber === 1 && alienPositionRow != 0 && gameState[alienPositionRow - 1][alienPositionColumn] === null){
            gameState[alienPositionRow - 1][alienPositionColumn] = "alien";
            gameState[alienPositionRow][alienPositionColumn] = null;
            alienPositionRow--;
            break;
        }
        //Direction Down
        else if (randomDirectionNumber === 2 && alienPositionRow != 9 && gameState[alienPositionRow + 1][alienPositionColumn] === null){
            gameState[alienPositionRow + 1][alienPositionColumn] = "alien";
            gameState[alienPositionRow][alienPositionColumn] = null;
            alienPositionRow++
            break
        }
        //Direction Left
        else if (randomDirectionNumber === 3 && alienPositionColumn != 0 && gameState[alienPositionRow][alienPositionColumn - 1] === null){
            gameState[alienPositionRow][alienPositionColumn - 1] = "alien";
            gameState[alienPositionRow][alienPositionColumn] = null;
            alienPositionColumn--;
            break
        }
        //Direction Right
        else if (randomDirectionNumber === 4 && alienPositionColumn != 9 ** gameState[alienPositionRow][alienPositionColumn + 1] === null) {
            gameState[alienPositionRow][alienPositionColumn + 1] = "alien";
            gameState[alienPositionRow][alienPositionColumn] = null;
            alienPositionColumn++;
            break
        }
        //Keep going until you get a direction
        else {
            continue;
        }
    }
    displayAlien()
}

//Function that lets alien shoot
let alienShoot = () => {
    let chance = Math.random() * 100
    message.classList.remove('hidden')
    attackButton.classList.add('hidden');
    let alienAttackProbability = 100 - (lineOfSightArray.length * 10);
    if (chance < alienAttackProbability){
        message.innerText = "The alien has shot you! Play again?";
        playAgainButton.classList.remove('hidden');
        attackButton.classList.add('hidden');
        return
    } else {
        message.innerText = "The alien missed! Keep going!"
    }
}

//Handle alien decision logic, post alien action possible shooting
let alienAction = () => {
    moveAlien();
    postAlienAction()
}

let postAlienAction = () => {
    currentTurn = "user";
    if (lineOfSight(userPositionColumn, userPositionRow, alienPositionColumn, alienPositionRow) && currentTurn === "user"){
        triggerHitDisplay();
    } else {
        hideHitDisplay();
    }
}

let triggerHitDisplay = () => {
    attackProbability = 100 - (lineOfSightArray.length * 10);
    attackDisplay.innerText = `Attack Probability: ${attackProbability}%`;
    headsUpDisplay.classList.remove('hidden');
    attackButton.classList.remove('hidden');
    headsUpDisplay.appendChild(attackDisplay);
}

let hideHitDisplay = () => {
    headsUpDisplay.classList.add('hidden');
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
    if (currentTurn === "user"){
        moveUser(currentMove);
    }
}
document.addEventListener("keydown", keyPress)

//Attack Button Functionality for User
let attemptHit = () => {
    let chance = Math.random() * 100
    message.classList.remove('hidden')
    if (chance < attackProbability){
        attackButton.classList.add('hidden');
        message.innerText = "Congratulations! Your hit was successful! Play again?";
        playAgainButton.classList.remove('hidden');
        return
    } else {
        message.innerText = "You missed :/ Try hitting again!"
    }
    currentTurn = "alien";
    alienAction();
}
attackButton.addEventListener("click", attemptHit)


//Reset Game Functionality - Both game board and game state
let resetGame = () => {
    removeCurrentDisplay();
    document.getElementById(`${alienPositionRow},${alienPositionColumn}`).style.backgroundImage = "";
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
    for (let a = 2; a < 7; a++){
        gameState[a][4] = "wall";
    }
    displayUser();
    displayAlien();
}
playAgainButton.addEventListener("click", resetGame)

//Start the Game, Display Initial User and Initial Alien
gameStart();
displayUser();
displayAlien();


//consider refactoring code logic to reflect turn based system more clearly
//if user turn, can move or attack if line of sight
//if alien turn, will move or attack if line of sight