


/**
 * 
 * @returns rows (list of list of td-elements)
 */
function buildGrid() {
    const snakeTable = document.getElementById("snake-table");
    const snakeTableBody = snakeTable.children[0];

    const rows = [];
    const width = 10;
    const height = 10;

    snakeTableBody.textContent = "";

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

    const rows = buildGrid();

    const snakePositions = [[0, 2], [0, 1], [0, 0]];  // a queue

    let lastDirection = "down";
    let direction = "down";

    let points = 0;

    let [appleX, appleY] = calcApplePosition(rows[0].length, rows.length, snakePositions);

    let running = false;
    let gameEnded = false;

    const resetGame = () => {
        rows.splice(0, rows.length)
        rows.push(...buildGrid());

        while (snakePositions.length > 0) {
            snakePositions.pop();
        }
        snakePositions.push([0, 2], [0, 1], [0, 0]);
        lastDirection = "down";
        direction = "down";
        points = 0;
        [appleX, appleY] = calcApplePosition(rows[0].length, rows.length, snakePositions);
        running = false;
        gameEnded = false;

        rows[appleY][appleX].classList.add("snake-cell-apple");
        snakePositions.forEach(position => rows[position[1]][position[0]].classList.add("snake-cell-snake"));

        document.getElementById("points-display").innerHTML = `${points}`;
    };

    let intervalId = undefined;

    rows[appleY][appleX].classList.add("snake-cell-apple");
    snakePositions.forEach(position => rows[position[1]][position[0]].classList.add("snake-cell-snake"));

    const pauseGame = () => {
        running = false;
        clearInterval(intervalId);
    };


    const loseGame = () => {
        pauseGame();
        gameEnded = true;
    };

    const eatApple = () => {
        rows[appleY][appleX].classList.remove("snake-cell-apple");
        [appleX, appleY] = calcApplePosition(rows[0].length, rows.length, snakePositions);
        rows[appleY][appleX].classList.add("snake-cell-apple");
        points++;
        document.getElementById("points-display").innerHTML = `${points}`;
    };


    const unpauseGame = () => {
        if (gameEnded) {
            resetGame();
        } else {
            running = true;
            intervalId = setInterval(() => {
                moveSnake(rows, snakePositions, direction, loseGame, eatApple);
                lastDirection = direction;
            }, 350)
        }
    }

    const moveLeft = () => { if (lastDirection !== "right") direction = "left"; };
    const moveDown = () => { if (lastDirection !== "up") direction = "down"; };
    const moveUp = () => { if (lastDirection !== "down") direction = "up"; };
    const moveRight = () => { if (lastDirection !== "left") direction = "right"; };
    const playPause = () => { if (running) pauseGame(); else unpauseGame(); };


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
 * @param {function} loseGame called when game is lost, snake goes in wall or itself
 */
function moveSnake(rows, snakePositions, direction, loseGame, eatApple) {
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
            if (cell.classList.contains("snake-cell-snake")) {
                loseGame();
            } else if (cell.classList.contains("snake-cell-apple")) {
                eatApple();
            } else {
                const [tailX, tailY] = snakePositions.pop();
                rows[tailY][tailX].classList.remove("snake-cell-snake");
            }
            cell.classList.add("snake-cell-snake");
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
function calcApplePosition(width, height, snakePositions) {
    const candidates = []
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            candidates.push([x, y]);
        }
    }
    loop:
    while (candidates.length > 0) {
        const r = Math.floor(Math.random() * candidates.length);
        const [rx, ry] = candidates[r];
        for (let snakePosition of snakePositions) {
            // if apple is in snake, try again
            const [snakeX, snakeY] = snakePosition;
            if (rx === snakeX && ry === snakeY) {
                // invalid apple position
                candidates.splice(r, 1);
                continue loop;
            }
        }
        return candidates[r];
    }
}


main();
