


/**
 * 
 * @returns rows (list of list of td-elements)
 */
function buildGrid() {
    const snakeTable = document.getElementById("snake-table");
    const snakeTableBody = snakeTable.children[0];

    const rows = [];
    const width = 10;
    const height = 15;

    const buttonApple = document.getElementById("button-apple");
    buttonApple.onclick = () => spawnApple(rows);

    for (let y = 0; y < height; y++) {
        
        const tableRow = document.createElement("tr");
        snakeTableBody.appendChild(tableRow);

        const row = [];
        for (let x = 0; x < width; x++) {

            const cell = createCell(x + "-" + y);
            row.push(cell);
            tableRow.appendChild(cell)
        }

        rows.push(row);
        
    }
    return rows;
}

function main() {

    const snakePositions = [[0, 2], [0, 1], [0, 0]];  // a queue
    let direction = "down";
    // let applePosition = [3, 4];
    
    let running = false;
    let intervalId = undefined

    const rows = buildGrid();

    const pauseGame = () => {
        running = false;
        clearInterval(intervalId);
    }


    const loseGame = () => {
        console.log("Game Over");
        pauseGame()
    }

    const unpauseGame = () => {
        running = true;
        intervalId = setInterval(() => {
            moveSnake(rows, snakePositions, direction, false, loseGame);
        }, 500)
    }

    const moveLeft = () => { if (direction !== "right") direction = "left"; };
    const moveDown = () => { if (direction !== "up") direction = "down"; };
    const moveUp = () => { if (direction !== "down") direction = "up"; };
    const moveRight = () => { if (direction !== "left") direction = "right"; };
    const playPause = () => { if (running) pauseGame(); else unpauseGame(); };
    snakePositions.forEach(position => rows[position[1]][position[0]].classList.add("snake-cell-snake"));

    document.getElementById("button-move").onclick = () => moveSnake(rows, snakePositions, direction, true, loseGame);

    document.getElementById("button-control-left").onclick = moveLeft;
    document.getElementById("button-control-down").onclick = moveDown;
    document.getElementById("button-control-up").onclick = moveUp;
    document.getElementById("button-control-right").onclick = moveRight;

    document.getElementById("button-play-pause").onclick = playPause;

    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "ArrowLeft":
            case "KeyA":
            case "KeyJ":
            case "Numpad4":
                moveLeft();
                break;
            case "ArrowRight":
            case "KeyD":
            case "KeyL":
            case "Numpad6":
                moveRight();
                break;
            case "ArrowUp":
            case "KeyW":
            case "KeyI":
            case "Numpad8":
                moveUp();
                break;
            case "ArrowDown":
            case "KeyS":
            case "KeyK":
            case "Numpad2":
                moveDown();
                break;
            case "Escape":
            case "Space":
                playPause();
                break;
            default:
                break;
        }
    })
}

/**
 * 
 * @param {Array} rows 
 * @param {Array} snakePositions 
 * @param {string} direction 
 * @param {boolean} extendSnake 
 * @param {function} loseGame called when game is lost, snake goes in wall or itself
 */
function moveSnake(rows, snakePositions, direction, extendSnake, loseGame) {
    const [currentX, currentY] = snakePositions[0];  // head of snake
    let nextX = currentX;
    let nextY = currentY;
    switch (direction) {
        case "down":
            nextY = currentY + 1;
            break;
        case "left":
            nextX = currentX - 1;
            break;
        case "right":
            nextX = currentX + 1;
            break;
        case "up":
            nextY = currentY - 1;
            break;
    }
    snakePositions.unshift([nextX, nextY]);
    const row = rows[nextY];
    if (row === undefined) {
        loseGame();
    } else {
        const cell = row[nextX];
        if (cell === undefined){
            loseGame();
        } else {
            cell.classList.add("snake-cell-snake");
            if (!extendSnake) {
                const [tailX, tailY] = snakePositions.pop()
                rows[tailY][tailX].classList.remove("snake-cell-snake");
            }
        }
    }

}


/**
 * 
 * @param {String} id 
 * @returns table cell (td)
 */
function createCell(id) {
    const tableCell = document.createElement("td")
    tableCell.id = id;
    tableCell.classList.add("snake-cell");
    tableCell.innerText = id;
    return tableCell;
}

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {Array} snakePositions 
 */
function makeApplePosition(width, height, snakePositions) {
    
}

function spawnApple(rows) {
    // const rows = [[document.createElement("td")], []];
    const height = rows.length;
    const width = rows[0].length;

    let randX = Math.floor(Math.random() * width);
    let randY = Math.floor(Math.random() * height);

    do {
        console.log(randX, randY);
    } while(false);

    rows[randY][randX].classList.add("snake-cell-apple");

}


main();
