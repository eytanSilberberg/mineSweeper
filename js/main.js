'use strict'

const FLAG = '🚩'
const MINE = '💣'
const HAPPY = '😀'
const iWon = '😎'
const iLost = '🤯'
const EMPTY = ''
var elSmiley = document.querySelector('#smiley')
const HEARTS = '♥️♥️♥️'
const HEART = '♥️'
var amountOfHearts = 3
var gHint = false
var elHearts = document.querySelector('.extras p')
const hintOff = '💡'
var elImg = document.querySelector('img')
var allClickedCells = []

var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    cellsToShow: 0,
    flaggedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
    amountOfHints: 3

}
var gBoard
var gMines = []

function init() {
    restartAll()
    gBoard = createBoard(gLevel.size)
    renderBoard(gBoard, '.table-main')
    console.log(gBoard)
}

function createBoard(num) {

    var board = [];
    for (var i = 0; i < num; i++) {
        board.push([])
        for (var j = 0; j < num; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isFlagged: false
            }
            board[i][j] = cell
        }
    }
    return board;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var neighborCount = countNeighbors(i, j, gBoard)
            if (gBoard[i][j].minesAroundCount === 0) gBoard[i][j].minesAroundCount = EMPTY

        }
    }
}
function placeMines(amount) {
    for (var i = 0; i < amount; i++) {
        var emptyCell = getEmptyCell(gBoard)
        gBoard[emptyCell.i][emptyCell.j].isMine = true
        gMines.push(emptyCell)
    }
}
function renderBoard(mat, selector) {
    var strHTML = '<table border="2"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td data-i="${i}" data-j="${j}" onmousedown="toggleFlag(event,${i},${j})"  
            onclick="cellClicked(event,this,${i},${j})" data-i="${i}" data-j="${j}"class="td-cover ${className}">${EMPTY}</td>`
            gGame.cellsToShow++
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    gGame.cellsToShow = gGame.cellsToShow - gLevel.mines
}
function countNeighbors(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            var cell = mat[i][j]
            if (cell.isMine) {
                if (cell.isShown) continue
                mat[cellI][cellJ].minesAroundCount++
            }
        }
    }
}
function getNeighbors(cellI, cellJ, mat) {

    var neighbors = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            neighbors.push({ i, j })
        }
    }
    return neighbors
}

function renderCell(i, j, value) {
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = value;
}

function getEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (currCell.isShown) continue
            if (!currCell.isMine) emptyCells.push({ i, j })
        }
    }
    var randomIdx = getRandomIntExclusive(0, emptyCells.length)
    return emptyCells[randomIdx]
}

function cellClicked(ev, elCell, i, j) {
    var cell = gBoard[i][j]
    if (gHint) {
        var neighbors = hintNeighbors(i, j, gBoard)

        for (var idx = 0; idx < neighbors.length; idx++) {
            var currNeighbor = neighbors[idx]
            if (gBoard[currNeighbor.i][currNeighbor.j].isMine) {
                renderCell(currNeighbor.i, currNeighbor.j, MINE)
            } else {
                renderCell(currNeighbor.i, currNeighbor.j, gBoard[currNeighbor.i][currNeighbor.j].minesAroundCount)
            }

        }
        setTimeout(() => {
            for (var idx = 0; idx < neighbors.length; idx++) {
                var currNeighbor = neighbors[idx]
                renderCell(currNeighbor.i, currNeighbor.j, EMPTY)
                elImg.src = '/imgs/off.png'
            }
        }, 1000)
        gHint = false
        return
    }
    if (!gGame.isOn) return
    if (cell.isShown) return

    if (ev.button === 0) {
        if (gGame.isFirstClick) {
            startTimer()
            gGame.isFirstClick = false
            cell.isShown = true
            placeMines(gLevel.mines)
            setMinesNegsCount(gBoard)

        }
        if (gBoard[i][j].isFlagged) return

        if (cell.isMine) {
            var strHTML = ''
            amountOfHearts--
            for (var idx = 0; idx < amountOfHearts; idx++) {
                strHTML += HEART
            }
            elHearts.innerHTML = strHTML

            renderCell(i, j, MINE)
            if (amountOfHearts !== 0) return
            gGame.isOn = false
            for (var idx = 0; idx < gMines.length; idx++) {
                var elSurrounding = document.querySelector(`.cell-${gMines[idx].i}-${gMines[idx].j}`)
                elSurrounding.classList.remove('td-cover')

                var mineExploded = gMines[idx]
                renderCell(mineExploded.i, mineExploded.j, MINE)
            }
        }
        if (!cell.isMine) {
            elCell.classList.remove('td-cover')
            renderCell(i, j, cell.minesAroundCount)
            if (gBoard[i][j].minesAroundCount === EMPTY) {
                var neighbors = getNeighbors(i, j, gBoard)
                for (var idx = 0; idx < neighbors.length; idx++) {
                    var neighbor = neighbors[idx]
                    if (gBoard[neighbor.i][neighbor.j].isShown) continue
                    gGame.shownCount++
                    gBoard[neighbor.i][neighbor.j].isShown = true
                    var elSurrounding = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
                    elSurrounding.classList.remove('td-cover')

                    renderCell(neighbor.i, neighbor.j, gBoard[neighbor.i][neighbor.j].minesAroundCount)
                }
                gGame.shownCount++
            } else {
                gGame.shownCount++
            }
        }

        cell.isShown = true
        checkGameOver(ev, i, j)
    }
}

function checkGameOver(ev, i, j) {

    var cell = gBoard[i][j]

    if (gGame.shownCount === gGame.cellsToShow && gGame.flaggedCount === gLevel.mines) {
        elSmiley.innerHTML = iWon
        stopTimer()
    }
    if (cell.isMine) {
        stopTimer()
        elSmiley.innerHTML = iLost
    }
}
function toggleFlag(ev, i, j) {
    var elCellFlagged = document.querySelector(`.cell-${i}-${j}`)
    if (ev.button !== 2) return
    if (gGame.isFirstClick) {
        startTimer()
        gGame.isFirstClick = false
    }
    if (gBoard[i][j].isShown) return
    if (!gBoard[i][j].isFlagged) {
        gBoard[i][j].isFlagged = true
        renderCell(i, j, FLAG)
        gGame.flaggedCount++

        elCellFlagged.classList.remove('td-cover')
    } else {
        gBoard[i][j].isFlagged = false
        renderCell(i, j, EMPTY)
        gGame.flaggedCount--
        elCellFlagged.classList.add('td-cover')
    }
    if (gGame.shownCount === gGame.cellsToShow && gGame.flaggedCount >= gLevel.mines) {
        stopTimer()
        elSmiley.innerHTML = iWon
    }
}
function changeLevel(num) {
    switch (num) {
        case 0:
            gLevel = {
                size: 4,
                mines: 2
            }
            break
        case 1:
            gLevel = {
                size: 8,
                mines: 12
            }
            break
        case 2:
            gLevel = {
                size: 12,
                mines: 30
            }

    }
    init()
}

function restartAll() {
    allClickedCells = []
    amountOfHearts = 3
    elHearts.innerHTML = HEARTS
    elSmiley.innerHTML = HAPPY
    stopTimer()
    resetTimer()
    gGame = {
        isOn: true,
        shownCount: 0,
        cellsToShow: 0,
        flaggedCount: 0,
        secsPassed: 0,
        isFirstClick: true,
        amountOfHints: 3
    }
    var elHintBtn = document.querySelectorAll('button')
    elHintBtn[0].innerText = `Take a hint. You got ${gGame.amountOfHints} left`
    gMines = []
}
function takeAHint() {
    var elHintBtn = document.querySelectorAll('button')
    if (gHint) {
        elImg.src = '/imgs/off.png'
        gHint = false
        return
    }
    if (gGame.amountOfHints === 0) {
        elHintBtn[1].innerText = `No hints left pal`
        return
    }
    elImg.src = '/imgs/on.png'
    gGame.amountOfHints--
    elHintBtn[0].innerText = `Take a hint. You got ${gGame.amountOfHints} left`
    gHint = true
}
function hintNeighbors(cellI, cellJ, mat) {
    var neighbors = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isShown) continue
            if (mat[i][j].isFlagged) continue
            neighbors.push({ i, j })
        }
    }
    return neighbors
}
function undo() {

}