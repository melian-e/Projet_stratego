QUnit.test('prototype - method existance', function(assert) {
    assert.equal(typeof GameGrid.prototype.getBox, 'function');
    assert.equal(typeof GameGrid.prototype.move, 'function');
    //assert.equal(typeof GameGrid.prototype.grid, 'Array');
    assert.equal(typeof Game.prototype.getCurrentPlayer, 'function');
    assert.equal(typeof Game.prototype.play, 'function');
    assert.equal(typeof Piece.prototype.move, 'function');
    assert.equal(typeof Piece.prototype.getPower, 'function');
    assert.equal(typeof Piece.prototype.getCoord, 'function');
    assert.equal(typeof Piece.prototype.getOwner, 'function');
    assert.equal(typeof Piece.prototype.getOccupy, 'function');
    assert.equal(typeof Piece.prototype.getVisible, 'function');
});
  
QUnit.test('Game inherit from GameGrid', function(assert) {
    assert.ok(Game.prototype instanceof GameGrid);
});

QUnit.test('test de GameGrid', function(assert){
    let boardGame = new GameGrid();

    assert.deepEqual([], boardGame.allPiecesOnGrid());

    boardGame.grid[5][3] = new Piece(3,123,5,3);

    assert.deepEqual([new Piece(3,123,5,3)], boardGame.allPiecesOnGrid());
    assert.deepEqual(new Piece(3,123,5,3), boardGame.getBox(5,3));
    assert.deepEqual(new Entity(2), boardGame.getBox(4,2));

    let piece = boardGame.grid[5][3];
    boardGame.move(boardGame.grid[5][3], 2, 3);
    piece.coord = new Coordinates(2,3);

    assert.deepEqual(new Entity(0), boardGame.grid[5][3]);
    assert.deepEqual(piece, boardGame.grid[2][3]);
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(4,0), new Coordinates(4,5)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(4,5), new Coordinates(4,0)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(0,2), new Coordinates(5,2)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(5,2), new Coordinates(0,2)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(0,3), new Coordinates(5,3)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(5,3), new Coordinates(0,3)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(2,0), new Coordinates(2,5)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordinates(2,5), new Coordinates(2,0)));
    assert.ok(!boardGame.isObstacleOnTheWay(new Coordinates(2, 3), new Coordinates(3,3)));
    assert.ok(!boardGame.isObstacleOnTheWay(new Coordinates(0, 3), new Coordinates(2,3)));
    
    boardGame.grid[6][3]  = new Piece(4,123,6,3);
    assert.ok(!boardGame.isAttack(123, 5,4));
    assert.ok(!boardGame.isAttack(123, 6,3));
    boardGame.grid[6][3].owner  = 456;
    assert.ok(boardGame.isAttack(123, 6,3));

    boardGame.remove(piece);
    boardGame.remove(boardGame.getBox(6,3));

    assert.deepEqual(new Entity(0), boardGame.grid[2][3]);
    assert.deepEqual([], boardGame.allPiecesOnGrid());

    let table1 = Array(10);
    let table2 = Array(10);
    for(let i = 0; i <10; i++){
        table1[i]=Array(10);
        table2[i]=Array(10);
        for(let j = 0; j < 10; j++){
            table1[i][j] = 30;
            table2[i][j] = 30;
        }
    }
    
    table1[3][6] = 5;
    table1[7][9] = 3;
    boardGame.superpose(table1, 123);
    assert.deepEqual(new Piece(5,123,3,6), boardGame.grid[3][6]);
    assert.deepEqual(new Piece(3,123,7,9), boardGame.grid[7][9]);

    table2[1][1] = 6;
    table2[9][9] = -1;
    boardGame.superpose(table2, 123);
    assert.deepEqual(new Piece(6,123,1,1), boardGame.grid[1][1]);
    assert.deepEqual(new Piece(-1,123,9,9), boardGame.grid[9][9]);
});

QUnit.test('test de Game', function(assert){
    let partie1 = new Game(123, 456, true, true, true);
    /*partie1.grid[7][9] = new Piece(3,123,7,9);
    partie1.grid[3][6] = new Piece(5,123,3,6);
    partie1.grid[1][1] = new Piece(6,123,1,1);
    partie1.grid[9][9] = new Piece(-1,123,9,9);*/

    partie1.grid[0][0] = new Piece(0,123,0,0);
    partie1.grid[9][0] = new Piece(0,456,9,0);
    partie1.grid[7][0] = new Piece(8,123,7,0);

    assert.deepEqual([123,456], partie1.getPlayers());
    assert.ok(partie1.isFinished());
    assert.equal(123,partie1.getWinner());
    partie1.grid[8][0] = new Piece(8,456,8,0);
    assert.ok(!partie1.isFinished());
    partie1.remove(partie1.getBox(7,0));
    assert.ok(partie1.isFinished());
    assert.equal(456,partie1.getWinner());
    partie1.grid[7][0] = new Piece(8,123,7,0);
    partie1.remove(partie1.getBox(9,0));
    assert.ok(partie1.isFinished());
    assert.equal(123,partie1.getWinner());
    partie1.grid[9][0] = new Piece(0,456,9,0);
    partie1.remove(partie1.getBox(0,0));
    assert.ok(partie1.isFinished());
    assert.equal(456,partie1.getWinner());

    assert.ok(Date.now() >= partie1.startTime);
    assert.equal(0,partie1.getCurrentPlayer());
    partie1.play();
    assert.equal(1,partie1.getCurrentPlayer());
    partie1.play();
    assert.equal(0,partie1.getCurrentPlayer());

    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.deepEqual([], partie1.getHistoryMove(1));
    partie1.addMove(partie1.getBox(7, 0), new Coordinates(7,1));
    assert.deepEqual([[8,new Coordinates(7,0)],[8,new Coordinates(7,1)]], partie1.getHistoryMove(0));
    partie1.addMove(partie1.getBox(7, 0), new Coordinates(7,2));
    assert.deepEqual([[8,new Coordinates(7,0)],[8,new Coordinates(7,1)],[8,new Coordinates(7,2)]], partie1.getHistoryMove(0));
    partie1.addMove(partie1.getBox(7, 0), new Coordinates(6,2));
    partie1.addMove(partie1.getBox(7, 0), new Coordinates(6,3));
    partie1.addMove(partie1.getBox(7, 0), new Coordinates(6,4));
    assert.equal(6, partie1.getHistoryMove(0).length);
    partie1.addMove(partie1.getBox(7, 0), new Coordinates(7,4));
    assert.equal(6, partie1.getHistoryMove(0).length);
    assert.ok(!(partie1.getHistoryMove(0).some(elem => elem == [8,new Coordinates(7,0)])));
});

QUnit.test('test de attack', function(assert){
    let partie1 = new Game(123, 456, true, true, true);
    let partie2 = new Game(123, 456, false, false, false);
    
    partie1.grid[3][0] = new Piece(2,123,3,0);
    partie1.grid[4][0] = new Piece(4,456,4,0);
    partie1.grid[7][0] = new Piece(8,123,7,0);
    partie1.grid[8][0] = new Piece(8,456,8,0);
    partie1.grid[9][0] = new Piece(0,456,9,0);

    attack.eventAttack(partie1, partie1.getBox(3,0), partie1.getBox(4,0));
    assert.deepEqual(new Entity(0), partie1.getBox(3,0));
    assert.deepEqual(new Piece(4,456,4,0), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(2,123,3,0);
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    assert.deepEqual(new Entity(0), partie1.getBox(4,0));
    assert.deepEqual(new Piece(4,456,3,0), partie1.getBox(3,0));
    partie1.grid[4][0] = new Piece(4,123,4,0);
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    assert.deepEqual(new Entity(0), partie1.getBox(3,0));
    assert.deepEqual(new Entity(0), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(1, 123,3,0);
    partie1.grid[4][0] = new Piece(10,456,4,0);
    attack.eventAttack(partie1, partie1.getBox(3,0), partie1.getBox(4,0));
    assert.deepEqual(new Piece(1,123,4,0), partie1.getBox(4,0));
    assert.deepEqual(new Entity(0), partie1.getBox(3,0));
    partie1.grid[3][0] = new Piece(10,456,3,0);
    attack.eventAttack(partie1, partie1.getBox(3,0), partie1.getBox(4,0));
    assert.deepEqual(new Entity(0), partie1.getBox(3,0));
    assert.deepEqual(new Piece(10,456,4,0), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(-1,123,3,0);

    for(let x = 0; x <10; x++){
        for(let y = 0; y <10; y++){
            partie2.grid[x][y] = partie1.grid[x][y];
        }
    }

    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    attack.eventAttack(partie2, partie2.getBox(4,0), partie2.getBox(3,0));
    assert.deepEqual(new Entity(0), partie1.getBox(3,0));
    assert.deepEqual(new Entity(0), partie1.getBox(4,0));
    assert.deepEqual(new Piece(-1,123,3,0), partie2.getBox(3,0));
    assert.deepEqual(new Entity(0), partie2.getBox(4,0));
    partie2.grid[4][0] = new Piece(3,456,4,0);
    
    for(let x = 0; x <10; x++){
        for(let y = 0; y <10; y++){
            partie1.grid[x][y] = partie2.grid[x][y];
        }
    }

    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    attack.eventAttack(partie2, partie2.getBox(4,0), partie2.getBox(3,0));
    assert.deepEqual(new Entity(0), partie1.getBox(4,0));
    assert.deepEqual(new Piece(3,456,3,0), partie1.getBox(3,0));
    assert.deepEqual(new Entity(0), partie2.getBox(4,0));
    assert.deepEqual(new Piece(3,456,3,0), partie2.getBox(3,0));
    console.log(partie2);
});

QUnit.test('test de move', function(assert){
    let partie1 = new Game(123, 456, true, true, true);
    let partie2 = new Game(123, 456, false, false, false);

    let piece = new Piece(0, partie1.player1,2,3);
    partie1.grid[2][3] = piece; 
    move.eventMove(partie1, partie1.grid[2][3], 1, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    piece.power = -1;
    partie1.grid[2][3] = piece; 
    move.eventMove(partie1, partie1.grid[2][3], 1, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    piece.power = 4;
    partie1.grid[2][3] = piece; 
    move.eventMove(partie1, partie1.grid[2][3], 2, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    piece.owner = partie1.player2;
    partie1.grid[2][3] = piece; 
    move.eventMove(partie1, partie1.grid[2][3], 1, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    piece.owner = partie1.player1;
    partie1.grid[2][3] = piece;
    partie1.grid[1][3] = new Piece(5, partie1.player1,1,3);
    move.eventMove(partie1, partie1.grid[2][3], 1, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    move.eventMove(partie1, partie1.grid[2][3], 0, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    piece.power = 2;
    partie1.grid[2][3] = piece; 
    move.eventMove(partie1, partie1.grid[2][3], 1, 2);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    move.eventMove(partie1, partie1.grid[2][3], 6, 3);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    partie1.grid[2][6] = new Piece(6,456,2,6); 
    move.eventMove(partie1, partie1.grid[2][3], 2, 6);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    partie2.grid = partie1.grid;
    move.eventMove(partie2, partie2.grid[2][3], 2, 6);
    assert.equal(2, partie2.getHistoryMove(0).length);
    assert.equal(1, partie2.getCurrentPlayer());
    assert.deepEqual(new Entity(0), partie2.getBox(2,3));

    piece.power = 5;
    partie1.grid[2][3] = piece; 
    move.eventMove(partie1, partie1.grid[2][3], 1, 2);
    assert.deepEqual([], partie1.getHistoryMove(0));
    assert.equal(0, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,3));

    move.eventMove(partie1, partie1.grid[2][3], 2, 2);
    assert.equal(2, partie2.getHistoryMove(0).length);
    assert.equal(1, partie2.getCurrentPlayer());
    assert.deepEqual(new Entity(0), partie2.getBox(2,3));
    move.eventMove(partie1, partie1.grid[2][2], 2, 3);
    assert.qual(3, partie2.getHistoryMove(0).length);
    assert.equal(0, partie2.getCurrentPlayer());
    assert.deepEqual(new Entity(0), partie2.getBox(2,2));
    move.eventMove(partie1, partie1.grid[2][3], 2, 2);
    assert.equal(4, partie2.getHistoryMove(0).length);
    assert.equal(1, partie2.getCurrentPlayer());
    assert.deepEqual(new Entity(0), partie2.getBox(2,3));
    move.eventMove(partie1, partie1.grid[2][2], 2, 3);
    assert.equal(5, partie2.getHistoryMove(0).length);
    assert.equal(0, partie2.getCurrentPlayer());
    assert.deepEqual(new Entity(0), partie2.getBox(2,2));
    move.eventMove(partie1, partie1.grid[2][3], 2, 2);
    assert.equal(6, partie2.getHistoryMove(0).length);
    assert.equal(1, partie2.getCurrentPlayer());
    assert.deepEqual(new Entity(0), partie2.getBox(2,3));
    move.eventMove(partie1, partie1.grid[2][2], 2, 3);
    assert.equal(6, partie2.getHistoryMove(0).length);
    assert.equal(1, partie1.getCurrentPlayer());
    assert.deepEqual(piece, partie1.getBox(2,2));

});