document.addEventListener("DOMContentLoaded", init);

function init() {
    window.gameOfLife = new GameOfLife();
    window.gameOfLife.draw();
}

class GameOfLife {
    constructor() {
        this.arrFields = [];
        this.size = 5;
        this.width = 100;
        this.height = 100;
        this.timeInterval = 100;
        this.canvas = document.getElementById("game-of-life");
        this.canvas.width = this.width * this.size;
        this.canvas.height = this.height * this.size;
        if (this.canvas.getContext) {
            this.ctx = this.canvas.getContext("2d");
        }
        this.timerId = null;
        this.tempArrFields = [];
    }

    draw() {
        this.width = document.getElementById("game-of-life-width").value;
        this.height = document.getElementById("game-of-life-height").value;
        this.canvas.width = this.width * this.size;
        this.canvas.height = this.height * this.size;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


        for (let i = 0; i < this.height; i++) {
            this.arrFields[i] = [];
            for (let j = 0; j < this.width; j++) {
                if (Math.random() > 0.5) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect (j * this.size, i * this.size, this.size, this.size);
                    this.arrFields[i][j] = 1;
                } else {
                    this.ctx.fillStyle = "black";
                    this.ctx.strokeRect(j * this.size, i * this.size, this.size, this.size);
                    this.arrFields[i][j] = 0;
                }
            }
        }
    }

    start() {
        let that = this;
        this.timerId = setInterval(function() {
            let tempArrFields = [];
            for (let i = 0; i < that.height; i++) {
                tempArrFields[i] = that.arrFields[i].slice();
                for (let j = 0; j < that.width; j++) {
                    let count = that.getLifeNeighbors(i, j);

                    if (that.arrFields[i][j] && count !== 2 && count !== 3) {
                        that.ctx.clearRect(j * that.size, i * that.size, that.size, that.size);
                        that.ctx.fillStyle = "black";
                        that.ctx.strokeRect (j * that.size, i * that.size, that.size, that.size);
                        tempArrFields[i][j] = 0;
                    } else if (!that.arrFields[i][j] && count === 3) {
                        that.ctx.fillStyle = "black";
                        that.ctx.fillRect(j * that.size, i * that.size, that.size, that.size);
                        tempArrFields[i][j] = 1;
                    }
                }
            }
            for (let i = 0; i < that.height; i++) {
                that.arrFields[i] = tempArrFields[i].slice();
            }
        } , this.timeInterval);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }

    getLifeNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                let m = x + i;
                let n = y + j;
                if (m < 0) {
                    m = this.height - 1;
                } else if (m >= this.height) {
                    m = 0
                }
                if (n < 0) {
                    n = this.width - 1;
                } else if (n >= this.width) {
                    n = 0
                }
                if (this.arrFields[m][n]) {
                    count++;
                    if (count > 3) {
                        return 4;
                    }
                }
            }
        }
        return count;
    }

    test1() {
        this.size = 15;
        this.width = 15;
        this.height = 10;
        this.timeInterval = 2000;
        this.canvas.width = this.width * this.size;
        this.canvas.height = this.height * this.size;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arrFields = [];

        for (let i = 0; i < this.height; i++) {
            this.arrFields[i] = [];
            for (let j = 0; j < this.width; j++) {
                if (
                    (i === 4 && j === 4) ||
                    (i === 3 && j === 4) ||
                    (i === 5 && j === 4)
                ) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect (j * this.size, i * this.size, this.size, this.size);
                    this.arrFields[i][j] = 1;
                } else {
                    this.ctx.fillStyle = "black";
                    this.ctx.strokeRect(j * this.size, i * this.size, this.size, this.size);
                    this.arrFields[i][j] = 0;
                }
            }
        }
    }
}
