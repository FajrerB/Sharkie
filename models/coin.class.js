class Coin extends MovableObject {
  width = 48;
  height = 48;

  IMAGES_COIN = [
    "./img/4. Marcadores/1. Coins/1.png",
    "./img/4. Marcadores/1. Coins/2.png",
    "./img/4. Marcadores/1. Coins/3.png",
    "./img/4. Marcadores/1. Coins/4.png",
  ];

  constructor(x, y) {
    super().loadeImage(this.IMAGES_COIN[0]);
    this.loadImages(this.IMAGES_COIN);
    this.animate();
    this.x = x;
    this.y = y;

  }

/**
 * Starts the coin animation by setting an interval to repeatedly call the playAnimation method.
 */
animate() {
  this.setStoppableInterval(() => this.playAnimation(this.IMAGES_COIN), 300);
}
}