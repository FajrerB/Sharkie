class Endboss extends MovableObject {
  height = 500;
  width = 400;
  speed = 0;
  speedY = 0;
  offsetX = 20;
  offsetY = 150;
  widthOffset = 50;
  heightOffset = 220;
  attack = false;
  hadFirstContact = false;
  startSpawning = false;
  spawned = false;
  deathToBubble = false;
  hasDiedToBubble = false;
  startDeath = false;
  lastAttack = new Date().getTime();
  animationIndex = 0;

  y = -60;
  hp = 100;
  hpBarEndboss;

  IMAGES_SPAWNING = [
    "./img/2.Enemy/3 Final Enemy/1.Introduce/1.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/2.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/3.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/4.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/5.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/6.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/7.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/8.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/9.png",
    "./img/2.Enemy/3 Final Enemy/1.Introduce/10.png"
  ]

  IMAGES_SWIMMING = [
    "./img/2.Enemy/3 Final Enemy/2.floating/1.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/2.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/3.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/4.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/5.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/6.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/7.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/8.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/9.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/10.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/11.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/12.png",
    "./img/2.Enemy/3 Final Enemy/2.floating/13.png"
  ];

  IMAGES_HURT = [
    "./img/2.Enemy/3 Final Enemy/Hurt/1.png",
    "./img/2.Enemy/3 Final Enemy/Hurt/2.png",
    "./img/2.Enemy/3 Final Enemy/Hurt/3.png",
    "./img/2.Enemy/3 Final Enemy/Hurt/4.png"
  ];

  IMAGES_DEAD_ANIMATION = [
    "./img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 6.png",
    "./img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 7.png",
    "./img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 8.png",
    "./img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 9.png",
    "./img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png"
  ];

  IMAGES_DEAD = [
    "./img/2.Enemy/3 Final Enemy/Dead/Mesa de trabajo 2 copia 10.png"
  ];

  IMAGES_ATTACK = [
    "./img/2.Enemy/3 Final Enemy/Attack/1.png",
    "./img/2.Enemy/3 Final Enemy/Attack/2.png",
    "./img/2.Enemy/3 Final Enemy/Attack/3.png",
    "./img/2.Enemy/3 Final Enemy/Attack/4.png",
    "./img/2.Enemy/3 Final Enemy/Attack/5.png",
    "./img/2.Enemy/3 Final Enemy/Attack/6.png"
  ]



  constructor() {
    super().loadeImage(this.IMAGES_SWIMMING[0]);
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_SPAWNING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_DEAD_ANIMATION);
    this.loadImages(this.IMAGES_ATTACK);
    this.x = 5000;
    this.animate();

  }

  animate() {
    this.setStoppableInterval(() => this.endbossMovement(), 1000 / 60);
    this.setStoppableInterval(() => this.endbossAnimation(), 200);
  }

  /**
   * determines which move the end boss should make next
   */
  endbossMovement() {
    if (this.characterMovesRight())
      this.moveRight();
    if (this.characterMovesLeft())
      this.moveLeft();
    if (this.characterMovesUp())
      this.moveUp();
    if (this.characterMovesDown())
      this.moveDown();
    if (this.characterInSight())
      this.spawnEndboss();
    if (this.canAttack())
      this.triggerAttack();
    if (this.hasDied())
      this.triggerDeath();
  }

  characterMovesRight() {
    return this.hadFirstContact && world.character.x - this.x > 0 + 100 && !this.isDead()
  }

  characterMovesLeft() {
    return this.hadFirstContact && world.character.x - this.x < 0 + 100 && !this.isDead()
  }

  characterMovesUp() {
    return this.hadFirstContact && world.character.y - this.y < 0 + 200 && !this.isDead()
  }

  characterMovesDown() {
    return this.hadFirstContact && world.character.y - this.y > 0 + 200 && !this.isDead()
  }

  moveRight() {
    super.moveRight();
    this.otherDirection = true;
  }

  moveLeft() {
    super.moveLeft();
    this.otherDirection = false;
  }

  characterInSight() {
    return world && world.character.x > 3000 && !this.hadFirstContact
  }

  /**
   * triggers the spawning animation and shows the healt bar of the endboss
   */
  spawnEndboss() {
    this.hadFirstContact = true;
    this.hpBarEndboss = world.level.statusbars.find(bar => bar instanceof HpBarEndboss);
    this.hpBarEndboss.x = 500;
    this.startSpawning = true;
    this.currenImage = 0;
    world.background_sound.pause();
  }

  canAttack() {
    return this.spawned && !this.attackCooldown(3000) && !this.isDead()
  }

  triggerAttack() {
    this.attack = true;
    this.currenImage = 0;
  }

  hasDied() {
    return this.isDead() && !this.startDeath
  }

  triggerDeath() {
    this.deathToBubble = true;
    this.currenImage = 0;
  }

  /**
   * determines which endboss animation should be played
   */
  endbossAnimation() {
    if (this.deathToBubble) {
      this.deathAnimation();
    }
    else if (this.hasDiedToBubble) {
      this.gameOver();
    }
    else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    }
    else if (this.startSpawning) {
      this.spawningAnimation();
    }
    else if (this.attack) {
      this.attackAnimation();
    } else {
      this.defaultAnimation();
    }
  }

  /**
   * plays the death animation once and then triggers gameover 
   */
  deathAnimation() {
    this.animationIndex++;
    this.speed = 0;
    this.speedY = 0;
    this.playAnimation(this.IMAGES_DEAD_ANIMATION);
    if (this.animationIndex == this.IMAGES_DEAD_ANIMATION.length) {
      this.animationIndex = 0;
      this.deathToBubble = false;
      this.hasDiedToBubble = true;
    }
    this.startDeath = true;
  }


  /**
   * the game is paused via the intervals, the sound is deactivated and the end screen is shown
   */
  gameOver() {
    this.playAnimation(this.IMAGES_DEAD);
    world.bossfight_sound.pause();
    world.endboss_dead_sound.play();
    setTimeout(() => {
      world.endboss_dead_sound.pause();
      world.endboss_dead_sound.currentTime = 0;
      world.gameOver = true;
      world.clearAllIntervals();
      document.getElementById("endScreen").classList.remove("d-none");
      document.getElementById("noPause").classList.add("d-none");
    }, 2000);
    setTimeout(() => {
      document.getElementById("restartButtonEndscreen").classList.remove("d-none");
    }, 2500);
    setTimeout(() => {
      document.getElementById("restartButtonEndscreen").classList.add("visible");
    }, 3000);
  }


  /**
   * the spawn animation is played once
   */
  spawningAnimation() {
    this.x = 3500;
    this.playAnimation(this.IMAGES_SPAWNING);
    this.animationIndex++
    if (this.animationIndex == this.IMAGES_SPAWNING.length) {
      this.animationIndex = 0;
      this.startSpawning = false;
      this.spawned = true;
      this.speed = 0.1;
      this.speedY = 0.1;
    }
  }

  /**
   * the attack animation is played once and the speed of the endboss is increased
   */
  attackAnimation() {
    this.lastAttack = new Date().getTime();
    this.playAnimation(this.IMAGES_ATTACK);
    this.animationIndex++;
    this.offsetX = 0;
    if (this.animationIndex == this.IMAGES_ATTACK.length) {
      this.animationIndex = 0;
      this.offsetX = 20;
      this.attack = false;
      this.speed = this.speed * 1.5;
      this.speedY = this.speedY * 1.5;
      world.endboss_attack_sound.play();
    }
  }

  /**
   * the default animation is played
   */
  defaultAnimation() {
    this.playAnimation(this.IMAGES_SWIMMING);
    if (world && this.hadFirstContact) {
      world.bossfight_sound.play();
      world.background_sound.pause();
    }
  }


}
