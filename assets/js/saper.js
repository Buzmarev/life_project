document.addEventListener("DOMContentLoaded", init);

function init() {
    window.saper = new Saper();
    window.saper.draw();
}

class Saper {
    constructor() {
        this.arrFields = [];
        this.checkedPoints = {};
        this.markedPoints = {};
        this.size = 15;
        this.width = 20;
        this.height = 20;
        this.bombCount = 100;
        this.numberEnum = {
            1: 'blue',
            2: 'orange',
            3: 'red',
            4: 'green',
            5: 'aqua',
            6: 'magenta',
            7: 'teal',
            8: 'brown'
        };
        this.isGameOver = false;
        this.canvas = document.getElementById("saper");
        this.canvas.width = this.width * this.size;
        this.canvas.height = this.height * this.size;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext("2d");
        }
    }

    draw() {
        this.checkedPoints = {};
        this.markedPoints = {};
        this.isGameOver = false;
        this.width = document.getElementById("saper-width").value;
        this.height = document.getElementById("saper-height").value;
        this.bombCount = document.getElementById("saper-bomb-count").value;
        this.canvas.width = this.width * this.size;
        this.canvas.height = this.height * this.size;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.height; i++) {
            this.arrFields[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.arrFields[i][j] = 0;

                let x = j * this.size;
                let y = i * this.size;

                let lingrad = this.ctx.createLinearGradient(x, y, x + this.size, y +this.size);
                lingrad.addColorStop(1, 'gray');
                lingrad.addColorStop(0, '#fff');
                this.ctx.fillStyle = lingrad;
                this.ctx.fillRect (x, y, this.size, this.size);
                this.ctx.strokeStyle = "black";
                this.ctx.strokeRect (x, y, this.size, this.size);
            }
        }
        for (let i = 0; i < this.bombCount; i++) {
            this.generateRandomPoint();
        }
    }

    generateRandomPoint() {
        let isSuccess = false;
        while (!isSuccess) {
            let i = Math.floor(Math.random() * this.height);
            let j = Math.floor(Math.random() * this.width);
            if (!this.arrFields[i][j]) {
                this.arrFields[i][j] = 1;
                isSuccess = true;
            }
        }
    }

    checkPoint(event) {
        if (this.isGameOver) {
            return;
        }
        const indexX = Math.floor(event.offsetX / this.size);
        const indexY = Math.floor(event.offsetY / this.size);
        if (this.arrFields[indexY][indexX]) {
            this.getBlindingFlash(indexX, indexY);
        } else {
            this.checkNeighbors(indexX, indexY);
        }
    }

    markPoint(event) {
        event.preventDefault();
        const indexX = Math.floor(event.offsetX / this.size);
        const indexY = Math.floor(event.offsetY / this.size);
        if (this.isGameOver || (this.checkedPoints.hasOwnProperty(indexX) && this.checkedPoints[indexX].indexOf(indexY) !== -1)) {
            return;
        }
        let x = indexX * this.size;
        let y = indexY * this.size;
        this.ctx.clearRect(x, y, this.size, this.size);
        let lingrad = this.ctx.createLinearGradient(x, y, x + this.size, y + this.size);
        if (this.markedPoints.hasOwnProperty(indexX) && this.markedPoints[indexX].indexOf(indexY) !== -1) {
            lingrad.addColorStop(1, 'gray');
            this.markedPoints[indexX].splice(this.markedPoints[indexX].indexOf(indexY),1);
        } else {
            lingrad.addColorStop(1, 'orange');
            if (this.markedPoints.hasOwnProperty(indexX)) {
                this.markedPoints[indexX].push(indexY);
            } else {
                this.markedPoints[indexX] = [indexY];
            }
        }
        lingrad.addColorStop(0, '#fff');
        this.ctx.fillStyle = lingrad;
        this.ctx.fillRect(x, y, this.size, this.size);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect(x, y, this.size, this.size);
    }

    getBlindingFlash(indexX, indexY) {
        this.isGameOver = true;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.arrFields[i][j]) {
                    this.ctx.clearRect(j * this.size, i * this.size, this.size, this.size);
                    this.ctx.strokeStyle = "black";
                    this.ctx.strokeRect (j * this.size, i * this.size, this.size, this.size);
                    let gradX = j * this.size + this.size / 2;
                    let gradY = i * this.size + this.size / 2;
                    let gradient = this.ctx.createRadialGradient(gradX,gradY,this.size / 10, gradX,gradY,this.size / 2);
                    if (i === indexY && j === indexX) {
                        gradient.addColorStop(0, 'red');
                    } else {
                        gradient.addColorStop(0, 'grey');
                    }

                    gradient.addColorStop(1, 'white');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(j * this.size, i * this.size, this.size, this.size);
                }
            }
        }
    }

    checkNeighbors(indexX, indexY) {
        let count = 0;
        let x, y;
        let coord = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                x = indexX + i;
                y = indexY + j;
                if (
                    (i === 0 && j === 0) ||
                    x < 0 ||
                    y < 0 ||
                    x >= this.width ||
                    y >= this.height ||
                    (this.checkedPoints.hasOwnProperty(x) && this.checkedPoints[x].indexOf(y) !== -1)
                ) {
                    continue;
                }
                coord.push([x, y]);
                if (this.arrFields[y][x]) {
                    count++;
                }
            }
        }
        if (!this.checkedPoints.hasOwnProperty(indexX) || this.checkedPoints[indexX].indexOf(indexY) === -1) {
            if (this.checkedPoints.hasOwnProperty(indexX)) {
                this.checkedPoints[indexX].push(indexY);
            } else {
                this.checkedPoints[indexX] = [indexY];
            }
        }
        this.ctx.clearRect(indexX * this.size, indexY * this.size, this.size, this.size);
        this.ctx.strokeStyle = "black";
        this.ctx.strokeRect (indexX * this.size, indexY * this.size, this.size, this.size);
        if (count) {
            this.ctx.font = '15px serif';
            this.ctx.fillStyle = this.numberEnum[count];
            this.ctx.fillText(count, indexX * this.size + 3, indexY * this.size + 13);
        } else {
            for (let item of coord) {
                this.checkNeighbors(item[0], item[1]);
            }
        }
    }
}
