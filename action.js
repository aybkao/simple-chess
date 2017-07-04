
// depth = 2 minimax 


const calculatePieceValue = (pieceType, color) => {
  var score;
  switch (pieceType) {
    case 'p':
      score = 100;
      break;
    case 'n':
      score = 320;
      break;
    case 'b':
      score = 325;
      break;
    case 'r': 
      score = 500;
      break;
    case 'q':
      score = 975;
      break;
    case 'k':
      score = 32767;
      break;
  }
  if (color === 'b') {
    score = -score;
  }
  //console.log("this is piecevalue", score);
  //console.log("this is piececolor", color);
  return score;
}


const calculatePositionValue = (pieceType, color, i, j, numRounds) => {
  var chessTable; 
  switch (pieceType) {
    case 'p':
      chessTable = [[  0,  0,  0,  0,  0,  0,  0,  0],
                    [ 50, 50, 50, 50, 50 ,50 ,50, 50],
                    [ 10, 10, 20, 30, 30, 20, 10, 10],
                    [  5,  5, 10, 27, 27, 10,  5,  5],
                    [  0,  0,  0, 25, 25,  0,  0,  0],
                    [  5, -5,-10,  0,  0,-10, -5,  5],
                    [  5, 10, 10,-25,-25, 10, 10,  5],
                    [  0,  0,  0,  0,  0,  0,  0,  0]];
      break;
    case 'n':
      chessTable = [[-50,-40,-30,-30,-30,-30,-40,-50],
                    [-40,-20,  0,  0,  0,  0,-20,-40],
                    [-30,  0, 10, 15, 15, 10,  0,-30],
                    [-30,  5, 15, 20, 20, 15,  5,-30],
                    [-30,  0, 15, 20, 20, 15,  0,-30],
                    [-30,  5, 10, 15, 15, 10,  5,-30],
                    [-40,-20,  0,  5,  5,  0,-20,-40],
                    [-50,-40,-20,-30,-30,-20,-40,-50]];
      break;
    case 'b':
      chessTable = [[-20,-10,-10,-10,-10,-10,-10,-20],
                    [-10,  0,  0,  0,  0,  0,  0,-10],
                    [-10,  0,  5, 10, 10,  5,  0,-10],
                    [-10,  5,  5, 10, 10,  5,  5,-10],
                    [-10,  0, 10, 10, 10, 10,  0,-10],
                    [-10, 10, 10, 10, 10, 10, 10,-10],
                    [-10,  5,  0,  0,  0,  0,  5,-10],
                    [-20,-10,-40,-10,-10,-40,-10,-20]];
      break;
    case 'k':
      chessTable = [[-30,-40,-40,-50,-50,-40,-40,-30],
                    [-30,-40,-40,-50,-50,-40,-40,-30],
                    [-30,-40,-40,-50,-50,-40,-40,-30],
                    [-30,-40,-40,-50,-50,-40,-40,-30],
                    [-20,-30,-30,-40,-40,-30,-30,-20],
                    [-10,-20,-20,-20,-20,-20,-20,-10],
                    [ 20, 20,  0,  0,  0,  0, 20, 20],
                    [ 20, 30, 10,  0,  0, 10, 30, 20]];
      break;
  }
  // late game strategy for king
  if (pieceType == 'k' & numRounds > 20) {
    chessTable = [[-50,-40,-30,-20,-20,-30,-40,-50],
                  [-30,-20,-10,  0,  0,-10,-20,-30],
                  [-30,-10, 20, 30, 30, 20,-10,-30],
                  [-30,-10, 30, 40, 40, 30,-10,-30],
                  [-30,-10, 30, 40, 40, 30,-10,-30],
                  [-30,-10, 20, 30, 30, 20,-10,-30],
                  [-30,-30,  0,  0,  0,  0,-30,-30],
                  [-50,-30,-30,-30,-30,-30,-30,-50]];    
  }
  let positionValue = chessTable[i][j];
  if (color === 'b') {
    positionValue = -1 * chessTable[7-i][7-j]; 
  }
  return positionValue;
}

// AI looks for move with lowest total board value
const sumBoardValue = (board, numRounds) => {
  let value = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j]) {
        value += calculatePieceValue(board[i][j]['type'], board[i][j]['color']);
        if (['r', 'q'].indexOf(board[i][j]['type']) === -1) {
          // no special late game strategy for now
          value += calculatePositionValue(board[i][j]['type'], board[i][j]['color'], i, j, 10);
        }
      }
    }
  }
  return value;
}


const indexOfMin = (arr) => {
  if (arr.length === 0) {
    return -1;
  }
  let min = arr[0];
  let minIndex = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }
  return minIndex;
}


// sort tuple values from small to large
const sortBySecondElement = (a, b) => {
  if (a[1] === b[1]) {
    return 0;
  } else {
    return (a[1] < b[1]) ? -1 : 1;
  }
}


const findBestMove = (depth) => {
  let valueAfterOnePly = [];  
  let possibleMovesBlack = game.moves();  
  
  for (let k = 0; k < possibleMovesBlack.length; k++) {
    game.move(possibleMovesBlack[k]);
    let valueAfterBlackMove = sumBoardValue(game.board());
    valueAfterOnePly.push([possibleMovesBlack[k], valueAfterBlackMove]);
    game.undo();
  }
  
  valueAfterOnePly.sort(sortBySecondElement);

  let lowestValue = Infinity;
  let whiteMoveValuesOnly = [];
  let whiteMoveAndValue = [];

  for (let s = 0; s < valueAfterOnePly.length; s++) {
    if (valueAfterOnePly[s][1] > lowestValue) {
      break;
    }
    
    game.move(valueAfterOnePly[s][0]);
    let highestValue = -Infinity; 
    //let moveandvalue=[];
    let possibleMovesWhite = game.moves();
    
    for (let t = 0; t < possibleMovesWhite.length; t++) {
      game.move(possibleMovesWhite[t]);
      let valueAfterWhiteMove = sumBoardValue(game.board());
      if (valueAfterWhiteMove > highestValue) {
        highestValue = valueAfterWhiteMove;
        //moveAndValue = [possibleMovesWhite[t], highestValue];
      }
      game.undo();
    }  
    
    // record best white move value for each black move
    if (highestValue < lowestValue) {
      lowestValue = highestValue;
    }
    
    whiteMoveValuesOnly.push(highestValue);
    //whiteMoveAndValue.push(moveAndValue);
    game.undo();
  }

  //console.log("best white move for each black move", whiteMoveAndValue);
  let bestBlackMoveIndex = indexOfMin(whiteMoveValuesOnly);
  let bestMove = valueAfterOnePly[bestBlackMoveIndex][0];
  return bestMove;
}


//******************** manage board and render ********************

let board, game = new Chess(); 
const statusEl = $('#status'); 
const fenEl = $('#fen');
const pgnEl = $('#pgn');

var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
     (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
     (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  } 
}

var onDrop = function(source, target) {
  //check if move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });
  
  // illegal move
  if (move === null) return 'snapback';
  
  updateStatus();
  
  if (game.turn() === 'b') {
    if (game.in_checkmate()) {
      updateStatus();
      return;
    }
    let bestMove = findBestMove();
    //console.log("best move: ", bestMove);
    game.move(bestMove);
    // update board postion
    board.position(game.fen());
    updateStatus();
  }
};

// update board position after piecesnap for castling, en passant, promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  var status = '';
  var moveColor = 'White';
  
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }
  
  if (game.in_checkmate() === true) {
    // checkmate?
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  } else if (game.in_draw() === true) {
    // draw?
    status = 'Game over, drawn position';
  } else {
    status = moveColor + ' to move';
    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }
  
  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

board = ChessBoard('board', cfg);
updateStatus();


// additional functions
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const boardArrayToFen = (boardArray, special) => {  
  let nextFen = '';
  boardArray.forEach((pos) => {
    nextFen += pos.join('').replaceAll(',', '') + '/';
  })
  nextFen = nextFen.slice(0, nextFen.length) + ' special moves records';
  return nextFen;
}

