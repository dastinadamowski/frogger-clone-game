/*------------->>>> ENEMY class configuration <<<<----------------*/

// Enemies that our player must avoid
var Enemy = function(x, y, speed) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.speed = speed;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt;
  // Reset the enemy with a new speed after it goes off screen
  this.offScreenX = 505;
  this.startingX = -100;
  if (this.x >= this.offScreenX) {
    this.x = this.startingX;
    this.randomSpeed();
  }
  this.checkCollision();
};

// increases this value in order to increase the overall game difficulty
var speedMultiplier = 40;

// generator adjusts random speed settings
Enemy.prototype.randomSpeed = function() {
  // here speed is a random number from 1 to 10 multiplied by the speedMultiplier factor
  this.speed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
};

// Draw the enemy on the screen, required method for game
// Draw the scoreboard on the screen, credit
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.fillStyle = "white";
  ctx.font = "16px Pristina";
  ctx.fillText("Score: " + player.playerScore, 40, 70);
  ctx.fillText("Lives: " + player.playerLives, 141, 70);
  ctx.fillText("Difficulty: " + speedMultiplier, 260, 70);
};

// function that checks for collision with enemies by 'hit boxes'
Enemy.prototype.checkCollision = function() {
  var playerBox = {
    x: player.x,
    y: player.y,
    width: 50,
    height: 40
  };
  var enemyBox = {
    x: this.x,
    y: this.y,
    width: 60,
    height: 70
  };
  // conditional checking whether a collision occured
  if (playerBox.x < enemyBox.x + enemyBox.width &&
    playerBox.x + playerBox.width > enemyBox.x &&
    playerBox.y < enemyBox.y + enemyBox.height &&
    playerBox.height + playerBox.y > enemyBox.y) {
    // when collision detected the collisionDetected function is called
    this.collisionDetected();
  }
};

// when collision detected the player lives are reduced by 1 and the game restarts
Enemy.prototype.collisionDetected = function() {
  player.playerLives -= 1;
  player.characterReset();
};

/*------------->>>> GEMs configuration <<<<----------------*/

var Gem = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/gem-orange.png';
  this.gemWaitTime = undefined;
};

Gem.prototype.update = function() {
  this.checkCollision();
};

// drawing the gem on the screen, within the game's grid
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// checking for collision = intersection between player and gem means collection and scoring up
Gem.prototype.checkCollision = function() {
  // hitboxes for both player and gems
  var playerBox = {
    x: player.x,
    y: player.y,
    width: 50,
    height: 40
  };
  var gemBox = {
    x: this.x,
    y: this.y,
    width: 60,
    height: 70
  };
  // conditional check for a collision
  if (playerBox.x < gemBox.x + gemBox.width &&
    playerBox.x + playerBox.width > gemBox.x &&
    playerBox.y < gemBox.y + gemBox.height &&
    playerBox.height + playerBox.y > gemBox.y) {
    // collision is detected and the collisionDetected function activated
    this.collisionDetected();
  }
};

// when the collision is detected, the gem is taken out
// player score increased by 30 points
Gem.prototype.collisionDetected = function() {
  this.x = 900;
  this.y = 900;
  player.playerScore += 30;
  this.wait();
};

Gem.prototype.wait = function() {
  this.gemWaitTime = setTimeout(function() {
    gem.gemReset();
  }, 5000);
};

// gem respawns to a new location
Gem.prototype.gemReset = function() {
  // gems appear at one of the following X positions
  this.x = (101 * Math.floor(Math.random() * 4) + 0);
  // gems appear at one of the following Y positions
  this.y = (60 + (85 * Math.floor(Math.random() * 3) + 0));
};

/*------------->>>> HEARTs configuration <<<<----------------*/

var Heart = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Heart.png';
  this.heartWaitTime = undefined;
};

// checks for collision
Heart.prototype.update = function() {
  this.checkCollision();
};

// renders heart on the gaming grid
Heart.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// collision checking here
Heart.prototype.checkCollision = function() {
  // similiar to enemies and gems - hitboxes adjusted
  var playerBox = {
    x: player.x,
    y: player.y,
    width: 50,
    height: 40
  };
  var heartBox = {
    x: this.x,
    y: this.y,
    width: 60,
    height: 70
  };
  // conditional check for collisions
  if (playerBox.x < heartBox.x + heartBox.width &&
    playerBox.x + playerBox.width > heartBox.x &&
    playerBox.y < heartBox.y + heartBox.height &&
    playerBox.height + playerBox.y > heartBox.y) {
    // when a collision is detected the collisionDetected function runs
    this.collisionDetected();
  }
};

// heart taken off from canvas when a collision is detected
// player's life incremented by 1
Heart.prototype.collisionDetected = function() {
  this.x = 900;
  this.y = 900;
  player.playerLives += 1;
  this.wait();
};

Heart.prototype.wait = function() {
  this.heartWaitTime = setTimeout(function() {
    heart.heartReset();
  }, 30000);
};

// heart to be respawned in a new location
Heart.prototype.heartReset = function() {
  // hearts appear at one of the five X positions
  this.x = (101 * Math.floor(Math.random() * 4) + 0);
// hearts appear at one of the three Y positions
  this.y = (70 + (85 * Math.floor(Math.random() * 3) + 0));
};

/*------------->>>> PLAYER class configuration <<<<----------------*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.startingX = 200;
  this.startingY = 400;
  this.x = this.startingX;
  this.y = this.startingY;
  this.sprite = 'images/char-princess-girl.png';
  // initial player stats
  this.playerScore = 0;
  this.playerLives = 3;
};

// Required method for game
// Check if playerLives is 0, if so call reset
Player.prototype.update = function() {
  if (this.playerLives === 0) {
    reset();
  }
};

// resets player position to the default position
Player.prototype.characterReset = function() {
  this.startingX = 200;
  this.startingY = 400;
  this.x = this.startingX;
  this.y = this.startingY;
};

// once the water is reached, both score and difficulty are increased
Player.prototype.success = function() {
  this.playerScore += 20;
  speedMultiplier += 5;
  this.characterReset();
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// move the player according to keys pressed
Player.prototype.handleInput = function(allowedKeys) {
  switch (allowedKeys) {
    case "left":
      // check for wall, otherwise move left
      if (this.x > 0) {
        this.x -= 101;
      }
      break;
    case "right":
      // check for wall, otherwise move right
      if (this.x < 402) {
        this.x += 101;
      }
      break;
    case "up":
      // check if player reached water area
      // otherwise move up
      if (this.y < 0) {
        this.success();
      } else {
        this.y -= 83;
      }
      break;
    case "down":
      // check for bottom, otherwise move down
      if (this.y < 400) {
        this.y += 83;
      }
      break;
  }
};

/*------------->>>> INSTANTIATE objects <<<<----------------*/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// instantiates player
var player = new Player();

// empties the 'allEnemies' array
var allEnemies = [];

// instantiates all enemies, then sets them to quntity of 3 and pushes to 'allEnemies' array
for (var i = 0; i < 3; i++) {
  // startSpeed is a random number from 1 to 10 multiplied by the 'speedMultiplier'
  var startSpeed = speedMultiplier * Math.floor(Math.random() * 10 + 1);
  // enemies start off the game canvas (x = -100) at three different Y positions:
  allEnemies.push(new Enemy(-100, 60 + (85 * i), startSpeed));
}

// instantiates the orange gem
var gem = new Gem(101 * Math.floor(Math.random() * 4) + 0, 60 +
  (85 * Math.floor(Math.random() * 3) + 0));

// instantiates heart
var heart = new Heart(101 * Math.floor(Math.random() * 4) + 0, 70 +
  (85 * Math.floor(Math.random() * 3) + 0));

/*------------->>>> EVENT LISTENER <<<<----------------*/

// This listens for key pressed and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

var input = function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
};
document.addEventListener('keyup', input);


/*-------------
BY
Dastin
Adamowski
----------------*/
