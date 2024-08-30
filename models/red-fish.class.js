class RedFish extends MovableObject {
  width = 80;
  height = 80;
  speed = 1;
  speedY = 1;
  hadFirstContact = false;
  startTransform = false;
  isTransformed = false;
  hp = 10;
  animationIndex = 0;

  IMAGES_SWIMMING = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim1.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim2.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim3.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim4.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim5.png"
  ];

  IMAGES_SWIMMING_BIG = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim1.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim2.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim3.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim4.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim5.png"
  ];

  IMAGES_DEAD = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.png"
  ];

  IMAGES_TRANSFORM = [
    "./img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition1.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition2.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition3.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition4.png",
    "./img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition5.png"
  ];

  /**
   * Constructs a new RedFish object.
   */
  constructor() {
    super().loadeImage(this.IMAGES_SWIMMING[0]);
    this.loadImages(this.IMAGES_SWIMMING);
    this.loadImages(this.IMAGES_SWIMMING_BIG);
    this.loadImages(this.IMAGES_TRANSFORM);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2960;
    this.y = 30;

    this.animate();
  }

  /**
   * Initiates the movement and animation loops for the RedFish object.
   */
  animate() {
    this.setStoppableInterval(() => this.redFishMovement(), 1000 / 60);
    this.setStoppableInterval(() => this.redFishAnimation(), 200);
  }

  /**
   * Handles the movement logic of the RedFish object.
   */
  redFishMovement() {
    if (this.characterInSight())
      this.startTransformation();
    if (this.characterMovesRight())
      this.moveRight();
    if (this.characterMovesLeft())
      this.moveLeft();
    if (this.characterMovesUp())
      this.moveUp();
    if (this.characterMovesDown())
      this.moveDown();
  }

  /**
   * Checks if the character is in sight for transformation.
   * @returns {boolean} True if character is in sight and hasn't had first contact yet, otherwise false.
   */
  characterInSight() {
    return world && world.character.x > 2400 && !this.hadFirstContact;
  }

  /**
   * Initiates the transformation process when character is in sight.
   */
  startTransformation() {
    this.hadFirstContact = true;
    this.startTransform = true;
    this.currentImage = 0; // Typo: Should be `currentImage` instead of `currenImage`.
  }

  /**
   * Checks if the character moves to the right.
   * @returns {boolean} True if character moves right and RedFish is not dead, otherwise false.
   */
  characterMovesRight() {
    return this.hadFirstContact && world.character.x - this.x > 0 - world.character.widthOffset && !this.isDead();
  }

  /**
   * Checks if the character moves to the left.
   * @returns {boolean} True if character moves left and RedFish is not dead, otherwise false.
   */
  characterMovesLeft() {
    return this.hadFirstContact && world.character.x - this.x < 0 - world.character.widthOffset && !this.isDead();
  }

  /**
   * Checks if the character moves up.
   * @returns {boolean} True if character moves up and RedFish is not dead, otherwise false.
   */
  characterMovesUp() {
    return this.hadFirstContact && world.character.y - this.y < 0 - world.character.offsetY && !this.isDead();
  }

  /**
   * Checks if the character moves down.
   * @returns {boolean} True if character moves down and RedFish is not dead, otherwise false.
   */
  characterMovesDown() {
    return this.hadFirstContact && world.character.y - this.y > 0 - world.character.offsetY && !this.isDead();
  }

  /**
   * Moves the RedFish object to the right.
   */
  moveRight() {
    super.moveRight();
    this.otherDirection = true;
  }

  /**
   * Moves the RedFish object to the left.
   */
  moveLeft() {
    super.moveLeft();
    this.otherDirection = false;
  }

  /**
   * Handles the animation logic of the RedFish object.
   */
  redFishAnimation() {
    if (this.isDead()) {
      this.deathAnimation();
    } else if (this.startTransform) {
      this.transformAnimation();
    } else if (this.isTransformed) {
      this.playAnimation(this.IMAGES_SWIMMING_BIG);
    } else {
      this.playAnimation(this.IMAGES_SWIMMING);
    }
  }

  /**
   * Handles the death animation of the RedFish object.
   */
  deathAnimation() {
    this.speed = 0;
    this.speedY = 1;
    this.applyBuoyancy();
    this.playAnimation(this.IMAGES_DEAD);
  }

  /**
   * Plays the transformation animation once.
   */
  transformAnimation() {
    this.playAnimation(this.IMAGES_TRANSFORM);
    this.animationIndex++;
    if (this.animationIndex === this.IMAGES_TRANSFORM.length) {
      this.animationIndex = 0;
      this.startTransform = false;
      this.isTransformed = true;
    }
  }
}
