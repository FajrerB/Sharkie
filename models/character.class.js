class Character extends MovableObject {
  width = 180;
  height = 150;
  speed = 8;
  speedY = 8;
  offsetX = 25;
  offsetY = 65;
  widthOffset = 50;
  heightOffset = 90;
  lastDamage;
  animationIndex = 0;
  hadFirstContact = false;
  attackPossibleMelee = false;
  attackPossibleRange = false;
  isAttacking = false;
  deathToPoison = false;
  hasDiedToPosion = false;
  deathToShock = false;
  hasDiedToShock = false;
  startDeath = false;
  world;

  constructor() {
    super().loadeImage("./img/1.Sharkie/3.Swim/1.png");
    this.loadImages(IMAGES_SWIMMING);
    this.loadImages(IMAGES_DEAD_POISONED);
    this.loadImages(IMAGES_DEAD_POISONED_ANIMATION);
    this.loadImages(IMAGES_HURT_POISONED);
    this.loadImages(IMAGES_DEAD_SHOCK);
    this.loadImages(IMAGES_DEAD_SHOCK_ANIMATION);
    this.loadImages(IMAGES_HURT_SHOCK);
    this.loadImages(IMAGES_RANGE_ATTACK_POISON);
    this.loadImages(IMAGES_RANGE_ATTACK);
    this.loadImages(IMAGES_MELEE_ATTACK);
    this.loadImages(IMAGES_IDLE);
    this.loadImages(IMAGES_IDLE_LONG);
    this.animate();
  }

/**
 * Sets up animation intervals for character movement and animation.
 */
  animate() {
    this.setStoppableInterval(() => this.characterMovement(), 1000 / 60);
    this.setStoppableInterval(() => this.characterAnimation(), 150);
  }

  /**
   * determines the next move for the character
   */
  characterMovement() {
    world.swimming_sound.pause();
    if (this.canMoveRight()) this.moveRight();
    if (this.canMoveLeft()) this.moveLeft();
    if (this.canMoveUp()) this.moveUp();
    if (this.canMoveDown()) this.moveDown();
    if (this.canMeleeAttack()) this.triggerMelleAttack();
    if (this.canRangeAttack()) this.triggerRangeAttack();
    if (this.diedToPosion()) this.triggerPosionDeath();
    if (this.diedToShock()) this.triggerShockDeath();
    if (this.hadFirstContactEndboss()) this.hadFirstContact = true;
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Checks if the character can move to the right.
   * @returns {boolean} - True if the right arrow key is pressed and the character is within the level bounds.
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Moves the character to the right, plays the swimming sound, and pauses the idle sound.
   */
  moveRight() {
    super.moveRight();
    this.otherDirection = false;
    world.swimming_sound.play();
    world.idle_sound.pause();
  }

  /**
   * Checks if the character can move to the left.
   * @returns {boolean} - True if the left arrow key is pressed and the character is within the level bounds.
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /**
   * Moves the character to the left, plays the swimming sound, and pauses the idle sound.
   */
  moveLeft() {
    super.moveLeft();
    this.otherDirection = true;
    world.swimming_sound.play();
    world.idle_sound.pause();
  }

  /**
   * Checks if the character can move up.
   * @returns {boolean} - True if the up arrow key is pressed and the character is within the level bounds.
   */
  canMoveUp() {
    return this.world.keyboard.UP && this.y > -50;
  }

  /**
   * Moves the character up, plays the swimming sound, and pauses the idle sound.
   */
  moveUp() {
    super.moveUp();
    world.swimming_sound.play();
    world.idle_sound.pause();
  }

  /**
   * Checks if the character can move down.
   * @returns {boolean} - True if the down arrow key is pressed and the character is within the level bounds.
   */
  canMoveDown() {
    return this.world.keyboard.DOWN && this.y < 480 - 130;
  }

  /**
   * Moves the character down, plays the swimming sound, and pauses the idle sound.
   */
  moveDown() {
    super.moveDown();
    world.swimming_sound.play();
    world.idle_sound.pause();
  }

  /**
   * Checks if the character can perform a melee attack.
   * @returns {boolean} - True if the space bar is pressed and the attack cooldown has passed.
   */
  canMeleeAttack() {
    return this.world.keyboard.SPACE && !this.attackCooldown(800);
  }

  /**
   * Triggers a melee attack, plays the melee sound, and pauses the idle sound.
   */
  triggerMelleAttack() {
    this.attackPossibleMelee = true;
    this.currenImage = 0;
    world.melee_sound.play();
    world.idle_sound.pause();
  }

  /**
   * Checks if the character can perform a ranged attack.
   * @returns {boolean} - True if the 'D' key is pressed and the attack cooldown has passed.
   */
  canRangeAttack() {
    return this.world.keyboard.D && !this.attackCooldown(800);
  }

  /**
   * Triggers a ranged attack and pauses the idle sound.
   */
  triggerRangeAttack() {
    this.attackPossibleRange = true;
    this.currenImage = 0;
    world.idle_sound.pause();
  }

  /**
   * Checks if the character died due to poison.
   * @returns {boolean} - True if the character is dead, the last damage was poison, and the death sequence has not started.
   */
  diedToPosion() {
    return this.isDead() && this.lastDamage == "poisoned" && !this.startDeath;
  }

  /**
   * Triggers the poison death sequence.
   */
  triggerPosionDeath() {
    this.deathToPoison = true;
    this.currenImage = 0;
  }

  /**
   * Checks if the character died due to shock.
   * @returns {boolean} - True if the character is dead, the last damage was shock, and the death sequence has not started.
   */
  diedToShock() {
    return this.isDead() && this.lastDamage == "shocked" && !this.startDeath;
  }

  /**
   * Triggers the shock death sequence.
   */
  triggerShockDeath() {
    this.deathToShock = true;
    this.currenImage = 0;
  }

  /**
   * Checks if the character had first contact with the end boss.
   * @returns {boolean} - True if the character's x-coordinate is greater than 3000 and it hasn't had first contact yet.
   */
  hadFirstContactEndboss() {
    return this.x > 3000 && !this.hadFirstContact;
  }

  /**
   * determines which character animation should be played
   */
  characterAnimation() {
    if (this.deathToPoison) {
      this.deathAnimation("poison");
    } else if (this.hasDiedToPosion) {
      this.triggerGameOver("poison");
    } else if (this.deathToShock) {
      this.deathAnimation("shock");
    } else if (this.hasDiedToShock) {
      this.triggerGameOver("shock");
    } else if (this.gotHurt("poison")) {
      this.hurtAnimation("poison");
    } else if (this.gotHurt("shock")) {
      this.hurtAnimation("shock");
    } else if (this.isMoving()) {
      this.movingAnimation();
    } else if (this.attackPossibleMelee) {
      this.meleeAttack();
    } else if (this.attackPossibleRange) {
      this.rangeAttack();
    } else if (this.isIdle()) {
      this.idleAnimation();
    }
  }

  /**
   * depending on the deathreason, the corresponding death animation is played
   * @param {string} deathReason - last damage type dealt to the character before death
   */
  deathAnimation(deathReason) {
    this.animationIndex++;
    this.speed = 0;
    this.speedY = 0;
    if (deathReason == "poison") {
      this.playAnimation(IMAGES_DEAD_POISONED_ANIMATION);
      if (this.animationIndex == IMAGES_DEAD_POISONED_ANIMATION.length) {
        this.animationIndex = 0;
        this.deathToPoison = false;
        this.hasDiedToPosion = true;
      }
    } else if (deathReason == "shock") {
      this.playAnimation(IMAGES_DEAD_SHOCK_ANIMATION);
      if (this.animationIndex == IMAGES_DEAD_SHOCK_ANIMATION.length) {
        this.animationIndex = 0;
        this.deathToShock = false;
        this.hasDiedToShock = true;
      }
    }
    this.startDeath = true;
  }

  /**
   * shows the dead character  image depending on the death reason and triggers gamover
   * @param {string} deathReason - last damage type dealt to the character before death
   */
  triggerGameOver(deathReason) {
    if (deathReason == "poison") {
      this.playAnimation(IMAGES_DEAD_POISONED);
    } else if (deathReason == "shock") {
      this.playAnimation(IMAGES_DEAD_SHOCK);
    }
    this.world.game_over_sound.play();
    setTimeout(() => {
      this.gameOver();
    }, 500);
  }

  /**
   * the game is paused via the intervals, the sound is deactivated and the end screen is shown
   */
  gameOver() {
    this.world.clearAllIntervals();
    this.world.gameOver = true;
    this.muteOngoingSound();
    this.showGameOverScreen();
  }

/**
 * Mutes and resets all ongoing sounds in the game.
 */
  muteOngoingSound() {
    world.background_sound.pause();
    world.background_sound.currentTime = 0;
    world.bossfight_sound.pause();
    world.bossfight_sound.currentTime = 0;
    world.idle_sound.pause();
    world.idle_sound.currentTime = 0;
  }

  /**
   * shows the end screen and let the "try again" button fade in
   */
  showGameOverScreen() {
    document.getElementById("gameover").classList.remove("d-none");
    document.getElementById("noPause").classList.add("d-none");
    setTimeout(() => {
      document
        .getElementById("restartButtonGameover")
        .classList.remove("d-none");
    }, 500);
    setTimeout(() => {
      document.getElementById("restartButtonGameover").classList.add("visible");
      world.game_over_sound.pause();
      world.game_over_sound.currentTime = 0;
    }, 1000);
  }

  /**
   * checks if and what type of damage was dealt to the character
   * @param {string} hurtReason - last damage type dealt to the character
   * @returns true if the hur reasons matches the last damage type dealt to the character
   */
  gotHurt(hurtReason) {
    if (hurtReason == "poison") {
      return this.isHurt() && this.lastDamage == "poisoned";
    } else if (hurtReason == "shock") {
      return this.isHurt() && this.lastDamage == "shocked";
    }
  }

  /**
   * playes the hurt Animation depend on the last type of damage taken
   * @param {string} hurtReason - last damage type dealt to the character
   */
  hurtAnimation(hurtReason) {
    if (hurtReason == "poison") {
      this.playAnimation(IMAGES_HURT_POISONED);
      this.world.poisoned_sound.play();
    } else if (hurtReason == "shock") {
      this.playAnimation(IMAGES_HURT_SHOCK);
      this.world.shock_sound.play();
    }
  }

/**
 * Checks if the character is moving. */
  isMoving() {
    return (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.UP ||
      this.world.keyboard.DOWN
    );
  }

/**
 * Plays the swimming animation and updates the last move timestamp.
 */
  movingAnimation() {
    this.playAnimation(IMAGES_SWIMMING);
    this.lastMove = new Date().getTime();
  }

  /**
   * plays the melee attack animation only once
   */
  meleeAttack() {
    this.playAnimation(IMAGES_MELEE_ATTACK);
    this.animationIndex++;
    if (this.animationIndex == IMAGES_MELEE_ATTACK.length) {
      this.animationIndex = 0;
      this.attackPossibleMelee = false;
    }
    this.lastAttack = new Date().getTime();
    this.lastMove = new Date().getTime();
  }

  /**
   * plays the corresponding ranged attack once, depending on
   * whether the character has poison or not, and then shoots a bubble
   */
  rangeAttack() {
    const images = this.hasPosion()
      ? IMAGES_RANGE_ATTACK_POISON
      : IMAGES_RANGE_ATTACK;
    this.playAnimation(images);
    this.animationIndex++;
    if (this.animationIndex === images.length) {
      this.animationIndex = 0;
      this.attackPossibleRange = false;
      this.world.checkShootObjects();
    }
    this.lastAttack = Date.now();
    this.lastMove = Date.now();
  }

  /**
 * Plays the idle animation, pauses the background sound, and plays the idle sound.
 */
  idleAnimation() {
    this.playAnimation(IMAGES_IDLE_LONG);
    this.world.background_sound.pause();
    this.world.idle_sound.play();
  }
}
