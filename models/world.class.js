/**
 * Represents the game world where characters, enemies, and objects interact.
 */
class World {
  /**
   * @param {HTMLCanvasElement} canvas - The canvas element where the game is rendered.
   * @param {Keyboard} keyboard - The keyboard object handling user input.
   */
  constructor(canvas, keyboard) {
    this.character = new Character();
    this.level = level1;
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.sound = true;
    this.hpBarEndboss;
    this.ctx = canvas.getContext("2d");
    this.camera_x = 0;
    this.shootableObjects = [];
    this.intervalIds = [];
    this.meleeAttack = new MeleeAttack(this.character);
    this.gameOver = false;

    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Resets the character to its initial state.
   */
  resetCharacter() {
    this.character = new Character();
    this.setWorld();
  }

  /**
   * Sets up the game world with character and melee attack references.
   */
  setWorld() {
    this.character.world = this;
    this.meleeAttack.world = this;
    this.hpBarEndboss = this.level.statusbars.find(bar => bar instanceof HpBarEndboss);
  }

  /**
   * Starts running the game loop.
   */
  run() {
    this.setStoppableInterval(() => this.checkCollisions(), 1000 / 60);
  }

  /**
   * Checks collisions between game entities.
   */
  checkCollisions() {
    this.collisionCharacterEnemy();
    this.collisionCharacterColletible();
    this.collisionMelleAttackFish();
    this.collisionBubbleJellyFish();
    this.collisionBubbleEndboss();
  }

  /**
   * Handles collision between the character and enemies.
   */
  collisionCharacterEnemy() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !enemy.isDead()) {
        this.character.hit(1);
        if (enemy instanceof GreenFish || enemy instanceof RedFish || enemy instanceof Endboss) {
          this.character.lastDamage = "poisoned";
        }
        if (enemy instanceof JellyFishYellow || enemy instanceof JellyFishGreen) {
          this.character.lastDamage = "shocked";
        }
      }
    });
  }

  /**
   * Handles collision between the character and collectible items.
   */
  collisionCharacterColletible() {
    this.level.collectibles = this.level.collectibles.filter((collectible) => {
      if (this.character.isColliding(collectible)) {
        if (collectible instanceof Poison) {
          this.character.addPoison(this.item_pickup_sound);
        }
        if (collectible instanceof Coin) {
          this.character.addCoin(this.coin_sound, this.level_up_sound);
        }
        return false;
      }
      return true;
    });
  }

  /**
   * Handles collision between the melee attack and enemies.
   */
  collisionMelleAttackFish() {
    this.level.enemies.forEach((enemy) => {
      if (this.meleeAttack.isColliding(enemy) && this.keyboard.SPACE && !this.character.attackCooldown(800)) {
        if (enemy instanceof GreenFish || enemy instanceof RedFish) {
          setTimeout(() => {
            enemy.hit(10);
            this.fish_hit_sound.play();
          }, 800);
        }
      }
    });
  }

  /**
   * Handles collision between the bubble and jellyfish enemies.
   */
  collisionBubbleJellyFish() {
    this.shootableObjects = this.shootableObjects.filter((bubble) => {
      let collidesWithEnemy = false;
      this.level.enemies.forEach((enemy) => {
        if (bubble.isColliding(enemy)) {
          if (enemy instanceof JellyFishYellow || enemy instanceof JellyFishGreen) {
            enemy.hit(10);
            enemy.deathDirection = bubble.bubbleOtherDirection;
            this.jellyfish_hit_sound.play();
            collidesWithEnemy = true;
          }
        }
      });
      return !collidesWithEnemy;
    });
  }

  /**
   * Handles collision between the bubble and the endboss enemy.
   */
  collisionBubbleEndboss() {
    this.shootableObjects = this.shootableObjects.filter((bubble) => {
      let collidesWithEnemy = false;
      this.level.enemies.forEach((enemy) => {
        if (bubble.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            collidesWithEnemy = true;
            enemy.hit(bubble.damage);
            this.endboss_hit_sound.play();
            if (this.hpBarEndboss) {
              this.hpBarEndboss.setPrecentage(enemy.hp);
            }
          }
        }
      });
      return !collidesWithEnemy;
    });
  }

  /**
   * Creates a new shootable object and adds it to the game world.
   */
  checkShootObjects() {
    let bubblePosition = this.character.otherDirection ? 0 : 120;
    let bubble = new ShootableObject(this.character.x + bubblePosition, this.character.y + 50);
    this.shootableObjects.push(bubble);
    this.bubble_sound.play();
  }

  /**
   * Draws the entire game world on the canvas.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.collectibles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.shootableObjects);
    this.addToMap(this.character);
    this.addToMap(this.meleeAttack);
    this.ctx.translate(-this.camera_x, 0);
    this.addObjectsToMap(this.level.statusbars);
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds multiple objects to be drawn on the canvas.
   * @param {MovableObject[]} objects - Array of movable objects to be drawn.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single movable object to be drawn on the canvas.
   * @param {MovableObject} mo - The movable object to be added to the map.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawText(this.ctx, this.character.posions, 75);
    mo.drawText(this.ctx, this.character.hp, 170);
    mo.drawText(this.ctx, this.character.coins, 290);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image horizontally for drawing purposes.
   * @param {MovableObject} mo - The movable object whose image is flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the flipped image to its original state after drawing.
   * @param {MovableObject} mo - The movable object to restore its image.
   */
  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }

  /**
   * Sets a stoppable interval for a given function and time interval.
   * @param {function} fn - The function to be called repeatedly.
   * @param {number} time - The time interval in milliseconds.
   */
  setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervalIds.push(id);
  }

  /**
   * Clears all intervals and timeouts related to the game world.
   */
  clearAllIntervals() {
    this.intervalIds.forEach(interval => clearInterval(interval));
    this.character.intervalIds.forEach(interval => clearInterval(interval));
    this.level.enemies.forEach(enemy => {
      enemy.intervalIds.forEach(interval => clearInterval(interval));
    });
    this.level.collectibles.forEach(collectible => {
      collectible.intervalIds.forEach(interval => clearInterval(interval));
    });
  }

  /**
   * Resumes all intervals and animations in the game world.
   */
  resumeAllIntervals() {
    this.run();
    this.character.animate();
    this.level.enemies.forEach(enemy => {
      enemy.animate();
    });
    this.level.collectibles.forEach(collectible => {
      collectible.animate();
    });
  }
}
