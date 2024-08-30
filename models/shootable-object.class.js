/**
 * Represents a shootable object that can cause damage to enemies.
 * Extends from MovableObject.
 */
class ShootableObject extends MovableObject {
    /**
     * @type {number} - The damage inflicted by the shootable object.
     */
    damage;
  
    /**
     * @type {boolean} - Indicates the direction of the bubble.
     */
    bubbleOtherDirection = false;
  
    /**
     * Constructs a ShootableObject instance.
     * @param {number} x - The initial x-coordinate of the object.
     * @param {number} y - The initial y-coordinate of the object.
     */
    constructor(x, y) {
      super();
      this.x = x;
      this.y = y;
      this.height = 60;
      this.width = 60;
  
      this.checkBubbleType();
      this.shoot();
    }
  
    /**
     * Checks the type of bubble (poisoned or regular) and sets its properties accordingly.
     */
    checkBubbleType() {
      if (this.hasPosion()) {
        this.damage = 20;
        this.loadeImage("img/1.Sharkie/4.Attack/Bubble trap/Poisoned Bubble (for whale).png");
        world.character.posions--;
      } else {
        this.damage = 10;
        this.loadeImage("img/1.Sharkie/4.Attack/Bubble trap/Bubble.png");
      }
    }
  
    /**
     * Initiates the shooting action of the bubble.
     */
    shoot() {
      this.speedY = 0;
      if (!world.character.otherDirection) {
        this.bubbleOtherDirection = false;
        setInterval(() => {
          this.x += 20;
        }, 1000 / 25);
      } else {
        this.bubbleOtherDirection = true;
        setInterval(() => {
          this.x -= 20;
        }, 1000 / 25);
      }
      setTimeout(() => {
        this.speedY = 10;
        this.applyBuoyancy();
      }, 600);
    }
  }
  