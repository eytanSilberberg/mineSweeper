document.addEventListener("contextmenu", function (event) {
    event.preventDefault();

}, false);

function getRandomIntExclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}








////////////////////////////////////////////////////////////////////////////


var gElStopWatch = document.querySelector('.stopwatch') //<div class="stopwatch">0.000</div>
var gTimerInterval
var gStartTime

function timerCycle() {
    var currTime = Date.now()
    var sec = (currTime - gStartTime) / 1000
    sec = sec.toFixed(3)
    gElStopWatch.innerHTML = sec
    gGame.secsPassed = sec
    // console.log(gGame.secsPassed)
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
/////////////////////////////////////////







function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


















// function markCells(coords) {
//     for (var i = 0; i < coords.length; i++) {
//         var coord = coords[i];
//         var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
//         elCell.classList.add('mark')
//     }
// }