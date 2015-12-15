var TURN_FIRST = 1;
var TURN_SECOND = 2;
var STATE_GAME = 0;
var STATE_END_GAME = 1;
var NETWORK_STAUS = ['first-player-wins','second-player-wins','tie'];
var NETWORK_FIRST_TURN = 'first-player-turn';
var NETWORK_SECOND_TURN = 'second-player-turn';
function GameTicTac() {
    this.gameField = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];
    this.freeField = 9;
    this.playerFirstScore = 0;
    this.playerSecondScore = 0;
    this.state = STATE_GAME;
    this.turn = TURN_FIRST;
    this.networkMode= false;
    this.networkState = '';
    this.networkToken = '';
    this.networkPlayer = 1;
    this.networkPlayerStatus = '';
};

GameTicTac.prototype.newGame = function () {
    this.gameField = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0]];
    this.freeField = 9;
    this.playerFirstScore = 0;
    this.playerSecondScore = 0;
    this.state = STATE_GAME;
    this.turn = TURN_FIRST;
    this.networkMode = false;
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
        this.state = STATE_GAME;
        this.turn = turnFirst;
        this.networkMode = false;

    } catch (err) {
        console.log(err);
    }
};

/**
 * changeTurn change TURN_FIRST to TURN_SECOND and vice versa, and changeFreeField()
 * @property changeTurn
 */
GameTicTac.prototype.changeTurn = function () {
    if (this.turn === TURN_FIRST) {
        this.turn = TURN_SECOND;
    } else {
        this.turn = TURN_FIRST;
    }

};

/**
 * Changes the number of free fields (-1)
 */
GameTicTac.prototype.changeFreeField = function () {
    this.freeField -= 1;
};

/**
 * check Victory, result>0 Victory - return winner, 0 - draw, -1 not end
 */
GameTicTac.prototype.checkVictory = function () {
    var result;
    var i;
    this.changeFreeField();
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
    console.log(result);
    return result;
};


/**
 * Adds score to winner, win - 2 points, draw - 1 point
 * @param {TURN_FIRST || TURN_SECOND || 0} winner 0-draw
 */
GameTicTac.prototype.winScore = function (winner) {
    if (winner === 0) {
        this.playerFirstScore += 1;
        this.playerSecondScore += 1;
    } else if (winner === TURN_FIRST) {
        this.playerFirstScore += 2;
    } else {
        this.playerSecondScore += 2;
    }
};

/**
 * attempt of Player Turn
 * @param {TURN_FIRST || TURN_SECOND} player number
 * @param {number} x      0<=x<=3 coordinate cell
 * @param {number} y      0<=y<=3 coordinate cell
 */
GameTicTac.prototype.playerTurn = function (x, y) {

    var result; // 1 succesfull Turn
    if (this.gameField[y][x] === 0 && this.state === STATE_GAME) {
        this.gameField[y][x] = this.turn;
        result = 1;
    } else {
        result = 0;
    }
    return result;
};

/**
 * Description for gameTurn
 * @private
 * @method gameTurn
 * @param {Object} x
 * @param {Object} y
 * @return {Number} 1 - successful, 0 - no change, 2 - end game
 */
GameTicTac.prototype.gameTurn = function (x, y) {
    var result;
    var chekVictory;
    if(this.networkMode ){
        return this.networkMakeTurn(y*3+parseInt(x));
    }else {
        if (this.playerTurn(x, y) > 0) {
            result = 1;
            chekVictory = this.checkVictory();
            if (chekVictory < 0) {
                //  game not ending
                this.changeTurn();
            } else {
                // game end
                result = 2;
                console.log('end game');
                this.state = STATE_END_GAME;
                this.winScore(chekVictory);
            }
        } else {
            result = 0;
        }
    }
};

/**
 * Aplly new Status Object for local game data
 * @param data Game Status Object
 */
GameTicTac.prototype.networkParseAndApply = function(data){
    console.log(data);
    var count = 0;
    var field;
    if(data.state){
        this.networkState = data.state;
    };
    if(data.state === NETWORK_FIRST_TURN){
        this.turn = TURN_FIRST;
    } else if(data.state === NETWORK_SECOND_TURN){
        this.turn = TURN_SECOND;
    }

    if(data.token){
        this.networkToken = data.token;
    };
    if(data.field2){
        count = 0;
        field = data.field2;
        while(field !== 0){
            if(field & 1){
                this.gameField[Math.floor(count / 3)][count % 3] = TURN_SECOND;
            };
            count++;
            field = field >> 1;
        };
    };
    if(data.field1){
        count = 0;
        field = data.field1;
        while(field !== 0){
            if(field & 1){
                this.gameField[Math.floor(count / 3)][count % 3] = TURN_FIRST;
            };
            count++;
            field = field >> 1;
        };
    };

};
/**
 * POST request, create a new game
 * @param type
 * @param password
 */
GameTicTac.prototype.networkNewGame = function(type,password){
    this.networkPlayer = 1;
    this.networkMode = true;
    return $.ajax({
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Accept","application/json");
        },
        url: "http://aqueous-ocean-2864.herokuapp.com/games/",
        method: "POST",
        data:JSON.stringify({
            "type":type,
            "password":password
        }),
        dataType : "json",
        context:this
    }).done(function(json){
        this.networkParseAndApply(json);
        this.networkPlayerStatus = NETWORK_FIRST_TURN;
        this.state = STATE_GAME;
    }).fail(function(error){
        console.log("networkNewGame",error);
    });
};
/**
 * get game status
 * @param token Game
 */
GameTicTac.prototype.networkGetGame = function() {
    return $.ajax({
        url: "http://aqueous-ocean-2864.herokuapp.com/games/"+this.networkToken,
        method: "GET",
        context:this,
        dataType : "json"
    }).done(function(json){
        if(json != null) {
            this.networkParseAndApply(json);

        }else{
            this.networkToken = 'Bad Token';
        }

    });
};

GameTicTac.prototype.networkJoinGame = function (token) {
    this.networkToken = token;
    this.networkMode = true;
    this.networkPlayerStatus = NETWORK_SECOND_TURN;
    this.networkPlayer = 2;
    this.turn = TURN_SECOND;
    return this.networkWaitTurn();

};


/**
 * make a turn
 * @param position
 * @returns {*}
 */
GameTicTac.prototype.networkMakeTurn = function (position) {
    return $.ajax({
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Accept","application/json");
        },
        url: "http://aqueous-ocean-2864.herokuapp.com/games/"+this.networkToken,
        method: "PUT",
        data:JSON.stringify({
            "player":this.networkPlayer,
            "position":position
        }),
        dataType : "json",
        context:this
    }).done(function(json){
       /* var data;
        console.log(json);
        data = $.parseJSON(json);*/
        this.networkParseAndApply(json);


    }).fail(function(error){
        console.log("networkMakeTurn",error);
    });
};

/**
 *  Wait for move of the second player
 * @returns {Promise} resolve after turn of the second player
 */
GameTicTac.prototype.networkWaitTurn = function(){
    var context = this;
    return new Promise(function(resolve,reject){
        context.recursive = function(con) {
            $.ajax({
                    url: "http://aqueous-ocean-2864.herokuapp.com/games/" + con.networkToken,
                method: "GET",
                context: con,
                dataType: "json"
            }).done(function (json) {
                var self = this;
                if (this.networkPlayerStatus === json.state) {
                    //next turn
                    this.networkParseAndApply(json);
                    resolve('complete');
                } else if(NETWORK_STAUS.indexOf(json.state)>=0){
                    //end game
                    this.networkParseAndApply(json);
                    this.state = STATE_END_GAME;
                    resolve('complete');
                } else {
                    //wait second player
                    if(json !== null) {
                        setTimeout(
                            function (self) {
                                self.recursive(self);
                            }, 2000, self);
                    }else{
                        console.log ('bad game token');
                    }
                }
            });
        };
        context.recursive(context);
    });
};



function GameLayout(gameTicTac) {
    this.game = gameTicTac;
    this.newGame = $('.top-menu__new-game');
    this.mode = $('.top-menu__mode');
    this.playerFirstScoreboard = $('.scoreboard__player1');
    this.playerSecondScoreboard = $('.scoreboard__player2');
    this.playerFirstScore = $('#playerFirstScore');
    this.playerSecondScore = $('#playerSecondScore');
    this.turn = 'X';
    // y=Math.floor(index/3) x=index%3
    this.gameField = function (x, y) {
        return $('.game__cell')[3 * y + x];
    }
}


/**
 * Render Game in layout
 */
GameLayout.prototype.render = function () {

    var fillTic = 'X';
    var fillTac = 'O';
    var i, j;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (this.game.gameField[i][j] === TURN_FIRST) {
                $(this.gameField(j, i)).text(fillTic);
            } else if (this.game.gameField[i][j] === TURN_SECOND) {
                $(this.gameField(j, i)).text(fillTac);
            } else {
                $(this.gameField(j, i)).text('');
            }
        }
    }

    if (this.game.turn === TURN_FIRST) {
        this.playerFirstScoreboard.addClass('scoreboard__hightlight');
        this.playerSecondScoreboard.removeClass('scoreboard__hightlight');
    } else {
        this.playerSecondScoreboard.addClass('scoreboard__hightlight');
        this.playerFirstScoreboard.removeClass('scoreboard__hightlight');
    }

    this.playerFirstScore.text(this.game.playerFirstScore);
    this.playerSecondScore.text(this.game.playerSecondScore);
    if(this.game.networkMode){
        $('#token-game').text(this.game.networkToken);
    }else{
        $('#token-game').text('Local Game');
    }
    if (this.game.state === STATE_END_GAME) {
        $('#game-over-dialog').modal('show');
    }
};

$(function () {
    var game = new GameTicTac();
    var layout = new GameLayout(game);
    layout.newGame.on('click', function () {
        game.newGame();
        layout.render();
    });

    $('.game__cell').each(function () {
        $(this).on('click', function () {
            if(game.networkMode){
                if(game.state !== STATE_END_GAME) {
                    game.gameTurn($(this).index() % 3, Math.floor($(this).index() / 3)).then(function () {
                        $("#game-xhr-progress").removeClass('fade');
                        layout.render();
                        game.networkWaitTurn().then(function () {
                            $("#game-xhr-progress").addClass('fade');
                            layout.render();
                        })
                    });
                }else{
                    layout.render();
                }
            }else {
                game.gameTurn($(this).index() % 3, Math.floor($(this).index() / 3));
                layout.render();
            }
        });
    });
    $("#new-game-btn").on('click', function () {
        $('#game-over-dialog').modal('hide');
        game.newGame();
        layout.render();

    });
    $("#navbar-new-game").on('click', function () {
        $('#game-over-dialog').modal('hide');
        game.newGame();
        layout.render();

    });
    $("#continue-btn").on('click', function () {
        $('#game-over-dialog').modal('hide');
        game.continueGame();
        layout.render();

    });
    $("#create-Game").on('click', function (e) {
        e.preventDefault();
        $("#game-xhr-progress").removeClass('fade');
        game.networkNewGame(0,'abc').then(function () {
            $("#game-xhr-progress").addClass('fade');
            layout.render();
        });
    });
    $("#join-Game").on('click', function (e) {
        e.preventDefault();
        $('#game-join-dialog').modal('show');
    });

    $("#join-game-button").on('click', function (e) {
        game.continueGame();
        $("#game-xhr-progress").removeClass('fade');
        $('#game-join-dialog').modal('hide');
        game.networkJoinGame($('#join-game-token').val()).then(function(){
            $("#game-xhr-progress").addClass('fade');
           layout.render();
        });
    });
});
