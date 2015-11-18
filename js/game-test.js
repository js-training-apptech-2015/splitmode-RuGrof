QUnit.test("Victory test", function (assert) {
    var tempGame = new GameTicTac();
    tempGame.gameField = [[1, 0, 0],
                          [0, 1, 0],
                          [0, 0, 1]];
    assert.strictEqual(tempGame.checkVictory(), 1, "Diagonal");
    tempGame.gameField = [[0, 0, 1],
                          [0, 1, 0],
                          [1, 0, 0]];
    assert.strictEqual(tempGame.checkVictory(), 1, "Sub diagonal");
    tempGame.gameField = [[1, 1, 1],
                          [0, 1, 0],
                          [0, 0, 0]];
    assert.strictEqual(tempGame.checkVictory(), 1, "Row");
    tempGame.gameField = [[0, 1, 1],
                          [0, 1, 1],
                          [0, 0, 1]];
    assert.strictEqual(tempGame.checkVictory(), 1, "Columns");
    tempGame.gameField = [[0, 1, 1],
                          [0, 1, 1],
                          [2, 0, 0]];
    assert.strictEqual(tempGame.checkVictory(), -1, "not end");
    tempGame.gameField = [[2, 1, 2],
                          [2, 2, 1],
                          [1, 2, 1]];
    tempGame.freeField = 0;
    assert.strictEqual(tempGame.checkVictory(), 0, "draw");


});
