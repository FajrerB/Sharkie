class MeleeAttack extends MovableObject {
    width = 70;
    height = 80;

    world;

    constructor(character) {
        super();
        this.speed = character.speed;
        this.speedY = character.speedY;
        this.loadeImage("./img/1.Sharkie/1.IDLE/empty.png");
        this.animate();
    }

  /**
 * Starts the animation by setting an interval to update the melee hitbox position.
 * The moveMeleeHitbox method is called approximately 60 times per second.
 */
animate() {
    this.setStoppableInterval(() => this.moveMeleeHitbox(), 1000 / 60);
  }
  
  /**
   * Updates the position of the melee hitbox based on the character's movement.
   * Adjusts the hitbox's y position and checks the character's direction to move accordingly.
   */
  moveMeleeHitbox() {
    this.y = this.world.character.y + 50;
    this.checkCharacterDirection();
    if (this.characterMovesRight()) this.moveRight();
    if (this.characterMovesLeft()) this.moveLeft();
    if (this.characterMovesUp()) this.moveUp();
    if (this.characterMovesDown()) this.moveDown();
  }
  
  /**
   * Checks if the character is moving right.
   * @returns {boolean} True if the character is moving right and has not reached the end of the level.
   */
  characterMovesRight() {
    return this.world.keyboard.RIGHT && this.world.character.x < this.world.level.level_end_x;
  }
  
  /**
   * Checks if the character is moving left.
   * @returns {boolean} True if the character is moving left and has not reached the start of the level.
   */
  characterMovesLeft() {
    return this.world.keyboard.LEFT && this.world.character.x > 0;
  }
  
  /**
   * Checks if the character is moving up.
   * @returns {boolean} True if the character is moving up and has not reached the upper boundary.
   */
  characterMovesUp() {
    return this.world.keyboard.UP && this.world.character.y > -50;
  }
  
  /**
   * Checks if the character is moving down.
   * @returns {boolean} True if the character is moving down and has not reached the lower boundary.
   */
  characterMovesDown() {
    return this.world.keyboard.DOWN && this.world.character.y < 480 - 130;
  }
  
  /**
   * Checks the character's direction and updates the melee hitbox position accordingly.
   * If the character is facing the other direction, the hitbox is moved to the left.
   * Otherwise, the hitbox is moved to the right.
   */
  checkCharacterDirection() {
    if (this.world.character.otherDirection) {
      this.x = this.world.character.x - 40;
    } else {
      this.x = this.world.character.x + 150;
    }
  }
}  