/*----- constants -----*/
const colorLookup = {
    '0' : 'white',
    '1' : 'pink',
    '-1' : 'lightblue'
};


/*----- app's state (variables) -----*/
let board, turn, winner;

/*----- cached element references -----*/
const msgEl = document.getElementById('msg');
// grabs the id=msg element from html
const markerEls = [...document.querySelectorAll('#markers > div')];
// grabs the markers, selects all divs that are direct children of markers, [...] sets that info as an array
const replayBtn = document.querySelector('button');
// selects botton from HTML

/*----- event listeners -----*/
document.getElementById('markers')
    .addEventListener('click', handleDrop);
    // always use 'handle' to name event listner function
replayBtn.addEventListener('click', init);
    // calls init function when the replay button is pushed

/*----- functions -----*/
init();

function handleDrop(evt) {
    // evt stands for event, the input of the function which is event object. evt.target is the event object target
    // a market has been click update all impacted state, call render
    
    // get the index of the clicked market (column)
    const colIdx = markerEls.indexOf(evt.target);
    if (colIdx === -1 || winner) return;
        // this takes care of missed clicks that register as -1 in indexOf and ignore click once there is a winner
    const colArr = board[colIdx];
        // colArr = board column based on the marker that was clicked
    const rowIdx = colArr.indexOf(0);
        //find first 0 in columns, indexOf scan until it find the first 0
    if (rowIdx === -1) return;
        // if the column is full it will return
    colArr[rowIdx] = turn;
        //????
    turn = turn * -1;
        // switches turn to next person
    winner =  getWinner();
        // ?????
    render ()
}

function getWinner() {
    let winner = null
    for (let colIdx = 0; colIdx <= 6; colIdx++) {
        //interates through columns
        winner = checkCol(colIdx) ;
        if (winner) break;
    }
    return winner;
    // add tie logic
}

function checkCol(colIdx) {
    const colArr = board[colIdx];
    for (let rowIdx = 0; rowIdx < colArr.length; rowIdx++) {
        let winner = checkUp(colArr, rowIdx) || checkRight(colIdx, rowIdx) || checkDiag(colIdx, rowIdx, 1) || checkDiag(colIdx, rowIdx, -1);
        if (winner) return winner;
    }
    return null;
}

function checkUp(colArr, rowIdx) {
    // Boundary check
    if (rowIdx > 2) return null;
    if (Math.abs(colArr[rowIdx] + colArr[rowIdx + 1] + colArr[rowIdx + 2] + colArr[rowIdx + 3]) === 4){
        return colArr[rowIdx];
    }else {
        return null;
    }
}

function checkRight(colIdx, rowIdx) {
    // Boundary check
    if (colIdx > 3) return null;
    const total = board[colIdx][rowIdx] + board[colIdx + 1][rowIdx] + board[colIdx + 2][rowIdx] + board[colIdx + 3][rowIdx];
    if (Math.abs(total) === 4){
        return board[colIdx][rowIdx];
    }else {
        return null;
    }
}

function checkDiag(colIdx, rowIdx, dir) {
    // Boundary check
    if (dir > 0 && colIdx > 3 || dir > 0 && rowIdx > 2) return null;
    if (dir < 0 && colIdx > 3 || dir < 0 && rowIdx < 3) return null;
    const total = board[colIdx][rowIdx] + board[colIdx + 1][rowIdx + dir] + board[colIdx + 2][rowIdx + dir * 2] + board[colIdx + 3][rowIdx + dir * 3];
    if (Math.abs(total) === 4) {
        return board[colIdx][rowIdx];
    }else {
        return null;
    }
}  



function init() {
    // Initialize all state
    board = [
        [0, 0, 0, 0, 0, 0],  // Column 0
        [0, 0, 0, 0, 0, 0],  // Column 1
        [0, 0, 0, 0, 0, 0],  // Column 2
        [0, 0, 0, 0, 0, 0],  // Column 3
        [0, 0, 0, 0, 0, 0],  // Column 4
        [0, 0, 0, 0, 0, 0],  // Column 5
        [0, 0, 0, 0, 0, 0],  // Column 6
    ];
    turn = 1;
    winner = null;
    render();
}

function render() {
    // render the board, loop through array, and id
    board.forEach(function(colArr, colIdx) {
        // itterate over the col array to access the cells value
        colArr.forEach(function(cellVal, rowIdx) {
            // select the correct dive for this cellVal
            const div = document.getElementById(`c${colIdx}r${rowIdx}`);
            div.style.backgroundColor = colorLookup[cellVal];
        });
        markerEls[colIdx].style.visibility = colArr.includes(0) ? 'visible' : 'hidden';
        // turnary expresion: conditional expression ? truthy val : falsey val;  if conditional expresion is true return truth val, if false return falsey val
        // is coloumn array includes a zero marker is visible, if it doesnt (full) it is hidden
    });
    // render the msg below connect four
    if (winner === 'T'){
        // its a tie
        msgEl.textContent = "It's a Tie!!!";
    } else if (winner) {
        // a player has won, show message and add inline color style. MUST USE DOUBLE QUOTE FOR COLOR PART
        msgEl.innerHTML = `<span style="color: ${colorLookup[winner]}">${colorLookup[winner].toUpperCase()}</span> Wins!`;
     } else {
        // No winner yet show whose turn, and set in-line color style. MUST USE DOUBLE QUOTE FOR COLOR PART
        msgEl.innerHTML = `<span style="color: ${colorLookup[turn]}">${colorLookup[turn].toUpperCase()}</span>'s Turn`;     
    }
    replayBtn.style.visibility = winner ? 'visible' : 'hidden';
    // has replay only show up when the game is over
}