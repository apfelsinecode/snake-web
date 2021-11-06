




function main() {

    const snakeTable = document.getElementById("snake-table");
    const snakeTableBody = snakeTable.children[0];

    const rows = [];
    const width = 8;
    const height = 20;

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


}

/**
 * 
 * @param {String} id 
 */
function createCell(id) {
    const tableCell = document.createElement("td")
    tableCell.id = id;
    tableCell.classList.add("snake-cell");
    tableCell.innerText = id;
    return tableCell;
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
