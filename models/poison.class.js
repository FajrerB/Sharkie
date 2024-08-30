class Poison extends MovableObject {
  width = 80;
  height = 80;
  IMAGES_POISON = [
    "./img/4. Marcadores/Posiขn/Animada/1.png",
    "./img/4. Marcadores/Posiขn/Animada/2.png",
    "./img/4. Marcadores/Posiขn/Animada/3.png",
    "./img/4. Marcadores/Posiขn/Animada/4.png",
    "./img/4. Marcadores/Posiขn/Animada/5.png",
    "./img/4. Marcadores/Posiขn/Animada/6.png",
    "./img/4. Marcadores/Posiขn/Animada/7.png",
    "./img/4. Marcadores/Posiขn/Animada/8.png"
  ];

  IMAGES_POISON_GROUND_LEFT = [
    "./img/4. Marcadores/Posiขn/Light - Left.png",
  ];

  IMAGES_POISON_GROUND_RIGHT = [
    "./img/4. Marcadores/Posiขn/Light - Right.png",
  ];

  /**
   * Constructor for the Poison class.
   * @param {number} x - The x-coordinate of the Poison instance.
   * @param {number} y - The y-coordinate of the Poison instance.
   * @param {string} form - The form of the poison animation ('left', 'right', or default).
   */
  constructor(x, y, form) {
    super().loadeImage(this.IMAGES_POISON[0]);
    this.loadImages(this.IMAGES_POISON);
    this.loadImages(this.IMAGES_POISON_GROUND_LEFT);
    this.loadImages(this.IMAGES_POISON_GROUND_RIGHT);
    this.animate();
    this.x = x;
    this.y = y;
    this.form = form;
  }

  /**
   * Starts the animation of the Poison instance.
   */
  animate() {
    this.setStoppableInterval(() => this.posionAnimation(), 300);
  }

  /**
   * Executes the poison animation based on the form.
   */
  posionAnimation() {
    if (this.form === "left") {
      this.playAnimation(this.IMAGES_POISON_GROUND_LEFT);
    } else if (this.form === "right") {
      this.playAnimation(this.IMAGES_POISON_GROUND_RIGHT);
    } else {
      this.playAnimation(this.IMAGES_POISON);
    }
  }
}
