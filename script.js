


// game module
let game = (function(){
    let gameboard = [];
    let turnCount = 0;
    function resetBoard(){
        turnCount = 0;
        gameboard = [];
        for(let i=0; i<3; i++){
            let row = [];
            for(let j=0; j<3; j++){
                row.push(`${i},${j}`);
            }
            gameboard.push(row);
        }
    }

    resetBoard();

    function updatePosition(row,col,mark){
        gameboard[row][col] = mark;
    }

    function showBoard(){
        return gameboard;
    }

    function checkWin(){
        for(let i=0; i<3; i++){
            // row win
            if(gameboard[i][0]===gameboard[i][1] && gameboard[i][1]===gameboard[i][2]){
                return gameboard[i][0];
            }

            // col win
            if(gameboard[0][i] === gameboard[1][i] && gameboard[1][i] === gameboard[2][i]){
                return gameboard[0][i];
            }
        }
        // diag win
        if(gameboard[0][0] === gameboard[1][1] && gameboard[1][1] === gameboard[2][2]){
            return gameboard[0][0];
        }

        // off diag win
        if(gameboard[0][2] === gameboard[1][1] && gameboard[1][1] === gameboard[2][0]){
            return gameboard[0][2];
        }

        if(turnCount >= 8){
            return 'tie';
        }

        // return falsy if no win;
    }

    return {updatePosition, resetBoard, showBoard, checkWin, turnCount};

})();

// person factory
const Player = (name, marker, isFirst) => {
    function makesMove(row, col){
        game.updatePosition(row, col, marker);
    }
    
    let details = () => `${name}, marked with: ${marker} ` + (isFirst? "goes first": "goes second");

    return {makesMove, details, isFirst, marker};
};

// for now we will have dummy players
let player1 = Player('Player1','X',true);
let player2 = Player('Player2','O',false);

// let us extract the useful elements
const playerDetailsHtml = document.querySelector("#player-details");
const boardHtml = document.querySelector('#board');
const whoseTurnHtml = document.querySelector('#whose-turn');
const resetBtnHtml = document.querySelector('#reset-btn');
const announceHtml = document.querySelector('#announce');

// let us inject the html code for the board
function boardInit(){

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            let square = document.createElement('button');
            square.classList.add('square');
            square.setAttribute('id',`${i}-${j}`);
            boardHtml.appendChild(square);
        }
    }
} boardInit();



const p1 = document.createElement('p');
const p2 = document.createElement('p');
p1.textContent = player1.details();
p2.textContent = player2.details();
playerDetailsHtml.appendChild(p1);
playerDetailsHtml.appendChild(p2);

function updatingBoard(e,player){
    console.log(e);
    let [row, col] = e.target.id.split('-');
    [row, col] = [parseInt(row), parseInt(col)];
    game.updatePosition(row, col, player.marker);
    e.target.textContent = player.marker;
    game.turnCount++;

    let verdict = game.checkWin();
    if(verdict === 'tie'){
        announceHtml.textContent = 'tie!';
        boardHtml.innerHTML = boardHtml.innerHTML;

    } else if (verdict) {
        announceHtml.textContent = `${verdict} wins!`;
        boardHtml.innerHTML = boardHtml.innerHTML;

    }
}

function addSquareEvents(){
    const squaresHtml = document.querySelectorAll('.square');
    squaresHtml.forEach((e) => {
        e.addEventListener('click', (ee) => {
            console.log(game.turnCount);
            if(!(game.turnCount%2) === player1.isFirst) return updatingBoard(ee,player1);
            else return updatingBoard(ee,player2);
        });
    });
} addSquareEvents();


function resetAll(){
    while(boardHtml.firstChild){
        boardHtml.removeChild(boardHtml.lastChild);
    }
    game.resetBoard();
    game.turnCount = 0;
    boardInit();
    addSquareEvents();
    announceHtml.textContent = null;
}

resetBtnHtml.addEventListener('click',resetAll);
