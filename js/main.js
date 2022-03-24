'use strict'
// var elBtns = document.querySelectorAll()
var gLevels = [{ size: 4, mines: 2 }, { size: 8, mines: 12, }, { size: 12, mines: 30 }]
var gGame = {
    isOn: false,
    CellRevealed: 0,
    gFlagsMarked: 0,
    secsPassed: 0
}
var gCellsToReveal = 0
var isFirstClick = true
var elBtnRestart = document.querySelector('.restart-btn')
var gBoard
var gAmountOfMines = 0
var cellsWithMines
var elLives = document.querySelector('.lives-left')
var lives = 3
var startingLives = '♥️♥️♥️'
var life = '♥️'
const MINE = '💣'
const FLAG = '🚩'
const BOOM = ''
const EMPTY = ''
const normalFace = '😃'
const sadFace = '🤯'
const victoryFace = '😎'
var elSmiley = document.querySelector('.smiley-wrapper')


function init() {
    elSmiley.innerHTML = normalFace
    elLives.innerHTML = startingLives
    lives = 3
    cellsWithMines = []
    gGame.isOn = true
    isFirstClick = true
    // resetAll()
    resetTimer()
    elBtnRestart.style.display = 'none'
    gCellsToReveal = 0
    gGame.CellRevealed = 0
    gAmountOfMines = 0
    gGame.gFlagsMarked = 0
    gBoard = createBoard(gLevels[0].size)
    cellsGenerator(gLevels[0].size)
    placeMines(gLevels[0].mines)
    setMinesNegsCount(gBoard)
    printMat(gBoard, '.wrapper')
}
function cellsGenerator(size) {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true,
                isFlagged: false
            }
            gBoard[i][j] = cell
        }
    }
}
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var amount = countNeighbors(i, j, board)
            if (amount === 0) gBoard[i][j].minesAroundCount = EMPTY
            if (amount) gBoard[i][j].minesAroundCount = amount
        }
    }
}
function cellClicked(elCell, i, j) {
    var clickedCell = gBoard[i][j]
    if (!gGame.isOn) return
    if (isFirstClick) {
        startTimer()
        isFirstClick = false
    }

    // renderCell(i, j, clickedCell.minesAroundCount)
    if (clickedCell.isShown) return
    // clickedCell.isShown = true
    if (clickedCell.isMine) {
        revealNeighbors(i, j, gBoard)

        lives--
        decreaseLives(lives)
        if (lives === 0) {
            for (var idx = 0; idx < cellsWithMines.length; idx++) {
                renderCell(cellsWithMines[idx].i, cellsWithMines[idx].j, MINE)
                gameOver()
            }

        }

    } else {
        clickedCell.isShown = true
        elCell.style.backgroundColor = 'blue'
        renderCell(i, j, clickedCell.minesAroundCount)
        if (clickedCell.minesAroundCount === EMPTY) {
            var neighbors = revealNeighbors(i, j, gBoard)
            for (var idx = 0; idx < neighbors.length; idx++) {
                var neighbor = neighbors[idx]
                var domCell = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
                renderCell(neighbor.i, neighbor.j, gBoard[neighbor.i][neighbor.j].minesAroundCount)

                gBoard[neighbor.i][neighbor.j].isShown = true
                domCell.style.backgroundColor = 'blue'
                gGame.CellRevealed++
            }
        }
        gGame.CellRevealed++
        console.log(gGame.CellRevealed)
        if (gGame.CellRevealed === gCellsToReveal && gGame.gFlagsMarked === gAmountOfMines)
            gameOver()
    }

}
function placeMines(amount) {

    for (var i = 0; i < amount; i++) {
        gAmountOfMines++
        var cellWithMine = getEmptyCell(gBoard)
        cellsWithMines.push(cellWithMine)
        console.log(cellWithMine)
        var mineLocation = {
            i: cellWithMine.i,
            j: cellWithMine.j
        }
        gBoard[mineLocation.i][mineLocation.j].isMine = true
    }
}
function cellMarked(ev, i, j) {
    if (ev.button === 2) {
        if (gBoard[i][j].isShown || !gGame.isOn) return
        if (!gBoard[i][j].isFlagged) {
            console.log('i am flagging')
            renderCell(i, j, FLAG)
            gBoard[i][j].isFlagged = true
            gGame.gFlagsMarked++
            if (gGame.CellRevealed === gCellsToReveal && gGame.gFlagsMarked === gAmountOfMines) {
                gameOver()
            }

        } else {
            console.log('i am unflagging')
            renderCell(i, j, EMPTY)
            gBoard[i][j].isFlagged = false
            gGame.gFlagsMarked--
        }
    }
}
function gameOver() {
    if (gGame.CellRevealed === gCellsToReveal && gGame.gFlagsMarked === gAmountOfMines) {
        elSmiley.innerHTML = victoryFace
    } else {
        elSmiley.innerHTML = sadFace
    }
    stopTimer()
    gGame.isOn = false
    elBtnRestart.style.display = 'block'
}
// function expandShown(board, elCell, i, j)
function resetAll() {
    init()
}
function newLevel(idx) {
    elSmiley.innerHTML = normalFace
    gAmountOfMines = 0
    elLives.innerHTML = startingLives
    lives = 3
    cellsWithMines = []
    gGame.CellRevealed = -1
    isFirstClick = true
    var level = gLevels[idx]
    resetTimer()
    elBtnRestart.style.display = 'none'
    gCellsToReveal = 0
    gGame.CellRevealed = 0
    gGame.gFlagsMarked = 0
    gGame.isOn = true
    gBoard = createBoard(level.size)
    cellsGenerator(level.size)
    placeMines(level.mines)
    setMinesNegsCount(gBoard)
    printMat(gBoard, '.wrapper')

}

function decreaseLives(num) {
    var strHTML = ''
    for (var i = 0; i < num; i++) {
        strHTML += life
    }
    elLives.innerHTML = strHTML
}