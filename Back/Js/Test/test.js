QUnit.test('test de GameGrid', function(assert){
    let boardGame = new GameGrid();

    assert.equal([], boardGame.allPiecesOnGrid());

    boardGame.grid[5][3] = new Piece(3, 123);

    assert.equal([boardGame.grid[5][3]], boardGame.allPiecesOnGrid());
    assert.equal(new Piece(3, 123), boardGame.getBox((5,3)));
    assert.equal(new Entite(2), boardGame.getBox((4,2)));

    let piece = boardGame.grid[5][3];
    boardGame.move(boardGame.grid[5][3], 2, 3);

    assert.equal(new Entite(0), boardGame.grid[5][3]);
    assert.equal(piece, boardGame.grid[2][3]);
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(4,0), new Coordonnees(4,5)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(4,5), new Coordonnees(4,0)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(0,2), new Coordonnees(5,2)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(5,2), new Coordonnees(0,2)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(0,3), new Coordonnees(5,3)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(5,3), new Coordonnees(0,3)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(2,0), new Coordonnees(2,5)));
    assert.ok(boardGame.isObstacleOnTheWay(new Coordonnees(2,5), new Coordonnees(2,0)));
    assert.ok(!boardGame.isObstacleOnTheWay(new Coordonnees(2, 3), new Coordonnees(3,3)));
    assert.ok(!boardGame.isObstacleOnTheWay(new Coordonnees(0, 3), new Coordonnees(2,3)));    
    
    piece.coord = new Coordonnees(2,3);
    boardGame.remove(piece);

    assert.equal(new Entite(0), boardGame.grid[2][3]);
    assert.equal([], boardGame.allPiecesOnGrid());

});

QUnit.test('test de Game', function(assert){
    let partie1 = new Game(123, 456, true, true, true);
    partie1.grid = boardGame.grid;
    partie1.grid[0][0] = new Piece(0, 123);
    partie1.grid[9][0] = new Piece(0, 456);
    partie1.grid[7][0] = new Piece(8, 123);

    assert.ok(partie1.isFinished());
    assert.equal(456,partie1.getWinner());
    partie1.grid[8][0] = new Piece(8, 456);
    assert.ok(!partie1.isFinished());
    partie1.remove(partie.getbox(7,0));
    assert.ok(partie1.isFinished());
    assert.equal(123,partie1.getWinner());
    partie1.grid[7][0] = new Piece(8, 123);
    partie1.remove(partie.getbox(9,0));
    assert.ok(partie1.isFinished());
    assert.equal(456,partie1.getWinner());
    partie1.grid[9][0] = new Piece(0, 456);
    partie1.remove(partie.getbox(0,0));
    assert.ok(partie1.isFinished());
    assert.equal(123,partie1.getWinner());

    assert.ok(Date.now() >= partie1.startTime);
    assert.equal(0,partie1.getCurrentPlayer());
    partie1.play();
    assert.equal(1,partie1.getCurrentPlayer());
    partie1.play();
    assert.equal(0,partie1.getCurrentPlayer());

    assert.equal([], partie1.getHistoryMove(0));
    assert.equal([], partie1.getHistoryMove(1));
    partie1.addMove(partie1.getBox(7, 0), new Coordonnees(7,1));
    assert.equal([[8,new Coordonnees(7,0)],[8,new Coordonnees(7,1)]], partie1.getHistoryMove(0));
    partie1.addMove(partie1.getBox(7, 0), new Coordonnees(7,2));
    assert.equal([[8,new Coordonnees(7,0)],[8,new Coordonnees(7,1)],[8,new Coordonnees(7,2)]], partie1.getHistoryMove(0));
    partie1.addMove(partie1.getBox(7, 0), new Coordonnees(6,2));
    partie1.addMove(partie1.getBox(7, 0), new Coordonnees(6,3));
    partie1.addMove(partie1.getBox(7, 0), new Coordonnees(6,4));
    assert.equal(6, partie1.getHistoryMove(0).length);
    partie1.addMove(partie1.getBox(7, 0), new Coordonnees(7,4));
    assert.equal(6, partie1.getHistoryMove(0).length);
    assert.ok(!(partie1.getHistoryMove(0).some([8,new Coordonnees(7,0)])));
});

QUnit.test('test de attack', function(assert){
    let partie2 = new Game(123, 456, false, false, false);

    partie1.grid[3][0] = new Piece(2, 123);
    partie1.grid[4][0] = new Piece(4, 456);

    attack.eventAttack(partie1, partie1.getBox(3,0), partie1.getBox(4,0));
    assert.equal(new Entite(0), partie1.getBox(3,0));
    assert.equal(new Piece(4, 456), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(2, 123);
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(3,0));
    assert.equal(new Piece(4, 456), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(4, 123);
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(1, 123);
    partie1.grid[4][0] = new Piece(10, 456);
    attack.eventAttack(partie1, partie1.getBox(3,0), partie1.getBox(4,0));
    assert.equal(new Piece(1, 123), partie1.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(4,0));
    partie1.grid[4][0] = new Piece(10, 456);
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(3,0));
    assert.equal(new Piece(10, 456), partie1.getBox(4,0));
    partie1.grid[3][0] = new Piece(-1, 123);
    partie2.grid = partie1.grid;
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    attack.eventAttack(partie2, partie2.getBox(4,0), partie2.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(4,0));
    assert.equal(new Piece(-1, 123), partie2.getBox(3,0));
    assert.equal(new Entite(0), partie2.getBox(4,0));
    partie2.grid[4][0] = new Piece(3, 456);
    partie1.grid = partie2.grid;
    attack.eventAttack(partie1, partie1.getBox(4,0), partie1.getBox(3,0));
    attack.eventAttack(partie2, partie2.getBox(4,0), partie2.getBox(3,0));
    assert.equal(new Entite(0), partie1.getBox(3,0));
    assert.equal(new Piece(3, 456), partie1.getBox(4,0));
    assert.equal(new Entite(0), partie2.getBox(3,0));
    assert.equal(new Piece(3, 456), partie2.getBox(4,0));
});

QUnit.test('test de move', function(assert){
    assert.ok(true);
});