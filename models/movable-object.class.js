class MovableObject extends DrawableObject {

  speed = 0.15;
  speedY = 0.15;
  buoyancy = 0.05;
  otherDirection = false;
  hp = 10;
  coins = 0;
  posions = 0;
  lastHit = 0;

  offsetX = 0;
  offsetY = 0;
  widthOffset = 0;
  heightOffset = 0;
  circularMovementInterval;
  intervalIds = [];
  lastAttack = new Date().getTime();
  lastMove = new Date().getTime();


   /**
   * Checks if this object is colliding with another movable object.
   * 
   * @param {object} mo - The other movable object
   * @returns {boolean} - True if colliding; otherwise false
   */
   isColliding(mo) {
    return (
      this.x + this.offsetX + this.width - this.widthOffset >= mo.x + mo.offsetX &&
      this.x + this.offsetX <= mo.x + mo.offsetX + mo.width - mo.widthOffset &&
      this.y + this.offsetY + this.height - this.heightOffset >= mo.y + mo.offsetY &&
      this.y + this.offsetY <= mo.y + mo.offsetY + mo.height - mo.heightOffset
    );
  }

  /**
   * Adds a coin and increases health points upon collecting 10 coins.
   * 
   * @param {Audio} coin_sound 
   * @param {Audio} level_up_sound 
   */
  addCoin(coin_sound, level_up_sound) {
    if (!coin_sound.currentTime == 0) {
      coin_sound.currentTime = 0; 
    }
    this.coins++;
    coin_sound.play();
    this.addHp(level_up_sound);
  }

  /**
   * Increases health points when enough coins (10 coins) are collected.
   * 
   * @param {Audio} level_up_sound - Sound effect for increasing health points
   */
  addHp(level_up_sound) {
    if (this.coins == 10) {
      this.coins = 0;
      this.hp++;
      level_up_sound.play();
    }
  }

  /**
   * Adds a poison and plays the corresponding sound effect.
   * 
   * @param {Audio} item_pickup_sound - Sound effect for picking up a poison
   */
  addPoison(item_pickup_sound) {
    this.posions++;
    item_pickup_sound.play();
  }

  /**
   * Processes the damage taken by the object from a hit.
   * 
   * @param {number} damage - The amount of damage taken
   */
  hit(damage) {
    if (!this.isHurt()) {
      this.hp -= damage;
      if (this.hp < 0) {
        this.hp = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    }
  }

  /**
   * Checks if the object is currently hurt (within a cooldown period after a hit).
   * 
   * @returns {boolean} - True if the object is hurt; otherwise false
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed < 1300;
  }

  /**
   * Checks if the object is dead (health points equal to zero).
   * 
   * @returns {boolean} - True if the object is dead; otherwise false
   */
  isDead() {
    return this.hp == 0;
  }

  /**
   * Checks if the object has been idle for a long period of time (e.g., 10 seconds).
   * 
   * @returns {boolean} - True if the object is idle; otherwise false
   */
  isIdle() {
    let timepassed = new Date().getTime() - this.lastMove;
    return timepassed > 10000;
  }

  /**
   * Checks if there's a cooldown period active (e.g., for attacks).
   * 
   * @param {number} cooldown - The cooldown period in milliseconds
   * @returns {boolean} - True if still within cooldown; otherwise false
   */
  attackCooldown(cooldown) {
    let timepassed = new Date().getTime() - this.lastAttack;
    return timepassed < cooldown;
  }

  /**
   * Checks if the character has poison items available.
   * 
   * @returns {boolean} - True if the character has poisons; otherwise false
   */
  hasPosion() {
    return world.character.posions > 0;
  }

  /**
   * Plays an animation sequence with the provided images.
   * 
   * @param {array} images - Array of image paths for the animation
   */
  playAnimation(images) {
    let i = this.currenImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currenImage++;
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveUp() {
    this.y -= this.speedY;
  }

  moveDown() {
    this.y += this.speedY;
  }

  applyBuoyancy() {
    setInterval(() => {
      if (this.isUnderWater() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY += this.buoyancy;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is underwater based on its y position.
   * 
   * @returns {boolean} - True if the object is underwater; otherwise false
   */
  isUnderWater() {
    return this.y > -200;
  }

  /**
   * Sets an interval that can be stopped later.
   * 
   * @param {function} fn - The function to be executed at intervals
   * @param {number} time - The interval time in milliseconds
   */
  setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervalIds.push(id);
  }
}