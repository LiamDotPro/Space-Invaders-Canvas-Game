//-------------------------------------------------------Canvas Content + Setup--------------------------------------------------------------------------------
// Canvas Call's and Appending the canvas to the body of the script.
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

//Canvas Dimensions (Global Scope for easy callback's).
canvas.height = 600;
canvas.width = 800;
document.body.appendChild(canvas);

// game objects
var spaceShip = {
    speed: 256,
    x: 375,
    y: 525,
    width: 54,
    height: 18,
    modifier: 0.01,
    score: 0
};

var loadingScreen = {
    state: true,
    running: false,
    Title: "Space Invaders By liam Read",
    SubTitle: "Press any key to continue",
    CanvasDoesntWork: "Canvas does not currentlty work on this browser, Considered Upgrading!",
    gameOver: false
};

// Image loading

//background Img onload call.
var bgready = false
backgroundImg = new Image();

backgroundImg.onload = function () {
    bgready = true;
}
backgroundImg.src = 'images/backgroundimg.png';

//Header Logo onload call.
var Header = false
HeaderImg = new Image();

HeaderImg.onload = function () {
    Header = true;
};
HeaderImg.src = "images/header.png";

//spaceShip Onload + src.
var starShipReady = false;
spaceShipImg = new Image();

spaceShipImg.onload = function () {
    starShipReady = true;
}
spaceShipImg.src = 'images/cannon.png';

//Shot Image Loades
var shot = new Image();
shot.src = "images/shot.png";

//Different Aliens
//These images were not created by myself, Reference Taito Corpiration 
var alien1Img = new Image();
alien1Img.src = "images/alien1.png";

var alien2Img = new Image();
alien2Img.src = "images/alien3.png";

var alien3Img = new Image();
alien3Img.src = "images/alien2z.png";

//-------------------------------------------------------Loading Screen Content--------------------------------------------------------------------------------

//Loading Function's
function loadingReady() {

    if (bgready === true) {
        ctx.drawImage(backgroundImg, 0, 0);
    }
    if (Header === true) {
        ctx.drawImage(HeaderImg, 100, 45);
    }
    loadingTxt(loadingScreen.Title, 400, 300, "26px Arial");
    loadingTxt(loadingScreen.SubTitle, 400, 350, "16px Arial");

    requestAnimationFrame(loadingReady);
};

//Function for both Titles.
function loadingTxt(txt, x, y, size) {
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = size;
    ctx.textAlign = "center";
    ctx.fillText(txt, x, y)
};

reset = function () {
    spaceShip.x = 375;
    spaceShip.y = 525;
};

//-----------------------------------------------------------User Controls + Loading Screen Controls-----------------------------------------------------------------------------------

// Handle keyboard controls
var keysDown = [];

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var stop = false;

var update = function () {
    if (stop === false) {
        if (37 in keysDown) { // Player holding left
            spaceShip.x -= spaceShip.speed * spaceShip.modifier;
        }
        if (39 in keysDown) { // Player holding right
            spaceShip.x += spaceShip.speed * spaceShip.modifier;
        }
        if (32 in keysDown) { // player holding space
            if (bullets.length < 1) {
                var bullet = new Bullet(spaceShip.midpoint().x, spaceShip.midpoint().y, 2, 3, 13);
                bullets.push(bullet);
            }
            if (32 in keysDown) {
                keysDown = [];
            }
        };

        for (var x = 0; x < aliShot.length; x++) {
            aliShot[x].move();
            aliShot[x].move();
            aliShot[x].move();
            aliShot[x].move();
        }

        for (var x = 0; x < AliLength; x++) {
            AliensArrR1[x].move();
            AliensArrR2[x].move();
            AliensArrR3[x].move();
            AliensArrR4[x].move();
        };

        for (var x = 0; x < AliLength; x++) {
            if (AliensArrR1[x].getY() > 500) {
                cancelAnimationFrame(gameLoop);
                stop = true;

            }
            if (AliensArrR2[x].getY() > 500) {
                cancelAnimationFrame(gameLoop);
                stop = true;

            }
            if (AliensArrR3[x].getY() > 500) {
                cancelAnimationFrame(gameLoop);
                stop = true;
            }
            if (AliensArrR4[x].getY() > 500) {
                cancelAnimationFrame(gameLoop);
                stop = true;
            }
        }

        for (var x = 0; x < aliShot.length; x++) {
            if (aliShot.length > 0 && aliShot[x].getY() > 600) {
                aliShot.splice(x, 1);
            }
        }

        for (var x = 0; x < bullets.length; x++) {
            bullets[x].move();
        }

        collisionS();

        for (var x = 0; x < bullets.length; x++) {
            if (bullets.length > 1 || bullets[x].getY() < 0) {
                bullets.splice(0, 1);
            }
        }
    }
    else {
        cancelAnimationFrame(gameLoop);
        clearInterval(IntervalShot);
        ctx.clearRect(0, 0, 800, 600);
        aliShot = [];
        bullets = [];
        LoseGame();
    }

}

function col() {
    for (var x = 0; x < AliLength; x++) {
        AliensArrR1[x].Collision();
        AliensArrR2[x].Collision();
        AliensArrR3[x].Collision();
        AliensArrR4[x].Collision();
    }
};

collisionS = function () {
    for (x = 0; x < aliShot.length; x++) {
        var x1 = spaceShip.x;
        var w1 = spaceShip.width;
        var y1 = spaceShip.y;
        var h1 = spaceShip.height;
        var x2 = aliShot[x].getX();
        var w2 = aliShot[x].getW();
        var y2 = aliShot[x].getY();
        var h2 = aliShot[x].getH();
    }

    if (x1 + w1 >= x2 && x2 + w2 >= x1 && y1 + h1 >= y2 && y2 + h2 >= y1) {
        cancelAnimationFrame(gameloop);
        stop = true;
    }
};

// Any key event which checks for an input from any key pressed down, Clears the interval, Sets Loadingscreen's state to false and removes current graphics
// And then starts the game with a call to the function startgame();
function AnyKeyEvent() {
    document.onkeydown = function (e) {
        if (loadingScreen.state === true) {
            e = e || window.event;
            loadingScreen.state = false;
            ctx.clearRect(0, 0, 800, 600);
            cancelAnimationFrame(loadingReady);
            requestAnimationFrame(gameLoop);
            reset();
            Init();
            setInterval(IntervalShot, 150);
            loadingScreen.running = true;
        }
    }
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var AliensArrR1 = [];
var AliensArrR2 = [];
var AliensArrR3 = [];
var AliensArrR4 = [];
var AliLength = 11;
var rate = 12;

function aliens(src, x, y, width, height, speed, id, draw) {
    this.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0.2;
    this.id = id + 1;
    this.draw = true;
};

function Init() {
    for (var x = 1; x < rate; x++) {
        var alien1 = new aliens(alien1Img, x * 60, 100, 50, 18, 1, true);
        var alien2 = new aliens(alien2Img, x * 60, 125, 50, 18, 1, true);
        var alien3 = new aliens(alien3Img, x * 60, 150, 50, 18, 1, true);
        var alien4 = new aliens(alien1Img, x * 60, 175, 50, 18, 1, true);
        AliensArrR1.push(alien1);
        AliensArrR2.push(alien2);
        AliensArrR3.push(alien3);
        AliensArrR4.push(alien4);
    }
};

aliens.prototype.render = function () {
    if (this.draw === true) {
        ctx.drawImage(this.src, this.x, this.y, this.width, this.height);
    }
};
aliens.prototype.getX = function () {
    return this.x;
};

aliens.prototype.getY = function () {
    return this.y;
};

aliens.prototype.Collision = function () {
    for (var y = 0; y < bullets.length; y++) {
        var x1 = this.x;
        var w1 = this.width;
        var h1 = this.height;
        var y1 = this.y;
        var x2 = bullets[y].getX();
        var y2 = bullets[y].getY();
        var w2 = bullets[y].getW();
        var h2 = bullets[y].getH();
    }

    if (x1 + w1 >= x2 && x2 + w2 >= x1 && y1 + h1 >= y2 && y2 + h2 >= y1) {
        for (var x = 0; x < bullets.length; x++) {
            bullets.splice(x, 1);
        }
        spaceShip.score = spaceShip.score + 10;
        this.draw = false;
        this.x = NaN;
        this.y = NaN;
    }

}

var aliShot = [];
var RngNumber = Math.floor(Math.random() * 11);

function alienShot(x, y, speed, height, width) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.height = height;
    this.width = width;
}

alienShot.prototype.render = function () {
    ctx.drawImage(shot, this.x, this.y);
};

alienShot.prototype.move = function () {
    this.y += this.speed;
};

alienShot.prototype.getY = function () {
    return this.y;
};

alienShot.prototype.getX = function () {
    return this.x;
};

alienShot.prototype.getH = function () {
    return this.height;
};

alienShot.prototype.getW = function () {
    return this.width;
};

function IntervalShot() {

    var RngNumber = Math.floor(Math.random() * 11);
    var RngNumber2 = Math.floor(Math.random() * 11);

    var q = 25;
    var w = 18;
    if (stop === false) {
        if (RngNumber > 9) {
            var shotImg1 = new alienShot(AliensArrR1[RngNumber2].getX() + q, AliensArrR2[RngNumber2].getY() + w, 0.2, 13, 3);
            aliShot.push(shotImg1);
            RngNumber = Math.floor(Math.random() * 11);
            RngNumber2 = Math.floor(Math.random() * 11);
        }
        else if (RngNumber > 7) {
            var shotImg1 = new alienShot(AliensArrR2[RngNumber2].getX() + q, AliensArrR2[RngNumber2].getY() + w, 0.2, 13, 3);
            aliShot.push(shotImg1);
            RngNumber = Math.floor(Math.random() * 11);
            RngNumber2 = Math.floor(Math.random() * 11);
        }

        else if (RngNumber > 5) {
            var shotImg1 = new alienShot(AliensArrR3[RngNumber2].getX() + q, AliensArrR3[RngNumber2].getY() + w, 0.2, 13, 3);
            aliShot.push(shotImg1);
            RngNumber = Math.floor(Math.random() * 11);
            RngNumber2 = Math.floor(Math.random() * 11);
        }
        else if (RngNumber > 3) {
            var shotImg1 = new alienShot(AliensArrR4[RngNumber2].getX() + q, AliensArrR4[RngNumber2].getY() + w, 0.2, 13, 3);
            aliShot.push(shotImg1);
            RngNumber = Math.floor(Math.random() * 11);
            RngNumber2 = Math.floor(Math.random() * 11);
        }

        else {
            RngNumber = Math.floor(Math.random() * 11);
        }
    }
};

var moveRight = '';

aliens.prototype.move = function () {
    var rightIndex = 0;
    var leftIndex = 0;
    var rightIndex2 = 0;
    var leftIndex2 = 0;
    var rightIndex3 = 0;
    var leftIndex3 = 0;
    var rightIndex4 = 0;
    var leftIndex4 = 0;

    var LowestX = 1000;
    for (x = 0; x < AliensArrR1.length; x++) {
        if (AliensArrR1[x].getX() < LowestX) {
            LowestX = AliensArrR1[x].getX();
            leftIndex = LowestX;
        }

    }

    biggestX = 0;
    for (x = 0; x < AliensArrR1.length; x++) {
        if (AliensArrR1[x].getX() > biggestX) {
            biggestX = AliensArrR1[x].getX();
            rightIndex2 = biggestX;
        }

    }

    LowestX = 1000;
    for (x = 0; x < AliensArrR2.length; x++) {
        if (AliensArrR2[x].getX() < LowestX) {
            LowestX = AliensArrR2[x].getX();
            leftIndex2 = LowestX;
        }

    }

    biggestX = 0;
    for (x = 0; x < AliensArrR2.length; x++) {
        if (AliensArrR2[x].getX() > biggestX) {
            biggestX = AliensArrR2[x].getX();
            rightIndex3 = biggestX;
        }

    }

    LowestX = 1000;
    for (x = 0; x < AliensArrR3.length; x++) {
        if (AliensArrR3[x].getX() < LowestX) {
            LowestX = AliensArrR3[x].getX();
            leftIndex3 = LowestX;
        }

    }

    biggestX = 0;
    for (x = 0; x < AliensArrR3.length; x++) {
        if (AliensArrR3[x].getX() > biggestX) {
            biggestX = AliensArrR3[x].getX();
            rightIndex4 = biggestX;
        }

    }

    LowestX = 1000;
    for (x = 0; x < AliensArrR4.length; x++) {
        if (AliensArrR4[x].getX() < LowestX) {
            LowestX = AliensArrR4[x].getX();
            leftIndex4 = LowestX;
        }

    }

    biggestX = 0;
    for (x = 0; x < AliensArrR4.length; x++) {
        if (AliensArrR4[x].getX() > biggestX) {
            biggestX = AliensArrR4[x].getX();
            rightIndex4 = biggestX;
        }

    }

    if (rightIndex > 750 || rightIndex2 > 750 || rightIndex3 > 750 || rightIndex4 > 750) {
        this.y += 40;
        moveRight = false;
    }
    else if (leftIndex < 0 || leftIndex2 < 0 || leftIndex3 < 0 || leftIndex4 < 0) {
        this.y += 40;
        moveRight = true;
    }
    if (moveRight === true) {
        this.x += this.speed;
    }
    else if (moveRight === false) {
        this.x -= this.speed;
    }
    else if (moveRight === '') {
        this.x += this.speed;
    }
};

var bullets = [];

function Bullet(x, y, speed, width, height) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.width = width;
    this.height = height;
};

Bullet.prototype.getX = function () {
    return this.x;
};

Bullet.prototype.getY = function () {
    return this.y;
};

Bullet.prototype.getW = function () {
    return this.width;
};

Bullet.prototype.getH = function () {
    return this.height;
};

Bullet.prototype.move = function () {
    if (bullets.length > 0) {
        this.y -= this.speed;
    }
};

Bullet.prototype.render = function () {
    ctx.drawImage(shot, this.x, this.y);
};

//defining a midpoint for projectile
spaceShip.midpoint = function () {
    return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
    }
};

function playerBounds() {
    //This will check the position of the spaceship and if it hits the boundaries of the canvas will not let it go further.
    var rightBorder = canvas.width - spaceShip.width;
    if (spaceShip.x < 0) {
        spaceShip.x = 0;
    }
    if (spaceShip.x > rightBorder) {
        spaceShip.x = rightBorder;
    }
};

var gamesWon = 0;

var render = function () {
    if (stop === false) {
        if (bgready === true) {
            ctx.drawImage(backgroundImg, 0, 0);
        }

        if (starShipReady === true) {
            ctx.drawImage(spaceShipImg, spaceShip.x, spaceShip.y)
        }

        for (var x = 0; x < bullets.length; x++) {
            bullets[x].render();

        }

        if (aliShot.length > 1) {
            for (x = 0; x < aliShot.length; x++) {
                aliShot[x].render();
                aliShot[x].render();
                aliShot[x].render();
                aliShot[x].render();
            }
        }

        for (var x = 0; x < AliLength; x++) {
            AliensArrR1[x].render();
            AliensArrR2[x].render();
            AliensArrR3[x].render();
            AliensArrR4[x].render();
        }

        //score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Levels Complete: " + gamesWon, 625, 10);
        ctx.fillText("Score: " + spaceShip.score, 15, 10);
    }
};

function recursiveRunning() {
    if (loadingScreen.running === true) {
        requestAnimationFrame(gameLoop);
    }
};

//-------------------------------------------------------Game Over---------------------------------------------------------------------------------------------
function DeathReady() {

    if (bgready === true) {
        ctx.drawImage(backgroundImg, 0, 0);
    }

    if (Header === true) {
        ctx.drawImage(HeaderImg, 100, 45);
    }

    loadingTxt("Your Score: " + spaceShip.score, 370, 300, "36px Arial");
};

//-------------------------------------------------------Game loops and logic------------------------------------------------------------------------------------

Loading();

//Loading Screen Loop
function Loading() {
    if (loadingScreen.state === true) {
        requestAnimationFrame(loadingReady);
        loadingReady();
        AnyKeyEvent();
    }
    else if (canvas === null) {
        var txtbox = document.createElement("textbox");
        var text = document.createTextNode(loadingScreen.CanvasDoesntWork);
        txtbox.appendChild(text);
    }
};

//Game Loop
function gameLoop() {
    update();
    render();
    playerBounds();
    recursiveRunning();
    col();
};

//Game Over Loop
function LoseGame() {
    AnyKeyEvent();
    DeathReady();
    requestAnimationFrame(LoseGame);
};