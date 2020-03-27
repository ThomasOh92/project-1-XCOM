let gameState = [];
let gameBoard = document.getElementById('game-board');
let userPositionRow = 0;
let userPositionColumn = 0;

//Generating initial game board and game state. Setting user's initial position in game state
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

//Display User
let displayUser = () => {
    let gameBoardPosition = document.getElementById(`${userPositionRow},${userPositionColumn}`)
    gameBoardPosition.style.backgroundImage = "url('img/soldier_face_right.png')"
}
displayUser();

//Remove User's current position
let removeCurrentDisplay = () =>{
    document.getElementById(`${userPositionRow},${userPositionColumn}`).style.backgroundImage = "";
}

//Function to move user around DOM, update game state
let moveUser = direction => {
    switch(direction){
        case "left":
            removeCurrentDisplay();
            gameState[userPositionRow][userPositionColumn - 1] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionColumn--
            displayUser()
            break;
        case "up":
            removeCurrentDisplay();
            gameState[userPositionRow - 1][userPositionColumn ] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionRow--
            displayUser()
            break;
        case "down":
            removeCurrentDisplay();
            gameState[userPositionRow + 1][userPositionColumn ] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionRow++
            displayUser()
            break;
        case "right":
            removeCurrentDisplay();
            gameState[userPositionRow][userPositionColumn + 1] = "user";
            gameState[userPositionRow][userPositionColumn] = null;
            userPositionColumn++
            displayUser()
            break;
        default:
            //
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


//Display Alien