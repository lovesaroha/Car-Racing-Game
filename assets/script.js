"use-strict";
/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// Themes.
const themes = [
    {
        normal: "#5468e7",
        dark: "#4c5ed0",
        light: "#98a4f1",
        veryLight: "#eef0fd"
    }, {
        normal: "#e94c2b",
        dark: "#d24427",
        veryLight: "#fdedea",
        light: "#f29480"
    }
];


// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
    // Change css values.
    document.documentElement.style.setProperty("--primary", colorTheme.normal);
}

// Set random theme.
setTheme();

// Define default values.
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
let road = [];
let roadCurve = 0;
let straightBlocks = 0;
let turnBlocks = 0;
let turnLeft = false;
let turnRight = false;
let count = 0;
let gameStarted = false;
let maxDistance = 0;
let totalBlocks = 0;
let speed = 10;

// Car object defined.
class Car {
    constructor() {
        this.x = 450;
        this.y = 500;
    }

    // This function shows car on canvas.
    show() {
        ctx.beginPath();
        ctx.font = '300 100px "Font Awesome 5 Pro"';
        ctx.fillStyle = colorTheme.normal;
        ctx.textAlign = 'center';
        ctx.fillText("\uf1b9", this.x, this.y);
    }

    // Move car function.
    move() {
        if (turnLeft) {
            this.x -= 5;
        }
        if (turnRight) {
            this.x += 5;
        }
        if (gameStarted) {
            if (this.x < road[53].o + 50 || this.x > road[53].o + 350) {
                resetGame();
            }
            if (road[53].e != false) {
                let dif = Math.abs((this.x) - road[53].e);
                if (dif < 80) {
                    resetGame();
                }
            }
        }
    }
}
let car = new Car();

// Reset game fucntion.
function resetGame() {
    count = 0;
    road = [];
    speed = 10;
    document.getElementById("score_id").innerText = count;
    document.getElementById("speed_id").innerHTML = `0 m/s`;
    gameStarted = false;
    totalBlocks = 0;
    createRoad();
    car = new Car();
}

// Add controls.
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.keyCode == 38) {
        if (gameStarted == true && speed < 20) {
            speed += 5;
        }
        gameStarted = true;
        showSpeed();
    }
    if (e.keyCode == 40) {
        if (gameStarted == true && speed > 10) {
            speed -= 5;
            showSpeed();
        }
    }
    if (gameStarted) {
        if (e.keyCode == 37) {
            turnLeft = true;
            turnRight = false;
        } else if (e.keyCode == 39) {
            turnRight = true;
            turnLeft = false;
        }
    }

});

// Windows key events.
window.addEventListener("keyup", function (e) {
    turnRight = false;
    turnLeft = false;
});

// This function shows speed on board.
function showSpeed() {
    document.getElementById("speed_id").innerHTML = `${speed} m/s`;
}

// Create road function.
function createRoad() {
    let total = canvas.height / 10;
    for (let i = 1; i < total + 1; i++) {
        createRoadBlock(250, i);
    }
}

// Create road block.
function createRoadBlock(offset, i) {
    totalBlocks++;
    let tree = false;
    let element = false;
    let rn = Math.random();
    if (totalBlocks % 15 == 0) {
        if (rn > 0.5) {
            tree = (rn * (500 - offset)) + offset + 400;
        } else {
            tree = (rn * (offset) - 30);
        }
    }
    if (gameStarted && totalBlocks % 30 == 0 && Math.random() > 0.7) {
        let x = (rn * 350) + offset + 50;
        element = x;
    }
    road.unshift({ o: offset, w: 400, b: tree, e: element });
}

// Show road function shows road.
function showRoad() {
    for (let i = 0; i < road.length; i++) {
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(road[i].o, i * speed);
            ctx.lineWidth = 10;
            ctx.lineTo(road[i - 1].o, (i * speed) + speed);
            ctx.strokeStyle = colorTheme.normal;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(road[i].o + 400, i * speed);
            ctx.lineWidth = 10;
            ctx.lineTo(road[i - 1].o + 400, (i * speed) + speed);
            ctx.strokeStyle = colorTheme.normal;
            ctx.stroke();
        }
        if (road[i].b != false) {
            ctx.beginPath();
            ctx.font = '300 52px "Font Awesome 5 Pro"';
            ctx.fillStyle = colorTheme.normal;
            ctx.textAlign = 'center';
            ctx.fillText("\uf400", road[i].b, i * speed);
        }
        if (road[i].e != false) {
            ctx.beginPath();
            ctx.font = '300 52px "Font Awesome 5 Pro"';
            ctx.fillStyle = colorTheme.normal;
            ctx.textAlign = 'center';
            ctx.fillText("\uf2fc", road[i].e, i * speed);
        }
    }
}

// Update road function update road.
function updateRoad() {
    let r = Math.random();
    switch (roadCurve) {
        case 0:
            if (straightBlocks < 5) {
                createRoadBlock(road[0].o, straightBlocks);
                road.pop();
                straightBlocks++;
            } else {
                straightBlocks = 0;
                if (r > 0.5 && road[0].o < canvas.width - 500) {
                    roadCurve = 1;
                } else if (road[0].o >= 100) {
                    roadCurve = -1;
                }
            }
            break;
        case 1:
            if (turnBlocks < 80 && road[0].o < (canvas.width - 500)) {
                let offset = road[0].o;
                offset = offset + (turnBlocks / 20);
                createRoadBlock(offset, turnBlocks);
                road.pop();
                turnBlocks++;
            } else {
                turnBlocks = 0;
                roadCurve = 0;
            }
            break;
        case -1:
            if (turnBlocks < 80 && road[0].o > 100) {
                let offset = road[0].o;
                offset = offset - (turnBlocks / 20);
                createRoadBlock(offset, turnBlocks);
                road.pop();
                turnBlocks++;
            } else {
                turnBlocks = 0;
                roadCurve = 0;
            }
            break;
    }
}

createRoad();

// This function shows start.
function showStart() {
    ctx.beginPath();
    ctx.font = '300 62px "Font Awesome 5 Pro"';
    ctx.fillStyle = colorTheme.normal;
    ctx.textAlign = 'center';
    ctx.fillText("\uf04c", 450, 350);
}

draw();
// Draw function defined.
function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    car.show();
    car.move();
    if (gameStarted) {
        updateRoad();
    } else {
        showStart();
    }
    showRoad();
    if (gameStarted) {
        // Update dom elements.
        document.getElementById("score_id").innerText = count;
        if (count > maxDistance) {
            maxDistance = count;
            document.getElementById("maxScore_id").innerText = maxDistance;
        }
        count++;
    }
    window.requestAnimationFrame(draw);
}