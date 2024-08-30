class HpBarEndboss extends StatusBar {
    width = 210;
    height = 90;
    precentage = 100;

    HP_IMAGES = [
        "img/4. Marcadores/orange/0hp.png",
        "img/4. Marcadores/orange/20hp.png",
        "img/4. Marcadores/orange/40hp.png",
        "img/4. Marcadores/orange/60hp.png",
        "img/4. Marcadores/orange/80hp.png",
        "img/4. Marcadores/orange/100hp.png"
    ];

    constructor() {
        super().loadeImage(this.HP_IMAGES[5]);
        this.loadImages(this.HP_IMAGES);
        this.x = 5000;
        this.y = -10;
    }

/**
 * Sets the health percentage and updates the image based on the health percentage.
 * @param {number} hpPercentage - The current health percentage (0 to 100).
 */
setPercentage(hpPercentage) {
    this.hpPercentage = hpPercentage;
    let imagePath = this.HP_IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[imagePath];
  }
  
  /**
   * Resolves the appropriate image index based on the current health percentage.
   * @returns {number} The index of the image corresponding to the current health percentage.
   */
  resolveImageIndex() {
    if (this.hpPercentage == 100) {
      return 5;
    } else if (this.hpPercentage >= 80) {
      return 4;
    } else if (this.hpPercentage >= 60) {
      return 3;
    } else if (this.hpPercentage >= 40) {
      return 2;
    } else if (this.hpPercentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}  