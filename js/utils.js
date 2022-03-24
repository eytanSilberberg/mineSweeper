'use strict'
const noRightClick = document.querySelector('.wrapper');
noRightClick.addEventListener("contextmenu", e => e.preventDefault());

var gElStopWatch = document.querySelector('.stopwatch') //<div class="stopwatch">0.000</div>
var gTimerInterval
var gStartTime

function timerCycle() {
    var currTime = Date.now()
    var sec = (currTime - gStartTime) / 1000
    sec = sec.toFixed(3)
    gElStopWatch.innerHTML = sec
}

function startTimer() {
    gStartTime = Date.now()
    gTimerInterval = setInterval(timerCycle, 10)
}

function stopTimer() {
    clearInterval(gTimerInterval)
}

function resetTimer() {
    clearInterval(gTimerInterval)
    gElStopWatch.innerText = '0.000'
}


function createBoard(num = 4) {

    var board = [];
    for (var i = 0; i < num; i++) {
        board.push([])
        for (var j = 0; j < num; j++) {
            board[i][j] = ''
        }
    }
    return board;
}

function printMat(mat, selector) {
    var cellId = 0
    var strHTML = `<table class="box"  border="0"><tbody>`;
    for (var i = 0; i < mat.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell-${i}-${j}`;

            strHTML += `<td    style="color:white;" oncontextmenu="cellMarked(event,${i},${j})" onclick="cellClicked(this,${i},${j})" id="${cellId}"class="${className}"></td>`

            cellId++
            if (!cell.isMine) {
                gCellsToReveal++
            }
        }
        strHTML += `</tr>`

    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;

}


// location is  an object that contains i and j

function renderCell(i, j, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = value;
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsLocation = []
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            console.log(`new cell i ${i} j ${j}`)
            if (mat[i][j].isMine) neighborsCount++;

        }
    }
    return neighborsCount;
}

function markCells(coords) {
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
        elCell.classList.add('mark')
    }
}

function getRandomIntExclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isMine) emptyCells.push({ i, j })
            if (currCell.isShown) continue
        }
    }
    var randomIdx = getRandomIntExclusive(0, emptyCells.length)

    return emptyCells[randomIdx]
}
function revealNeighbors(cellI, cellJ, mat) {
    if (mat[cellI][cellJ] === MINE) return
    if (mat[cellI][cellJ].isMine === true) return
    var neighborsLocation = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (gBoard[i][j].isShown) continue

            neighborsLocation.push({ i, j })
        }
    }
    return neighborsLocation
}
