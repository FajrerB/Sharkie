class JellyFishGreen extends MovableObject {
  width = 80;
  height = 80;
  hp = 10;
  speed = 0;
  centerX = 200;
  radius = 100;
  angle = 0;
  speed = 0;
  x = 1000;
  circularMovementInterval;
  deathDirection = false;

  IMAGES_SWIMMING = [
    "./img/2.Enemy/2 Jelly fish/S｣per dangerous/Green 1.png",
    "./img/2.Enemy/2 Jelly fish/S｣per dangerous/Green 2.png",
    "./img/2.Enemy/2 Jelly fish/S｣per dangerous/Green 3.png",
    "./img/2.Enemy/2 Jelly fish/S｣per dangerous/Green 4.png",
  ];

  IMAGES_DEAD = [
    "./img/2.Enemy/2 Jelly fish/Dead/green/g1.png",
    "./img/2.Enemy/2 Jelly fish/Dead/green/g2.png",
    "./img/2.Enemy/2 Jelly fish/Dead/green/g3.png",
    "./img/2.Enemy/2 Jelly fish/Dead/green/g4.png",
  ];

  constructor(centerX, centerY, rotationDirection) {
    super().loadeImage(this.IMAGES_SWIMMING[0]);
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_DEAD);

    this.rotationDirection = rotationDirection;
    this.centerX = centerX;
    this.centerY = centerY;

    this.animate();
  }

  /**
   * Starts the animation by setting intervals for different movements and animations.
   */
  animate() {
    this.setStoppableInterval(() => this.moveLeft(), 1000 / 60);
    this.setStoppableInterval(() => this.greenJellyfishMovement(), 1000 / 60);
    this.setStoppableInterval(() => this.greenJellyfishAnimation(), 200);
  }

  /**
   * circular motion
   */
  greenJellyfishMovement() {
    this.angle += 0.01 * this.rotationDirection;
    this.x = this.centerX + this.radius * Math.cos(this.angle);
    this.y = this.centerY + this.radius * Math.sin(this.angle);
  }

/**
   * fish animation
   */
  greenJellyfishAnimation() {
    if (this.isDead()) {
      this.deathAnimation();
    } else {
      this.playAnimation(this.IMAGES_SWIMMING);
    }
  }

  /**
   * stop the circular movement of the jellyfish and play the death animation
   * depending on which way the jellyfish should move during the death animation
   */
  deathAnimation() {
    for (let i = 1; i < this.intervalIds.length; i = i + 3) {
      clearInterval(this.intervalIds[i]);
    }
    this.rotationDirection = 0;
    if (this.deathDirection) {
      this.speed = 5;
    } else {
      this.speed = -5;
    }
    this.speedY = 1;
    this.applyBuoyancy();
    this.playAnimation(this.IMAGES_DEAD);
  }
}
