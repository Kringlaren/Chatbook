import {Player} from "./player.js";
import {Zombie} from "./zombie.js";
import {Maze} from "./maze.js";

const maxlives = 3;
const multiplierAddage = 0.2;
const speedIncrease = 1.05;
const startingZomieCount = 3;
const coinsUntilIntense = 8;

const Feature = {
    Floor: 0,
    Wall: 1,
    Coin: 2,
    InfestedCoin: 3,
    Outside: -1
}

let width = 3*window.innerWidth/4;
let height = 3*window.innerWidth/8;

let ctx;
let cellSize = height/10;

let player;
let zombies;
let maze;
let coins = 0;
let lives = maxlives;
let points = 0;
let pointsMultiplyer = 1.0;

let lastTimestamp;

let stats;
let pb = 0;

let zombieChance = 40;

const Colors = {
    wall: "#333",
    floor: "#555",
    coin: "#FF0",
    zombie: "#00BC10",
    player: "#e0ac69"
}

let keys = {};

let end = false;
export function endGame() {
    end = true;
}

//Körs vid uppstart
export function boot(canvas, bootStats, bootKeys){

    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext("2d");

    stats = bootStats;
    stats.lives.value = maxlives;
    keys = bootKeys;

    pb = stats.pb.value;

    // om saker kvarstår
    ctx.clearRect(0, 0, width, height);
    zombies = [];
    lastTimestamp = 0;
    end = false;

    player = new Player(width/2, height - 1.5 * height/10, Colors, cellSize);
    maze = new Maze(width, height, ctx, player, Colors);

    maze.drawMaze();
    player.drawPlayer(ctx);

    addZombies(startingZomieCount);

    requestAnimationFrame(process);
}


function process(timestamp) {
    if (!lastTimestamp || timestamp - lastTimestamp > 1000) {
        lastTimestamp = timestamp;
    }

    let delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, width, height);

    maze.drawMaze();

    playerInput(delta);
    checkZombieCollision();
    checkCoinCollision();

    player.drawPlayer(ctx);
    zombies.forEach(zombie => {
        zombie.move(ctx, player, delta);
    });

    if (!end) {
        requestAnimationFrame(process);
    }
}

function playerInput(delta){
    let speed = player.speed * delta/1000;
    if (keys["w"] || keys["ArrowUp"]) {
        player.y -= speed;
        if (checkCollision() === Feature.Wall) {player.y += speed};
        if (checkCollision() === Feature.Outside) {player.y = height};
    }
    if (keys["s"] || keys["ArrowDown"]) {
        player.y += speed;
        if (checkCollision() === Feature.Wall) {player.y -= speed};
        if (checkCollision() === Feature.Outside) {player.y = 0};
    }
    if (keys["a"] || keys["ArrowLeft"]) {
        player.x -= speed;
        if (checkCollision() === Feature.Wall) {player.x += speed};
        if (checkCollision() === Feature.Outside) {player.x = width};
    }
    if (keys["d"] || keys["ArrowRight"]) {
        player.x += speed;
        if (checkCollision() === Feature.Wall) {player.x -= speed};
        if (checkCollision() === Feature.Outside) {player.x = 0};
    }
}

function restart() {
    if (lives > 0) {
        lives--;
    } else {
        if (points > pb) {
            stats.pb.value = points;
            pb = points;
        }
        stats.lastScore.value = points;

        lives = maxlives;
        points = 0;
    }
    coins = 0;
    pointsMultiplyer = 1;

    updateStats();

    player = null;
    player = new Player(width/2, height - 1.5*cellSize, Colors, cellSize);

    maze = null;
    maze = new Maze(width, height, ctx, player, Colors);

    zombies = [];
    addZombies(3);
}

function updateStats() {
    stats.coins.value = coins;
    stats.pointsMultiplier.value = Math.round(pointsMultiplyer*10)/10;
    stats.lives.value =  lives;
    stats.points.value = points;
}

//kollar om spelaren är i labyrinten och sedan om någon av cellerna man är i är vägg, 1 = collision, 0 inte collision, -1 utanför labyrint
function checkCollision() {
    let cells = player.getCells();
    let cellUp = cells[0];
    let cellRight = cells[1];
    let cellDown = cells[2];
    let cellLeft = cells[3];


    if (maze.maze[cellUp[1]] && maze.maze[cellUp[1]][cellUp[0]] === Feature.Wall ||
        maze.maze[cellRight[1]] && maze.maze[cellRight[1]][cellRight[0]] === Feature.Wall ||
        maze.maze[cellDown[1]] && maze.maze[cellDown[1]][cellDown[0]] === Feature.Wall ||
        maze.maze[cellLeft[1]] && maze.maze[cellLeft[1]][cellLeft[0]] === Feature.Wall)
    {
        return 1;
    }
    
    if (player.x < 0 || player.x > width || player.y < 0 || player.y > height) {
        return -1
    }
    
    return 0;
}
function checkCoinCollision() {
    let coinPositions = maze.coinPositions;
    coinPositions.forEach(coin => {
        let coinX = coin[0]*cellSize + cellSize/2;
        let coinY = coin[1]*cellSize + cellSize/2;

        let dx = player.x - coinX;
        let dy = player.y - coinY;
        let distanceSquared = dx*dx+dy*dy;
        let radiiSquared = (player.radius + maze.coinRadius) * (player.radius + maze.coinRadius);

        if (distanceSquared < radiiSquared) {
            coins++;
            points += Math.round(100 * pointsMultiplyer);

            if (maze.maze[coin[1]][coin[0]] === Feature.InfestedCoin) {
                let r = Math.floor(Math.random()*100);
                if (r < zombieChance) {
                    addZombies(1);
                }
                
                pointsMultiplyer += multiplierAddage;
            }

            if (coins % coinsUntilIntense == 0){  //Lägger till ett mynt och ökar hastigheten
                maze.updateCoins(coin[0], coin[1], 2);
                player.speed = player.speed * speedIncrease;
                zombies.forEach(zombie => {
                    zombie.speed = zombie.speed * speedIncrease;
                });
            } else{
                maze.updateCoins(coin[0], coin[1], 1);
            }

            updateStats();
        }
    });
}
function checkZombieCollision() {
    zombies.forEach(zombie => {
        let dx = player.x - zombie.x;
        let dy = player.y - zombie.y;
        let distanceSquared = dx * dx + dy * dy;
        let radiiSquared = (player.radius + zombie.radius) * (player.radius + zombie.radius);

        if (distanceSquared < radiiSquared) {
            restart();
        }
    });
}

function addZombies(amount) {
    let cellsFound = false;
    let iteration = 0;
    while (!cellsFound && amount > 0 && iteration < 1000) {
        let cellX = Math.floor(Math.random() * maze.maze[0].length);
        let cellY = Math.floor(Math.random() * maze.maze.length);
        let x = cellX * cellSize + cellSize/2;
        let y = cellY * cellSize + cellSize/2;

        if (maze.maze[cellY][cellX] !== 1) {
            let canPlace = true;

            if (Math.abs(x - player.x) <= 5*cellSize && Math.abs(y - player.y) <= 5*cellSize && iteration < 800) { //Om zombien är tillräckligt långt ifrån spelaren
                canPlace = false;
            }
            
            if (canPlace) {
                let zombie = new Zombie(x, y, maze, Colors, player.speed/2);
                zombies.push(zombie);
                amount--; 
            }
        }
        iteration++; //Undvik oändlig loop
        if (iteration == 999) {
            console.log("för många försök i addZombies");
        }
    }
}

export function resizeGame(canvas) {
    let oldWidth = width;
    let oldHeight = height;

    width = 3*window.innerWidth/4;    
    height = 3*window.innerWidth/8;

    cellSize = height/10;
    canvas.width = width;
    canvas.height = height;

    maze.resize(width, height);
    player.resize(width, height, oldWidth, oldHeight);
    zombies.forEach(zombie => {
        zombie.resize(width, height, oldWidth, oldHeight, player.speed/2);
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
