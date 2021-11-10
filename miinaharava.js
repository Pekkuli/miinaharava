
var modal = document.getElementById("WinLoseScreen");




function loadGame(width, height, mines) {
	console.log(`Loading game! Width: ${width} Height: ${height} Mines: ${mines}`)
	clearInterval(this.timer); //clear old timers
	this.board = Array.from(Array(height).fill(10), () => Array.from(Array(width), () => 10)); 
	this.width = width;
	this.height = height;
	this.mines = mines;
	this.remainingCells = width*height;
	this.gameStarted = false;
	this.gameEnded = false;
	
	// check the given mineCount parameter if more mines than cells in game --> mineCount=cells-1
	if (mines >= remainingCells) {
		this.mineCount = remainingCells - 1;
	} else {
		this.mineCount = mines;
	}

	var tbl = document.getElementById("game");
	tbl.innerHTML = "";
	
	//set time and flagcount
	var time = document.getElementById("clock");
	time.time_internal = 0;
	time.innerHTML = "00:00";
	var flags = document.getElementById("flag-counter");
	flags.innerHTML = this.mineCount;
	
	for (y = 0; y < height; y++) {
		var tr = document.createElement('tr');
		for (x = 0; x < width; x++) {
			var td = document.createElement('td');
			var img = createImage(x, y);

			td.appendChild(img);
			tr.appendChild(td);
		}
		tbl.appendChild(tr);
	}
}

function startGame(mouseX, mouseY) {
	console.log(`Starting game! (${mouseX},${mouseY})`)
	
	this.gameStarted = true;
	layMines(mouseX, mouseY);
	this.timer = setInterval(updateTime, 1000);
}

function layMines(mouseX, mouseY) {
	var count = 0;

	while (count < this.mineCount) {
		var x = Math.floor(Math.random() * (width));
		var y = Math.floor(Math.random() * (height));
		if (x != mouseX && y != mouseY) { //skip the original cell
			if (this.board[y][x] == 10) { // check that the cell is not already a mine
				this.board[y][x] = 19;
				count++;
}}}}

function resetGame() {
	loadGame(this.width, this.height, this.mines);
}

function createImage(x, y) {
	var img = document.createElement('IMG');
	//img.setAttribute('X', x);
	//img.setAttribute('Y', y);
	img.onclick = function () { leftClickCell(x, y) };
	img.oncontextmenu = function () { rightClickCell(x, y) };

	img.src = imagePath(this.board[y][x]);
	return img;
}

function updateImage(x, y) {
	var tbl = document.getElementById("game");
	var img = tbl.rows[y].cells[x].childNodes[0];
	img.src = imagePath(this.board[y][x]);
}

function imagePath(value) {
	var root = "resources/images/";
	var path = "";
	if (value > 19) {
		path = "resources/images/MARKED.png";
	} else if (value >= 10 || value == -1) {
		path = "resources/images/10.png";
	} else {
		path = root.concat(value, ".png");
	}
	return path;
}

function leftClickCell(x, y) {
	
	if (!this.gameEnded){
		var cell = this.board[y][x];
		if (cell < 20 && cell >= 10) {
			console.log(`Cell(${x},${y}) was left clicked!`);
			if (!gameStarted) {
				startGame(x, y);
			}
			if (cell == 19) {
				console.log(`Game lost! Mine was clicked at (${x},${y})!`);
				loseGame();
			} else {
				if (adjacentMineCount(x,y) == 0) {
					this.board[y][x] = 0;
					openAdjacentCells(x, y);
				} else {
					this.board[y][x] = adjacentMineCount(x,y);
				}
				this.remainingCells--;
				updateImage(x, y);
				checkWinCondition();
			}
		}
	}
}

function rightClickCell(x, y) {
	if (!this.gameEnded){
		var cell = this.board[y][x];
		if (cell > 19) {
			console.log(`Cell(${x},${y}) was right clicked!`);
			changeFlagCount(1);
			this.board[y][x] = cell - 10;
			updateImage(x, y);
		} else if (cell < 20 && cell >= 10) {
			console.log(`Cell(${x},${y}) was right clicked!`);
			changeFlagCount(-1);
			//decreaseFlagCount();
			this.board[y][x] = cell + 10;
			updateImage(x, y);
		}
	}
}

function adjacentMineCount(x,y) {
	var count = 0;
	for (i = -1; i < 2; i++) {
		for (j = -1; j < 2; j++) { 
			// check that checked coordinates are inside of the game area
			if ((x + i >= 0 && x + i < width && y + j >= 0 && y + j < height)) {
				if (!((x + i) == x && (y + j) == y)) {	//dont check the original cell
					if (this.board[y+j][x+i]%10 ==9) { 	// if cell is a mine
						count++;
	}}}}}
	return count;
}

function openAdjacentCells(x, y) {
	for (var i = -1; i < 2; i++) { 
		for (var j = -1; j < 2; j++) { 
			// check that checked coordinates are inside of the game area
			if ((x + i >= 0 && x + i < width && y + j >= 0 && y + j < height)) {
				//dont check the original cell
				if (!((x + i) == x && (y + j) == y)) {
					leftClickCell(x+i,y+j);
				}
			}	
		}
	}
}

function checkWinCondition() {
	if (this.remainingCells <= this.mineCount) {
		clearInterval(timer);  //clear old timers
		var time = document.getElementById("clock").time_internal;
		//alert("Voitit pelin! \nAikasi oli "+parseTime(time)+"!");
		//resetGame()
		var text = "Voitit pelin! \nAikasi oli "+parseTime(time)+"!";
		document.getElementById("WinLoseStatus").innerHTML = text;
		modal.style.display = "block";
	}	
}

function openRemainingCells(x, y) {
	
}

function loseGame() {
	clearInterval(this.timer); //clear old timers
	this.revealMines();
	this.gameEnded = true;
	modal.style.display = 'block'
	//this.resetGame();
}

function updateTime() {
	var timer = document.getElementById("clock");
	timer.time_internal = timer.time_internal+1;
	var time = parseTime(timer.time_internal);
	timer.innerHTML = time;
}

function changeFlagCount(value) {
	var flags = document.getElementById("flag-counter");
	flags.innerHTML = parseInt(flags.innerHTML)+value;
}

function revealAll() {
	if (!gameStarted) {
		startGame(0, 0);
	}
	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			if (this.board[y][x]%10 == 9) {
				this.board[y][x] = 9;
			} else {
				this.board[y][x] = adjacentMineCount(x,y);
			}
			updateImage(x,y);
		}
	}
}

function revealMines() {
	if (!gameStarted) {
		startGame(0, 0);
	}
	clearInterval(timer);
	for (x = 0; x < width; x++) {
		for (y = 0; y < height; y++) {
			if (this.board[y][x]%10 == 9) {
				this.board[y][x] = 9;
				updateImage(x,y);
			}
		}
	}
}

function parseTime(time) {
	time = parseInt(time);
	minutes = parseInt(time / 60, 10);
	seconds = parseInt(time % 60, 10);
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	return minutes+":"+seconds;
}