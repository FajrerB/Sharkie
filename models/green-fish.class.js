class GreenFish extends MovableObject {
  form;
  hp = 10;

  IMAGES_SWIMMING = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim2.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim3.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim4.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim5.png",
  ];

  IMAGES_SWIMMING_BIG = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim1.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim2.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim3.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim4.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/1.bubbleswim5.png",
  ];

  IMAGES_DEAD = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png",
  ];

  IMAGES_DEAD_BIG = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png",
  ];

  constructor(x, y, form) {
    super().loadeImage(this.IMAGES_SWIMMING[0]);
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_SWIMMING_BIG);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_DEAD_BIG);
    this.form = form;
    this.x = x;
    this.y = y;
    this.speed = 0.15;

    if (this.form === "big") {
      this.width = 80;
      this.height = 80;
    } else {
      this.width = 60;
      this.height = 60;
    }

    this.animate();
  }

  /**
   * Starts the animation by setting intervals for moving left and animating the green fish.
   */
  animate() {
    this.setStoppableInterval(() => this.moveLeft(), 1000 / 60);
    this.setStoppableInterval(() => this.greenFishAnimation(), 200);
  }

  /**
   * determines which animation should be played
   */
  greenFishAnimation() {
    if (this.form == "big" && this.isDead()) {
      this.deathAnimation("big");
    } else if (this.form == "big") {
      this.playAnimation(this.IMAGES_SWIMMING_BIG);
    } else if (this.isDead()) {
      this.deathAnimation("normal");
    } else {
      this.playAnimation(this.IMAGES_SWIMMING);
    }
  }
  /**
   * plays the death animation of the fish depending on its form
   * @param {string} form - determines whether it is a normal or big fish
   */
  deathAnimation(form) {
    this.speed = 0;
    this.speedY = 1;
    this.applyBuoyancy();
    if (form == "big") {
      this.playAnimation(this.IMAGES_DEAD_BIG);
    } else {
      this.playAnimation(this.IMAGES_DEAD);
    }
  }
}
