var TURN_FIRST = 1;
var TURN_SECOND = 2;

function GameTicTac() {
    this.gameField = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];
    this.freeField = 9;
    this.playerFirstScore = 0;
    this.playerSecondScore = 0;
    this.turn = TURN_FIRST;
};

GameTicTac.prototype.newGame = function () {
    this.gameField = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];
    this.freeField = 9;
    this.playerFirstScore = 0;
    this.playerSecondScore = 0;
    this.turn = TURN_FIRST;
};

/**
 * Continue Game with collected score
 * @method continueGame
 * @param {Object} turnFirst only "First" or "Second", default turn First player
 * @return {Object} description
 */
GameTicTac.prototype.continueGame = function (turnFirst) {
    try {
        if (turnFirst !== TURN_FIRST || turnFirst !== TURN_SECOND) {
            if (turnFirst === undefined) {
                turnFirst = TURN_FIRST;
            } else {
                throw new Error('bad argument continueGame, takes only TURN_FIRST or TURN_SECOND or empty')
            }
        }


        this.gameField = [[0, 0, 0],
                          [0, 0, 0],
                          [0, 0, 0]];
        this.freeField = 9;
        this.turn = turnFirst;

    } catch (err) {
        console.log(err);
    }
}

/**
 * changeTurn change TURN_FIRST to TURN_SECOND and vice versa
 * @property changeTurn
 */
GameTicTac.prototype.changeTurn = function () {
    if (this.turn === TURN_FIRST) {
        this.turn = TURN_SECOND;
    } else {
        this.turn = TURN_FIRST;
    }
}

/**
 * Changes the number of free fields (-1)
 */
GameTicTac.prototype.changeFreeField = function () {
    this.freeField -= 1;
}

/**
 * check Victory, result>0 Victory - return winner, 0 - draw, -1 not end
 */
GameTicTac.prototype.checkVictory = function () {
    var result;
    var i;
    //Diagonal
    if (this.gameField[0][0] === this.gameField[1][1] &&
        this.gameField[0][0] === this.gameField[2][2] &&
        this.gameField[1][1] !== 0) {
        result = this.gameField[0][0];
    } else
    // Sub Diagonal
    if (this.gameField[2][0] === this.gameField[1][1] &&
        this.gameField[2][0] === this.gameField[0][2] &&
        this.gameField[1][1] !== 0) {
        result = this.gameField[2][0];
    } else {
        for (i = 0; i < 3; i++) {
            //columns and row
            if (this.gameField[i][0] === this.gameField[i][1] &&
                this.gameField[i][0] === this.gameField[i][2] &&
                this.gameField[i][0] !== 0) {
                result = this.gameField[i][0];
                break;
            }
            if (this.gameField[0][i] === this.gameField[1][i] &&
                this.gameField[0][i] === this.gameField[2][i] &&
                this.gameField[0][i] !== 0) {
                result = this.gameField[0][i];
                break;
            }
        }
    }
    if (result === undefined) {
        if (this.freeField === 0) {
            //draw
            result = 0;
        } else {
            result = -1;
        }
    }
    return result;
}


/**
 * Adds score to winner, win - 2 points, draw - 1 point
 * @param {TURN_FIRST || TURN_SECOND || 0} winner 0-draw
 */
GameTicTac.prototype.winScore = function(winner){
    if(winner === 0){
        this.playerFirstScore += 1;
        this.playerSecondScore += 1;
    }else if( winner === TURN_FIRST){
        this.playerFirstScore += 2;
    }else{
        this.playerSecondScore +=2;
    }
}

/**
 * attempt of Player Turn
 * @param {TURN_FIRST || TURN_SECOND} player number
 * @param {number} x      0<=x<=3 coordinate cell
 * @param {number} y      0<=y<=3 coordinate cell
 */
GameTicTac.prototype.playerTurn = function(player,x,y){
    var result; // 1 succesfull Turn
    if(this.gameField[y][x] === 0){
        this.gameField[y][x] = player;
        result = 1;
    }else{
        result = 0;
    }
}


function GameLayout (){
    this.menu =
}
