class HpBar extends StatusBar {

    HP_IMAGE = "img/4. Marcadores/green/100_  copia 3.png";

    constructor() {
        super()
        this.loadeImage(this.HP_IMAGE);
        this.x = 100;
        this.y = 0;
    }
}