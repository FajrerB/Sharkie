class PosionBar extends StatusBar {

    POSION_IMAGE = "img/4. Marcadores/green/100_ copia 5.png";

    constructor() {
        super()
        this.loadeImage(this.POSION_IMAGE);
        this.x = 10;
        this.y = -5;
    }
}